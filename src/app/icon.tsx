const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Brutto Netto Rechner Icon">
  <defs>
    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff204e" />
      <stop offset="100%" stop-color="#ff8298" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#gradient)" />
  <path
    d="M20 24h24M20 32h24M20 40h16"
    stroke="#fff"
    stroke-width="4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>`;

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/svg+xml";

export default function Icon() {
  return new Response(svgIcon, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
