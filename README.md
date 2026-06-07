# Stremio Addon Cloner

> Clone your Stremio addons from your primary account to multiple accounts — fast, easy, and secure.

Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

- **Multi-Account Cloning** — Clone addons from one Stremio account to many targets simultaneously
- **Debrid Key Override** — Replace debrid API keys during cloning (Torrentio, Comet, Jackettio, TorrentsDB)
- **Sync & Append Modes** — Mirror your addon list exactly, or add on top of existing addons
- **Drag & Drop Reordering** — Reorder addons with a smooth drag-and-drop interface
- **Addon Management** — View, add, remove, enable/disable, and rename addons per account
- **Import/Export** — Export your account configuration as JSON
- **PWA Support** — Installable as a Progressive Web App
- **Responsive Grid Layout** — Accounts displayed side by side on desktop

---

## 🚀 Getting Started

```bash
git clone https://github.com/jaberio/stremio-addon-cloner.git
cd stremio-addon-cloner
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔒 Security

- API routes validate input and return proper HTTP status codes (400, 500)
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- Credentials sent only to Stremio's API — never to third parties
- AuthKey inputs masked by default with show/hide toggle

---

## 🎨 Design

Inspired by [NVIDIA Build](https://build.nvidia.com/):

- Ultra-dark background with ambient gradient mesh
- CSS custom properties for all colors — zero hardcoded values
- Glassmorphism and backdrop blur effects
- Micro-animations (fade-in, scale-in, slide transitions)
- Responsive grid layout for target accounts
- Geist font family

---

## 📋 Improvements Over Original

This is a fork of the [original project by Oozmakafa](https://github.com/oozmakafa/stremio-account-addon-cloner) with extensive improvements:

### Security
- API routes return proper HTTP status codes (was always 200 even on errors)
- Input validation on all API routes
- AuthKey field masked like passwords
- Security headers in Next.js config

### Architecture
- `CloneAccountForm` decomposed from 523 → ~140 lines (extracted `DebridOverrideSection`, `CloneModeToggle`, `CloneAccountAddonsModal`)
- ~70% code duplication eliminated via unified `SortableAddonList`
- Shared utilities: `formatAddonDataForUI`, `createDefaultAccount`, `base64DebridProvider`

### Bug Fixes
- Fixed `Alert` infinite re-render loop
- Fixed array index used as React key → stable UUID keys
- Fixed stale closure in `addAccount`
- Fixed localStorage key typo with migration
- Fixed double semicolon in stremio-client.ts
- Fixed `premiunize` typo
- Fixed export DOM cleanup and import file input reset
- Removed dead `ConfirmDeleteModal` component

### Type Safety
- `debrid_type`: `string` → union type
- `Account` type has stable UUID `id` field
- `AddonManifest` resources/catalogs properly typed (was `object[]`)

### UI/UX
- NVIDIA Build-inspired design system
- Responsive grid layout (accounts side by side)
- Micro-animations and smooth transitions
- Custom scrollbar, glassmorphism, focus-visible accessibility
- Loading spinners, Escape key closes modals

### Config
- `private: true` in package.json
- Stremio API URL extracted to environment variable

---

## 🙏 Credits

- **Original project**: [stremio-account-addon-cloner](https://github.com/oozmakafa/stremio-account-addon-cloner) by [Oozmakafa](https://github.com/oozmakafa)
- **Fork maintainer**: [Jay](https://github.com/jaberio)
- Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [@dnd-kit](https://dndkit.com/)

---

## ☕ Support

If you find this useful, consider [buying me a coffee](https://buymeacoffee.com/jay_me).
