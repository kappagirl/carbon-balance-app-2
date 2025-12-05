import { Card } from "@/components/ui/card"
import { LeafIcon, TargetIcon, UsersIcon, DatabaseIcon } from "@/components/icons"
import Image from "next/image"
import { Linkedin, Github, Instagram } from "lucide-react"

export const metadata = {
  title: "Acerca de - EcoBalance360 | Colectivo HAGAMOS",
  description: "Conoce EcoBalance360 y al equipo del Colectivo HAGAMOS detrás de esta herramienta de analítica territorial para el balance de carbono en Santander, Colombia.",
}

const teamMembers = [
  {
    name: "Marilyn Barbosa",
    role: "Scrum Master",
    description: "Bióloga y Científica de Datos",
    image: "/images/DannaMarilynBarbosa.png",
    linkedin: "https://www.linkedin.com/in/danna-marilyn-barbosa-cardenas/",
    github: "https://github.com/kappagirl",
  },
  {
    name: "Mario Álvarez",
    role: "Developer",
    description: "Ing. de Automatización y Desarrollador",
    image: "/images/MarioDavidAlvarez.png",
    linkedin: "https://www.linkedin.com/in/mrdavidalv/",
    github: "https://github.com/MrDavidAlv",
  },
  {
    name: "Ana Maria Arosa",
    role: "Developer",
    description: "Mercadóloga y Analista de Datos",
    image: "/images/AnaMariaArosa.png",
    linkedin: "https://www.linkedin.com/in/ana-arosa/",
    github: "https://github.com/anamarosag",
  },
  {
    name: "Lucía O. Cardenas",
    role: "Product Owner",
    description: "Ingeniera de alimentos y Gestora de Innovación.",
    image: "/images/MarthaOrtizCardenas.png",
    linkedin: "https://www.linkedin.com/in/luciacardenas/",
    github: "https://github.com/carluute",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Acerca de EcoBalance360</h1>
            <p className="text-lg text-muted-foreground">Transformando datos en acción climática</p>
          </div>

          <Card className="p-8 md:p-12">
            <div className="prose prose-gray max-w-none space-y-6">
              <p className="text-lg">
                <strong>EcoBalance360</strong> es una plataforma de analítica territorial desarrollada para visualizar y
                analizar el balance de carbono de los 87 municipios del departamento de Santander, Colombia.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">Objetivos</h2>
              <div className="grid gap-4 md:grid-cols-2 not-prose">
                {[
                  {
                    icon: TargetIcon,
                    title: "Visualización Clara",
                    desc: "Presentar datos complejos de forma accesible",
                  },
                  { icon: UsersIcon, title: "Empoderamiento", desc: "Facilitar la toma de decisiones informadas" },
                  {
                    icon: DatabaseIcon,
                    title: "Datos Abiertos",
                    desc: "Transparencia y acceso público a la información",
                  },
                  { icon: LeafIcon, title: "Acción Climática", desc: "Impulsar políticas de mitigación efectivas" },
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex gap-3 p-4 rounded-lg bg-muted/30">
                      <Icon className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">Metodología</h2>
              <p>
                Los cálculos de emisiones y captura de carbono se realizaron siguiendo metodologías internacionales
                establecidas por el IPCC (Panel Intergubernamental sobre Cambio Climático). Los datos corresponden al
                año 2019 y consideran las siguientes categorías:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Emisiones por energía (consumo eléctrico residencial, comercial e industrial)</li>
                <li>Emisiones industriales (procesos IPPU)</li>
                <li>Emisiones agrícolas y ganaderas</li>
                <li>Emisiones por gestión de residuos</li>
                <li>Emisiones por deforestación</li>
                <li>Captura de carbono por bosques naturales</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">Equipo</h2>
              <p>
                Este proyecto es desarrollado por el <strong>Colectivo HAGAMOS</strong> como parte del programa
                <strong> Datos al Ecosistema 2025</strong> del Ministerio de Tecnologías de la Información y las
                Comunicaciones de Colombia (MinTIC).
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <Image
                src="/images/colectivohagamos.png"
                alt="Colectivo HAGAMOS"
                width={300}
                height={78}
                className="mb-2"
              />
              <p className="text-muted-foreground max-w-2xl">
                Equipo multidisciplinario que promueve la identidad, la educación y el respeto por la diversidad y el ambiente.
              </p>
              <div className="flex flex-wrap gap-3 pt-2 justify-center">
                <a
                  href="https://github.com/ColectivoHagamos/EcoBalance360-Mapa-Nacional-de-Captura-y-Emisiones-de-Carbono"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  aria-label="Repositorio de EcoBalance360"
                >
                  <Github className="w-5 h-5" />
                  <span className="text-sm font-medium">Ver Proyecto</span>
                </a>
                <a
                  href="https://github.com/ColectivoHagamos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="GitHub de Colectivo HAGAMOS"
                >
                  <Github className="w-5 h-5" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
                <a
                  href="https://www.instagram.com/hagamoses"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Instagram de Colectivo HAGAMOS"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
              </div>
            </div>
          </Card>

          <div>
            <h2 className="text-3xl font-bold text-center mb-8">Nuestro Equipo</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <Card key={index} className="p-6 flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                      sizes="128px"
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-sm text-primary font-medium">{member.role}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                    <div className="flex gap-3 justify-center pt-2">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`GitHub de ${member.name}`}
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
