export default function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      role="img"
      aria-label="Brutto Netto Rechner Icon"
    >
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff204e" />
          <stop offset="100%" stopColor="#ff8298" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#gradient)" />
      <path
        d="M20 24h24M20 32h24M20 40h16"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
