import { createAdminClient } from '@/lib/supabase/server'
import AdminHeader from '@/components/admin/AdminHeader'
import Link from 'next/link'
import type { Article, Itinerary, Recipe, Comment } from '@/lib/supabase/types'
import {
  FileText,
  Map,
  ChefHat,
  MessageSquare,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react'

async function getDashboardStats() {
  // Use the admin client (service role) so the dashboard sees ALL content
  // regardless of RLS — correct behaviour for a CMS admin view.
  const supabase = createAdminClient()

  const [articles, itineraries, recipes, comments] = await Promise.all([
    supabase
      .from('articles')
      .select('id, title, status, updated_at, slug')
      .order('updated_at', { ascending: false })
      .returns<Pick<Article, 'id' | 'title' | 'status' | 'updated_at' | 'slug'>[]>(),
    supabase
      .from('itineraries')
      .select('id, status')
      .returns<Pick<Itinerary, 'id' | 'status'>[]>(),
    supabase
      .from('recipes')
      .select('id, status')
      .returns<Pick<Recipe, 'id' | 'status'>[]>(),
    supabase
      .from('comments')
      .select('id, status, body, created_at, guest_name')
      .order('created_at', { ascending: false })
      .limit(5)
      .returns<Pick<Comment, 'id' | 'status' | 'body' | 'created_at' | 'guest_name'>[]>(),
  ])

  return {
    articles: {
      total: articles.data?.length ?? 0,
      published: articles.data?.filter((a) => a.status === 'published').length ?? 0,
      drafts: articles.data?.filter((a) => a.status === 'draft').length ?? 0,
      recent: articles.data?.slice(0, 5) ?? [],
    },
    itineraries: {
      total: itineraries.data?.length ?? 0,
      published: itineraries.data?.filter((i) => i.status === 'published').length ?? 0,
    },
    recipes: {
      total: recipes.data?.length ?? 0,
      published: recipes.data?.filter((r) => r.status === 'published').length ?? 0,
    },
    comments: {
      pending: comments.data?.filter((c) => c.status === 'pending').length ?? 0,
      recent: comments.data ?? [],
    },
  }
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  color,
}: {
  label: string
  value: number
  sub: string
  icon: React.ElementType
  href: string
  color: string
}) {
  return (
    <Link
      href={href}
      className="group bg-white border border-[#E8E2D9] p-6 hover:border-[#C9963A]/40 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
        <ArrowRight
          size={14}
          className="text-[#C4BDB4] group-hover:text-[#C9963A] group-hover:translate-x-0.5 transition-all duration-200"
        />
      </div>
      <p className="font-display text-4xl text-[#1C1C1C] leading-none mb-1">{value}</p>
      <p className="font-body text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A7162]">{label}</p>
      <p className="font-body text-xs text-[#7A7162]/60 mt-1">{sub}</p>
    </Link>
  )
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const quickActions = [
    { label: 'New Article', href: '/admin/articles/new', icon: FileText },
    { label: 'New Itinerary', href: '/admin/itineraries/new', icon: Map },
    { label: 'New Recipe', href: '/admin/recipes/new', icon: ChefHat },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Dashboard"
        subtitle={`Welcome back — ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
      />

      <main className="flex-1 p-8 space-y-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Articles"
            value={stats.articles.total}
            sub={`${stats.articles.published} published · ${stats.articles.drafts} drafts`}
            icon={FileText}
            href="/admin/articles"
            color="bg-[#C9963A]/10 text-[#C9963A]"
          />
          <StatCard
            label="Itineraries"
            value={stats.itineraries.total}
            sub={`${stats.itineraries.published} published`}
            icon={Map}
            href="/admin/itineraries"
            color="bg-[#2D5016]/10 text-[#2D5016]"
          />
          <StatCard
            label="Recipes"
            value={stats.recipes.total}
            sub={`${stats.recipes.published} published`}
            icon={ChefHat}
            href="/admin/recipes"
            color="bg-[#B85C38]/10 text-[#B85C38]"
          />
          <StatCard
            label="Pending Comments"
            value={stats.comments.pending}
            sub="Awaiting moderation"
            icon={MessageSquare}
            href="/admin/comments"
            color={
              stats.comments.pending > 0
                ? 'bg-amber-50 text-amber-600'
                : 'bg-[#E8E2D9]/60 text-[#7A7162]'
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent articles */}
          <div className="lg:col-span-2 bg-white border border-[#E8E2D9]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D9]">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#7A7162]" />
                <h2 className="font-body text-sm font-semibold text-[#1C1C1C]">Recent Articles</h2>
              </div>
              <Link
                href="/admin/articles"
                className="font-body text-[10px] uppercase tracking-widest text-[#C9963A] hover:text-[#B85C38] transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-[#E8E2D9]">
              {stats.articles.recent.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="font-body text-sm text-[#7A7162]">No articles yet.</p>
                  <Link
                    href="/admin/articles/new"
                    className="inline-block mt-3 font-body text-xs text-[#C9963A] hover:underline"
                  >
                    Write your first article →
                  </Link>
                </div>
              ) : (
                stats.articles.recent.map((article) => (
                  <Link
                    key={article.id}
                    href={`/admin/articles/${article.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#FAF7F2] transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="font-body text-sm text-[#1C1C1C] truncate group-hover:text-[#C9963A] transition-colors">
                        {article.title}
                      </p>
                      <p className="font-body text-[10px] text-[#7A7162] mt-0.5">
                        {new Date(article.updated_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`ml-4 shrink-0 font-body text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${
                        article.status === 'published'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-[#E8E2D9] text-[#7A7162]'
                      }`}
                    >
                      {article.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Quick actions + recent comments */}
          <div className="space-y-4">
            {/* Quick actions */}
            <div className="bg-white border border-[#E8E2D9]">
              <div className="px-6 py-4 border-b border-[#E8E2D9]">
                <div className="flex items-center gap-2">
                  <Plus size={14} className="text-[#7A7162]" />
                  <h2 className="font-body text-sm font-semibold text-[#1C1C1C]">Quick Actions</h2>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    id={`quick-action-${action.label.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center gap-3 px-4 py-3 bg-[#FAF7F2] hover:bg-[#C9963A]/5 hover:border-[#C9963A]/20 border border-transparent transition-all duration-200 group"
                  >
                    <action.icon size={14} className="text-[#7A7162] group-hover:text-[#C9963A] transition-colors" />
                    <span className="font-body text-sm text-[#1C1C1C] group-hover:text-[#C9963A] transition-colors">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent comments awaiting moderation */}
            {stats.comments.pending > 0 && (
              <div className="bg-amber-50 border border-amber-100 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-amber-600" />
                  <h3 className="font-body text-sm font-semibold text-amber-800">
                    {stats.comments.pending} comment{stats.comments.pending > 1 ? 's' : ''} pending
                  </h3>
                </div>
                <p className="font-body text-xs text-amber-700/70">
                  Review and approve reader comments.
                </p>
                <Link
                  href="/admin/comments"
                  className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-amber-700 hover:text-amber-900 transition-colors"
                >
                  <span>Review now</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
