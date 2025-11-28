"use client"

import { useEffect, useRef, useState } from "react"
import type { Municipality } from "./interactive-map"

// Leaflet imports
let L: any

interface LeafletMapProps {
  municipalities: Municipality[]
  selectedMunicipality: Municipality | null
  onMunicipalityClick: (municipalityName: string) => void
}

export default function LeafletMap({ municipalities, selectedMunicipality, onMunicipalityClick }: LeafletMapProps) {
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isLeafletReady, setIsLeafletReady] = useState(false)

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined") return

    console.log("[v0] Initializing Leaflet map...")

    // Dynamically import Leaflet
    import("leaflet").then((leaflet) => {
      L = leaflet.default

      // Fix for default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      // Create map centered on Santander
      if (!mapRef.current) {
        console.log("[v0] Creating map instance...")
        mapRef.current = L.map("leaflet-map", {
          zoomControl: true,
          attributionControl: true,
        }).setView([7.0, -73.3], 8)

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(mapRef.current)

        console.log("[v0] Map created successfully")
        setIsLeafletReady(true)
      }
    })

    return () => {
      if (mapRef.current) {
        console.log("[v0] Cleaning up map...")
        mapRef.current.remove()
        mapRef.current = null
      }
      setIsLeafletReady(false)
    }
  }, [])

  // Add markers for municipalities
  useEffect(() => {
    if (!mapRef.current || !isLeafletReady || !L || municipalities.length === 0) {
      console.log("[v0] Cannot add markers yet:", {
        hasMap: !!mapRef.current,
        hasLeaflet: !!L,
        isReady: isLeafletReady,
        municipalityCount: municipalities.length,
      })
      return
    }

    console.log("[v0] Adding markers for", municipalities.length, "municipalities")

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add markers for each municipality
    municipalities.forEach((municipality) => {
      // Determine color based on classification
      let color = "#fbbf24" // amber for equilibrio
      if (municipality.clasificacion === "Sumidero") {
        color = "#10b981" // emerald for sumidero
      } else if (municipality.clasificacion === "Emisor") {
        color = "#f43f5e" // rose for emisor
      }

      // Create circle marker
      const circleMarker = L.circleMarker([municipality.latitud, municipality.longitud], {
        radius: 8,
        fillColor: color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })

      // Add popup
      const balanceFormatted = municipality.balanceCarbono.toLocaleString("es-CO", {
        maximumFractionDigits: 0,
      })
      const emisionesFormatted = municipality.emisionesTotales.toLocaleString("es-CO", {
        maximumFractionDigits: 0,
      })
      const capturaFormatted = municipality.capturaBosques.toLocaleString("es-CO", {
        maximumFractionDigits: 0,
      })

      circleMarker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${municipality.municipio}</h3>
          <div style="font-size: 13px; line-height: 1.6;">
            <div><strong>Balance:</strong> ${balanceFormatted} ton CO₂eq</div>
            <div><strong>Clasificación:</strong> ${municipality.clasificacion}</div>
            <div><strong>Emisiones:</strong> ${emisionesFormatted} ton</div>
            <div><strong>Captura:</strong> ${capturaFormatted} ton</div>
            <div><strong>Perfil:</strong> ${municipality.perfil}</div>
            <div style="margin-top: 8px; color: #666;"><strong>Población:</strong> ${municipality.totalPoblacion.toLocaleString("es-CO")}</div>
          </div>
        </div>
      `)

      // Add click handler
      circleMarker.on("click", () => {
        onMunicipalityClick(municipality.municipio)
      })

      circleMarker.addTo(mapRef.current)
      markersRef.current.push(circleMarker)
    })

    console.log("[v0] Added", markersRef.current.length, "markers to map")
  }, [municipalities, onMunicipalityClick, isLeafletReady])

  // Highlight selected municipality
  useEffect(() => {
    if (!mapRef.current || !L || !selectedMunicipality) return

    console.log("[v0] Highlighting municipality:", selectedMunicipality.municipio)

    // Pan to selected municipality
    mapRef.current.flyTo([selectedMunicipality.latitud, selectedMunicipality.longitud], 11, {
      duration: 1,
    })

    // Find and highlight the marker
    const markerIndex = municipalities.findIndex((m) => m.codMunicipio === selectedMunicipality.codMunicipio)
    if (markerIndex !== -1 && markersRef.current[markerIndex]) {
      markersRef.current[markerIndex].openPopup()
    }
  }, [selectedMunicipality, municipalities])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div id="leaflet-map" className="w-full h-full" />
    </>
  )
}
