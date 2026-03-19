# KIDAMAME WEBSITE

## File structure

Each inner page is output as `index.html` inside its own folder (e.g. `discovery/index.html` instead of `discovery.html`).
This gives us clean URLs (e.g. `/discovery/` instead of `/discovery.html`) without exposing the `.html` extension.

## Build

The static website is built using EJS templates and can be compiled using the `build.js` script.

```bash
npm run build
```

## Deploy and run the local web server

```bash
npx -y serve -l 3456 .

   ┌──────────────────────────────────────────┐
   │                                          │
   │   Serving!                               │
   │                                          │
   │   - Local:    http://localhost:3456      │
   │   - Network:  http://[IP_ADDRESS]        │
   │                                          │
   │   Copied local address to clipboard!     │
   │                                          │
   └──────────────────────────────────────────┘

```

