# Brutto-Netto Rechner (Modern AK Clone)

Diese App ist ein moderner, zwei-Schritte-Klon des Online-Brutto-Netto-Rechners der österreichischen Arbeiterkammer. Die Oberfläche wurde mit Next.js 15, dem App Router und Tailwind CSS umgesetzt und konzentriert sich auf ein schnelles, fokussiertes Nutzererlebnis mit nur zwei Screens: Eingabe und Ergebnis.

## Features

- Auswahl zwischen Arbeiter:innen/Angestellten, Lehrlingen und Pensionist:innen
- Monats- oder Jahresbrutto, inklusive Sachbezug für Firmen-PKW
- Familienbonus, Alleinverdiener:innen-Absetzbetrag, Freibeträge und Pendlerpauschale
- Ergebnis-Screen mit detaillierter Aufschlüsselung (Netto, Steuer, Sozialversicherung, Pendlerpauschale, Gutschriften)
- Elegantes, modernes UI mit weiß-rot abgestimmtem Verlauf – perfekt für den Vercel-Deploy

## Entwicklung

```bash
npm install
npm run dev
```

Die Anwendung ist für den Einsatz mit Node.js 18+ ausgelegt. Nach dem Start ist sie unter `http://localhost:3000` erreichbar.
