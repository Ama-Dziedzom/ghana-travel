#!/usr/bin/env node
/**
 * Ghana Travel Blog — Content Migration Script
 * 
 * Migrates all local MDX content into Supabase and uploads images to Storage.
 * 
 * Run with:
 *   node --env-file=.env.local scripts/migrate-content.mjs
 *
 * Requirements:
 *   - NEXT_PUBLIC_SUPABASE_URL must be set in .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY must be set in .env.local  (bypasses RLS)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, basename } from 'path'
import matter from 'gray-matter'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROOT = process.cwd()

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`)
}
function success(msg) { log('✅', msg) }
function info(msg)    { log('ℹ️ ', msg) }
function warn(msg)    { log('⚠️ ', msg) }
function err(msg)     { log('❌', msg) }

// Read and parse a .env.local file manually (Node 18 fallback)
function loadEnv() {
  const envPath = join(ROOT, '.env.local')
  if (!existsSync(envPath)) {
    err('.env.local not found. Create it first.')
    process.exit(1)
  }
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx < 0) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY || SERVICE_KEY === 'your-service-role-key-here') {
  err('Missing or placeholder SUPABASE_SERVICE_ROLE_KEY in .env.local')
  err('Get it from: Supabase Dashboard → Project Settings → API → service_role key')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── Image Upload ─────────────────────────────────────────────────────────────

async function uploadImage(localPath) {
  const absPath = join(ROOT, 'public', localPath)
  if (!existsSync(absPath)) {
    warn(`Image not found locally: ${absPath}`)
    return localPath // fall back to original path
  }

  const fileName = basename(localPath)
  const fileBuffer = readFileSync(absPath)
  const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg'

  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      upsert: true, // overwrite if already uploaded
    })

  if (error) {
    warn(`Could not upload ${fileName}: ${error.message}`)
    return localPath
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName)

  success(`Uploaded image → ${publicUrl}`)
  return publicUrl
}

// ─── Get or Create Admin Author ───────────────────────────────────────────────

async function getOrCreateAuthor(name, email) {
  // Check if this author email already exists
  const { data: existing } = await supabase
    .from('authors')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existing) return existing.id

  const { data, error } = await supabase
    .from('authors')
    .insert({ name, email, role: 'author' })
    .select('id')
    .single()

  if (error) {
    warn(`Could not create author ${name}: ${error.message}`)
    return null
  }

  success(`Created author: ${name}`)
  return data.id
}

// ─── Migrate Articles ─────────────────────────────────────────────────────────

async function migrateArticles() {
  console.log('\n📰 Migrating Articles...\n')

  const dir = join(ROOT, 'content/articles')
  const files = readdirSync(dir).filter(f => f.endsWith('.mdx'))

  for (const file of files) {
    const source = readFileSync(join(dir, file), 'utf8')
    const { data: fm, content: body } = matter(source)

    info(`Processing: ${fm.title}`)

    // Map author names to emails
    const authorEmailMap = {
      'Ama Serwaa':  'ama@ghanatrails.com',
      'Kofi Mensah': 'kofi@ghanatrails.com',
      'Naa Adjeley': 'naa@ghanatrails.com',
    }
    const authorEmail = authorEmailMap[fm.author] || 'admin@ghanatrails.com'
    const author_id = await getOrCreateAuthor(fm.author || 'Unknown Author', authorEmail)

    const cover_image = fm.coverImage
      ? await uploadImage(fm.coverImage)
      : null

    const { error } = await supabase.from('articles').upsert({
      title:        fm.title,
      slug:         fm.slug,
      category:     fm.category,
      excerpt:      fm.excerpt ?? null,
      cover_image,
      author_id,
      published_at: fm.publishedAt ?? null,
      read_time:    fm.readTime ?? null,
      body_mdx:     body.trim(),
      status:       'published',
    }, { onConflict: 'slug' })

    if (error) {
      err(`Failed to insert article "${fm.title}": ${error.message}`)
    } else {
      success(`Article migrated: "${fm.title}"`)
    }
  }
}

// ─── Migrate Itineraries ──────────────────────────────────────────────────────

async function migrateItineraries() {
  console.log('\n🗺️  Migrating Itineraries...\n')

  const dir = join(ROOT, 'content/itineraries')
  const files = readdirSync(dir).filter(f => f.endsWith('.mdx'))

  for (const file of files) {
    const source = readFileSync(join(dir, file), 'utf8')
    const { data: fm, content: body } = matter(source)

    info(`Processing: ${fm.title}`)

    const cover_image = fm.coverImage
      ? await uploadImage(fm.coverImage)
      : null

    // Upsert the itinerary record
    const { data: itinerary, error } = await supabase
      .from('itineraries')
      .upsert({
        title:         fm.title,
        slug:          fm.slug,
        duration:      fm.duration ?? null,
        regions:       fm.regions ?? [],
        vibe_tags:     fm.vibeTags ?? [],
        best_season:   fm.bestSeason ?? null,
        cover_image,
        summary:       fm.summary ?? body.trim() ?? null,
        map_embed_url: fm.mapEmbedUrl ?? null,
        status:        'published',
      }, { onConflict: 'slug' })
      .select('id')
      .single()

    if (error) {
      err(`Failed to insert itinerary "${fm.title}": ${error.message}`)
      continue
    }

    success(`Itinerary migrated: "${fm.title}"`)

    // Upsert day-by-day breakdown
    if (Array.isArray(fm.days) && fm.days.length > 0) {
      for (const day of fm.days) {
        const { error: dayError } = await supabase
          .from('itinerary_days')
          .upsert({
            itinerary_id: itinerary.id,
            day_number:   day.day,
            title:        day.title ?? `Day ${day.day}`,
            stops: {
              morning:   day.morning   ?? null,
              afternoon: day.afternoon ?? null,
              evening:   day.evening   ?? null,
              eat:       day.eat       ?? null,
              stay:      day.stay      ?? null,
            },
          }, { onConflict: 'itinerary_id,day_number' })

        if (dayError) {
          warn(`  Day ${day.day} error: ${dayError.message}`)
        } else {
          info(`  → Day ${day.day}: ${day.title}`)
        }
      }
    }
  }
}

// ─── Migrate Recipes ──────────────────────────────────────────────────────────

async function migrateRecipes() {
  console.log('\n🍲 Migrating Recipes...\n')

  const dir = join(ROOT, 'content/recipes')
  const files = readdirSync(dir).filter(f => f.endsWith('.mdx'))

  for (const file of files) {
    const source = readFileSync(join(dir, file), 'utf8')
    const { data: fm, content: body } = matter(source)

    info(`Processing: ${fm.title}`)

    const cover_image = fm.coverImage
      ? await uploadImage(fm.coverImage)
      : null

    const { error } = await supabase.from('recipes').upsert({
      title:        fm.title,
      slug:         fm.slug,
      category:     fm.category,
      description:  fm.description ?? body.trim() ?? null,
      cover_image,
      prep_time:    fm.prepTime   ?? null,
      cook_time:    fm.cookTime   ?? null,
      servings:     fm.servings   ?? null,
      difficulty:   fm.difficulty ?? null,
      ingredients:  fm.ingredients  ?? [],
      instructions: fm.instructions ?? [],
      tips:         fm.tips ?? null,
      status:       'published',
    }, { onConflict: 'slug' })

    if (error) {
      err(`Failed to insert recipe "${fm.title}": ${error.message}`)
    } else {
      success(`Recipe migrated: "${fm.title}"`)
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════')
  console.log('   Ghana Travel Blog — Content Migrator')
  console.log('═══════════════════════════════════════')

  await migrateArticles()
  await migrateItineraries()
  await migrateRecipes()

  console.log('\n═══════════════════════════════════════')
  console.log('✅ Migration complete!')
  console.log('   Check your Supabase dashboard to verify the data.')
  console.log('   Then restart your dev server: npm run dev')
  console.log('═══════════════════════════════════════\n')
}

main().catch(e => {
  err(`Unexpected error: ${e.message}`)
  process.exit(1)
})
