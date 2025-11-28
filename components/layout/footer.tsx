import Link from "next/link"
import { Github, Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <Leaf className="w-5 h-5" />
              </div>
              <span>EcoBalance360</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Herramienta de analítica territorial para visualizar el balance de carbono municipal
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Navegación</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/explorador" className="hover:text-foreground transition-colors">
                  Explorador
                </Link>
              </li>
              <li>
                <Link href="/juegos" className="hover:text-foreground transition-colors">
                  Juegos
                </Link>
              </li>
              <li>
                <Link href="/acerca" className="hover:text-foreground transition-colors">
                  Acerca de
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Recursos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Documentación
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Metodología
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Datos Abiertos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Proyecto</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Datos al Ecosistema 2025
              <br />
              MinTIC Colombia
            </p>
            <Link
              href="https://github.com"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 Colectivo HAGAMOS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
