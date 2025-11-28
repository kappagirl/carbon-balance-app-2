"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const LeafIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
)

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
)

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
)

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-sm">
            <LeafIcon />
          </div>
          <span className="hidden sm:inline">EcoBalance360</span>
          <span className="sm:hidden">EB360</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Inicio
          </Link>
          <Link
            href="/explorador"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Explorador
          </Link>
          <Link
            href="/simulador"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Simulador
          </Link>
          <Link
            href="/juegos"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Juegos
          </Link>
          <Link
            href="/acerca"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Acerca de
          </Link>
          <a
            href="https://github.com/HagamosColectivo/EcoBalance360-Mapa-Nacional-de-Captura-y-Emisiones-de-Carbono"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            GitHub
            <ExternalLinkIcon className="w-3 h-3" />
          </a>
          <a
            href="https://www.datos.gov.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Datos Abiertos
            <ExternalLinkIcon className="w-3 h-3" />
          </a>
          <a
            href="https://www.datos.gov.co/stories/s/Publicaci-n-de-resultados-fase-1-Datos-al-Ecosiste/j4vz-7str"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Documentación
            <ExternalLinkIcon className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/HagamosColectivo/EcoBalance360-Mapa-Nacional-de-Captura-y-Emisiones-de-Carbono/blob/main/ecobalance360_santander_2019.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            API
            <ExternalLinkIcon className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden md:flex">
            <Link href="/explorador">Explorar Ahora</Link>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[340px] px-6">
              <div className="flex items-center gap-2.5 mb-8 mt-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <LeafIcon />
                </div>
                <span className="font-bold text-xl">EcoBalance360</span>
              </div>

              <nav className="flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors py-3 px-4 rounded-lg"
                >
                  Inicio
                </Link>
                <Link
                  href="/explorador"
                  onClick={closeMenu}
                  className="text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors py-3 px-4 rounded-lg"
                >
                  Explorador
                </Link>
                <Link
                  href="/simulador"
                  onClick={closeMenu}
                  className="text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors py-3 px-4 rounded-lg"
                >
                  Simulador
                </Link>
                <Link
                  href="/juegos"
                  onClick={closeMenu}
                  className="text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors py-3 px-4 rounded-lg"
                >
                  Juegos
                </Link>
                <Link
                  href="/acerca"
                  onClick={closeMenu}
                  className="text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors py-3 px-4 rounded-lg"
                >
                  Acerca de
                </Link>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-4">
                    Recursos
                  </p>
                  <a
                    href="https://github.com/HagamosColectivo/EcoBalance360-Mapa-Nacional-de-Captura-y-Emisiones-de-Carbono"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors py-3 px-4 rounded-lg flex items-center justify-between"
                  >
                    GitHub
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.datos.gov.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors py-3 px-4 rounded-lg flex items-center justify-between"
                  >
                    Datos Abiertos
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.datos.gov.co/stories/s/Publicaci-n-de-resultados-fase-1-Datos-al-Ecosiste/j4vz-7str"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors py-3 px-4 rounded-lg flex items-center justify-between"
                  >
                    Documentación
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/HagamosColectivo/EcoBalance360-Mapa-Nacional-de-Captura-y-Emisiones-de-Carbono/blob/main/ecobalance360_santander_2019.ipynb"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors py-3 px-4 rounded-lg flex items-center justify-between"
                  >
                    API
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                </div>

                <div className="mt-6 px-4">
                  <Button asChild className="w-full">
                    <Link href="/explorador" onClick={closeMenu}>
                      Explorar Ahora
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
