'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  Ticket,
  ListTodo,
  BookOpen,
  HardDrive,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { href: '/painel', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/painel/colaboradores', icon: Users, label: 'Colaboradores' },
  { href: '/painel/chamados', icon: Ticket, label: 'Chamados' },
  { href: '/painel/tarefas', icon: ListTodo, label: 'Tarefas' },
  { href: '/painel/knowledge-base', icon: BookOpen, label: 'Knowledge Base' },
  { href: '/painel/ativos', icon: HardDrive, label: 'Ativos' },
  { href: '/painel/configuracoes', icon: Settings, label: 'Configuracoes' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-200 lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-ori-pink/20 flex items-center justify-center">
                <span className="text-ori-pink font-bold">O</span>
              </div>
              <span className="font-semibold text-lg">O.R.I</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/painel' && pathname.startsWith(item.href))
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={clsx(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-ori-pink/20 text-ori-pink'
                          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="border-t border-border p-4">
            <button
              onClick={() => {
                document.cookie = 'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
                router.push('/')
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                className="h-9 w-64 rounded-lg bg-white/5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ori-pink/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-ori-pink text-[10px] font-medium text-white flex items-center justify-center">
                3
              </span>
            </button>
            <div className="h-8 w-8 rounded-full bg-ori-blue/20 flex items-center justify-center">
              <span className="text-sm font-medium text-ori-blue">TI</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}