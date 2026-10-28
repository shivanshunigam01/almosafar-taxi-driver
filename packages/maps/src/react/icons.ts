import L from "leaflet";

export const defaultPinIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function createColoredIcon(color: string, label?: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center">
      <div style="width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>
      ${label ? `<span style="font-size:10px;font-weight:600;background:#fff;padding:2px 6px;border-radius:8px;margin-top:4px;box-shadow:0 1px 3px rgba(0,0,0,.2)">${label}</span>` : ""}
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export const pickupIcon = createColoredIcon("#059669", "A");
export const dropoffIcon = createColoredIcon("#b45309", "B");
export const userLocationIcon = createColoredIcon("#2563eb");
export const driverIcon = createColoredIcon("#0f172a", "D");
