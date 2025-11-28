"use client"

import Link from "next/link"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <Leaf className="w-6 h-6" />
          </div>
          <span>EcoBalance360</span>
        </Link>

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
        </div>

        <Button asChild>
          <Link href="/explorador">Explorar Ahora</Link>
        </Button>
      </div>
    </nav>
  )
}
