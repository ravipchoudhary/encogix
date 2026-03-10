"use client";

import { useEffect, useRef } from "react";

const OFFICES = [
  {
    name: "Noida Office",
    address: "Gaur City Center, Greater Noida, Uttar Pradesh, 201318",
    lat: 28.4743,
    lng: 77.4948,
    link: "https://maps.google.com/?q=Gaur+City+Center+Greater+Noida+Uttar+Pradesh",
  },
  {
    name: "Bihar Office",
    address: "Near BM College, Rahika, Madhubani, Bihar, 847211",
    lat: 26.3534,
    lng: 86.078,
    link: "https://maps.google.com/?q=BM+College+Rahika+Madhubani+Bihar",
  },
];

export default function OfficeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    import("leaflet").then((L) => {
      if (mapInstance.current) return;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      const map = L.map(mapRef.current!).setView([27.4, 81.8], 5);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const bounds: [number, number][] = [];
      OFFICES.forEach((office) => {
        const marker = L.marker([office.lat, office.lng])
          .addTo(map)
          .bindPopup(
            `<div style="min-width:180px">
              <strong>${office.name}</strong><br/>
              <span style="font-size:12px;color:#64748b">${office.address}</span><br/>
              <a href="${office.link}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:#2563eb;margin-top:4px;display:inline-block">Directions →</a>
            </div>`
          );
        markersRef.current.push(marker);
        bounds.push([office.lat, office.lng]);
      });

      map.fitBounds(bounds as [number, number][], { padding: [40, 40] });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div ref={mapRef} className="h-72 sm:h-80 w-full bg-slate-50" />
      <div className="p-4 bg-white border-t border-slate-100">
        <p className="text-sm font-semibold text-primary mb-2 flex items-center gap-1.5">
          <span className="text-red-500">📍</span> Our Offices
        </p>
        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          <span>Noida</span>
          <span>•</span>
          <span>Bihar (Madhubani)</span>
        </div>
      </div>
    </div>
  );
}
