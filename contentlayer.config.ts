import { defineDocumentType, makeSource } from 'contentlayer2/source-files'

const computedFields = {
  slug: {
    type: 'string' as const,
    resolve: (doc: any) => doc.slug || doc._raw.sourceFileName.replace(/\.mdx$/, ''),
  },
}

export const Article = defineDocumentType(() => ({
  name: 'Article',
  filePathPattern: `articles/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    category: { type: 'string', required: true },
    excerpt: { type: 'string', required: false },
    coverImage: { type: 'string', required: false },
    author: { type: 'string', required: false },
    publishedAt: { type: 'string', required: false }, // Using string for flexibility with existing data
    readTime: { type: 'number', required: false },
  },
  computedFields,
}))

export const Itinerary = defineDocumentType(() => ({
  name: 'Itinerary',
  filePathPattern: `itineraries/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    duration: { type: 'number', required: false },
    regions: { type: 'list', of: { type: 'string' }, required: false },
    vibeTags: { type: 'list', of: { type: 'string' }, required: false },
    bestSeason: { type: 'string', required: false },
    coverImage: { type: 'string', required: false },
    summary: { type: 'string', required: false },
    mapEmbedUrl: { type: 'string', required: false },
    days: { type: 'json', required: false },
  },
  computedFields,
}))

export const Recipe = defineDocumentType(() => ({
  name: 'Recipe',
  filePathPattern: `recipes/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    category: { type: 'string', required: true },
    description: { type: 'string', required: false },
    coverImage: { type: 'string', required: false },
    prepTime: { type: 'number', required: false },
    cookTime: { type: 'number', required: false },
    servings: { type: 'number', required: false },
    difficulty: { type: 'string', required: false },
    ingredients: { type: 'list', of: { type: 'string' }, required: false },
    instructions: { type: 'list', of: { type: 'string' }, required: false },
    tips: { type: 'string', required: false },
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Article, Itinerary, Recipe],
})