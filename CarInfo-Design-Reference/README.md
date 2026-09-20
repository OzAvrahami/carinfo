# CarInfo visual reference — design only

Open `index.html` in a browser after extracting this ZIP. It uses relative paths and bundled assets; no installation is needed.

## Source of truth

`index.html` and `styles.css` contain the refined blue-and-white design approved in the conversation. Preserve its actual layout, spacing, sizing, colors, and asset treatment when converting to React. `original-reference.png` is the user's earlier inspiration image, included as secondary context; it does not override the refined HTML/CSS.

This reference export intentionally contains NO JavaScript. Search, clear, share, print, and tab buttons are visual only. Native FAQ expansion and anchor navigation still work. The sample report is visible immediately. Hidden specification/history panels contain static content available for the React presentation tabs. Vehicle details and the plate are fictitious demonstration content, not a factual plate lookup result.

## Implementation scope

Create only a small React + Vite application with JavaScript/JSX and CSS. Reuse the supplied CSS, font files, photographs, and inline SVG symbols. Keep all assets local. Allow only simple UI presentation interactions such as tabs and FAQ expansion. Do not add APIs, a backend, search/validation logic, fake loading, data integrations, storage, accounts, or deployment.

Keep the reference ZIP/extracted folder outside the new application folder. Copy only the files actually needed by the frontend. Do not put this guide, the inspiration PNG, screenshots, reports, or the full reference export into the application root.

## Asset provenance

- RAV4 photograph: Toyota Hawaii, https://www.toyotahawaii.com/2024RAV4Hybrid.html . Source terms recorded for the original private prototype: personal, noncommercial reference use. This bundle grants no additional rights. Before any public/commercial launch, replace the photograph or obtain appropriate permission. Terms: https://www.servco.com/terms-of-use/ . No public launch is part of this task.
- Road photograph: Johannes Plenio, https://unsplash.com/photos/302DkUawX2U . License: https://unsplash.com/license .
- Heebo font: https://github.com/google/fonts/tree/main/ofl/heebo . The supplied `assets/Heebo-OFL.txt` must accompany the reused font files.
- Original inspiration screenshot: supplied by the user.
