import Link from "next/link"

const LeafIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
)

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <LeafIcon />
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
                <a
                  href="https://www.datos.gov.co/stories/s/Publicaci-n-de-resultados-fase-1-Datos-al-Ecosiste/j4vz-7str"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Documentación
                </a>
              </li>
              <li>
                <Link href="/acerca" className="hover:text-foreground transition-colors">
                  Metodología
                </Link>
              </li>
              <li>
                <a
                  href="https://www.datos.gov.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Datos Abiertos
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/HagamosColectivo/EcoBalance360-Mapa-Nacional-de-Captura-y-Emisiones-de-Carbono/blob/main/ecobalance360_santander_2019.ipynb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  API
                </a>
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
            <a
              href="https://github.com/HagamosColectivo/EcoBalance360-Mapa-Nacional-de-Captura-y-Emisiones-de-Carbono"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubIcon />
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 Colectivo HAGAMOS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
