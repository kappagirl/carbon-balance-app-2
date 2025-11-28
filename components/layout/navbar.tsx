"use client"

import Link from "next/link"
import { useState } from "react"
import { Leaf, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="hidden sm:inline">EcoBalance360</span>
          <span className="sm:hidden">EB360</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
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
          <Button asChild className="hidden md:flex">
            <Link href="/explorador">Explorar Ahora</Link>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[340px] px-6">
              <div className="flex items-center gap-2.5 mb-8 mt-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Leaf className="w-6 h-6" />
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
