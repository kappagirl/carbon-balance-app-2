import Link from "next/link"
import Image from "next/image"
import { Instagram } from "lucide-react"

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
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground shadow-sm">
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
                  Análisis
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
            <div className="mb-4">
              <Image
                src="/images/colectivohagamos.png"
                alt="Colectivo HAGAMOS"
                width={180}
                height={47}
                className="mb-3"
              />
            </div>
            <div className="flex gap-3">
              <a
                href="https://github.com/ColectivoHagamos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub de Colectivo HAGAMOS"
              >
                <GithubIcon />
              </a>
              <a
                href="https://www.instagram.com/hagamoses"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram de Colectivo HAGAMOS"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © 2025{" "}
            <a
              href="https://www.instagram.com/hagamoses"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline decoration-dotted"
            >
              Colectivo HAGAMOS
            </a>
            . Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
