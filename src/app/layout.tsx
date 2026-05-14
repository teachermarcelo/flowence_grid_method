// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Flowence Grid Method',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gradient-to-br from-gray-50 to-white min-h-screen antialiased font-sans">
        {/* Sidebar retrátil */}
        <aside className="fixed inset-y-0 left-0 z-50 w-64 -translate-x-full bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 data-[sidebar-open]:translate-x-0 lg:translate-x-0">
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Flowence</h2>
            </div>
            <nav className="flex flex-1 flex-col p-4 space-y-2">
              <Link
                href="/aluno"
                className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-indigo-600"
              >
                <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center text-lg">
                  🎓
                </span>
                <span>Aluno</span>
              </Link>
              <Link
                href="/aula"
                className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-indigo-600"
              >
                <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center text-lg">
                  📖
                </span>
                <span>Aula</span>
              </Link>
              <Link
                href="/atribuir"
                className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-indigo-600"
              >
                <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center text-lg">
                  📋
                </span>
                <span>Atribuir</span>
              </Link>
              <Link
                href="/materiais"
                className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-indigo-600"
              >
                <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center text-lg">
                  📁
                </span>
                <span>Materiais</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Overlay para mobile */}
        <div
          id="overlay"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden opacity-0 invisible transition-opacity duration-300 data-[sidebar-open]:block data-[sidebar-open]:opacity-100 data-[sidebar-open]:visible pointer-events-none data-[sidebar-open]:pointer-events-auto"
        />

        <div className="flex flex-col lg:ml-64">
          <Header />
          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

// src/components/Header.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'

type Tab = {
  href: string
  label: string
  icon: string
}

const tabs: Tab[] = [
  { href: '/aluno', label: 'Aluno', icon: '🎓' },
  { href: '/aula', label: 'Aula', icon: '📖' },
  { href: '/atribuir', label: 'Atribuir', icon: '📋' },
  { href: '/materiais', label: 'Materiais', icon: '📁' },
]

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.93 17.93 0 0112 21.75a17.93 17.93 0 01-3.499-.82z"
      />
    </svg>
  )
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  )
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [darkMode, setDarkMode] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getTitle = (path: string): string => {
    const titles: Record<string, string> = {
      '/aluno': 'Aluno',
      '/aula': 'Aula',
      '/atribuir': 'Atribuir',
      '/materiais': 'Materiais',
    }
    return titles[path] || 'Início'
  }

  const toggleSidebar = useCallback(() => {
    document.body.toggleAttribute('data-sidebar-open')
  }, [])

  const closeSidebar = useCallback(() => {
    document.body.removeAttribute('data-sidebar-open')
  }, [])

  const toggleDarkMode = useCallback(() => {
    const html = document.documentElement
    html.classList.toggle('dark')
    const isDark = html.classList.contains('dark')
    setDarkMode(isDark)
    localStorage.theme = isDark ? 'dark' : 'light'
  }, [])

  // Inicializar tema
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement
      const saved = localStorage.theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDark = saved === 'dark' || (!saved && prefersDark)
      if (isDark) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
      setDarkMode(isDark)
    }
  }, [])

  // Fechar sidebar em mudança de rota
  useEffect(() => {
    closeSidebar()
  }, [pathname, closeSidebar])

  // Overlay e Escape
  useEffect(() => {
    const handleOverlayClick = () => closeSidebar()
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar()
    }
    const overlay = document.getElementById('overlay')
    overlay?.addEventListener('click', handleOverlayClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      overlay?.removeEventListener('click', handleOverlayClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [closeSidebar])

  // Fechar dropdown fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-xl shadow-sm supports-[backdrop-filter:blur(*)]:bg-white/80 dark:bg-gray-900/95 dark:border-gray-700 dark:supports-[backdrop-filter:blur(*)]:bg-gray-900/80">
      <div className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {/* Esquerda: Menu + Título */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-lg transition-colors"
              aria-label="Abrir menu"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {getTitle(pathname)}
            </h1>
          </div>

          {/* Centro: Abas de navegação */}
          <div className="flex-1 justify-center hidden md:flex mx-8">
            <nav className="flex items-center space-x-1">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-2 rounded-t-lg px-3 py-2 font-medium text-sm transition-all ${
                      isActive
                        ? 'border-b-2 border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 dark:border-indigo-400'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Direita: Tema + Usuário */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Alternar tema"
            >
              {darkMode ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </button>
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Coordenador
                <UserIcon className="h-5 w-5" />
              </button>
              {userOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-100/10 border border-gray-200 dark:border-gray-700 z-50">
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded transition-colors"
                    onClick={() => setUserOpen(false)}
                  >
                    Perfil
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded transition-colors"
                    onClick={() => setUserOpen(false)}
                  >
                    Configurações
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded transition-colors"
                    onClick={() => setUserOpen(false)}
                  >
                    Sair
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
