"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const LeafIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 167 170"
    width="24"
    height="24"
    preserveAspectRatio="xMidYMid meet"
  >
    <g transform="translate(0,170) scale(0.1,-0.1)" fill="currentColor" stroke="none">
      <path d="M873 1548 c-41 -31 -70 -66 -144 -178 -99 -150 -142 -251 -166 -390 l-8 -45 -60 -8 c-181 -23 -258 -47 -272 -83 -6 -17 24 -115 61 -197 14 -31 26 -59 26 -62 0 -16 113 -196 164 -262 41 -53 77 -85 131 -118 92 -58 148 -75 241 -75 93 0 166 26 222 80 47 45 60 80 43 116 -10 22 -9 24 12 19 34 -9 64 30 84 109 14 56 14 79 5 138 -10 68 -9 73 12 102 40 52 66 144 66 228 0 136 -70 303 -195 463 -62 80 -166 185 -182 185 -5 0 -23 -10 -40 -22z m99 -65 c176 -186 288 -402 288 -558 0 -95 -47 -235 -79 -235 -4 0 -23 22 -42 50 -19 27 -56 66 -84 87 -27 20 -52 39 -55 41 -2 1 -7 38 -11 80 -4 42 -13 115 -20 162 l-14 85 -3 -149 c-3 -148 -3 -148 -25 -142 -62 19 -181 35 -254 36 l-82 0 6 53 c6 58 36 145 78 227 55 108 210 320 234 320 5 0 33 -26 63 -57z m-173 -587 c165 -25 313 -120 362 -233 28 -63 30 -169 5 -240 -9 -29 -20 -53 -23 -53 -3 0 -38 31 -79 68 -83 77 -209 152 -334 201 -47 18 -95 37 -108 42 -52 21 -31 6 72 -52 193 -107 290 -182 362 -281 42 -57 40 -74 -19 -122 -98 -79 -229 -86 -365 -19 -125 62 -220 175 -322 381 -43 86 -100 230 -100 251 0 18 280 66 410 70 25 0 87 -5 139 -13z"/>
    </g>
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
        <div className="hidden lg:flex items-center gap-6">
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
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden lg:flex">
            <Link href="/explorador">Explorar Ahora</Link>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <MenuIcon />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[340px] px-6">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
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
                    Análisis
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
