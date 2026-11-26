<div align="center">

<img src="docs/logo.svg" alt="Marsad logo" width="96" height="96" />

# مَرْصَد · Marsad

**The Saudi labor market, quarter by quarter, in numbers anyone can read.**

لوحة تفاعلية لمؤشرات سوق العمل السعودي، مبنية على البيانات الرسمية للهيئة العامة للإحصاء

<br />

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design-0170FE?logo=antdesign&logoColor=white)
![i18next](https://img.shields.io/badge/i18next-26A69A?logo=i18next&logoColor=white)
![Arabic first](https://img.shields.io/badge/Arabic%20first-RTL-0E5E4B)
![Data](https://img.shields.io/badge/data-GASTAT%202021–2026-7FD8B8)

</div>

<br />

<p align="center">
  <img src="docs/screenshots/overview-light.jpg" width="49%" alt="Overview page, light theme" />
  <img src="docs/screenshots/overview-dark.jpg" width="49%" alt="Overview page, dark theme" />
</p>

---

## ✨ What's inside

| | |
|---|---|
| 🌍 **Arabic first** | Fully right-to-left, with English one click away. Even the charts flip correctly. |
| 🌗 **Light, dark & system** | Every color comes from one token file, so both themes stay in sync. |
| 📊 **A chart for each question** | Trends, rankings, a donut for shares, a 100% bar for ordered levels, a dumbbell for the gender pay gap, heat tiles for the regions. |
| 🧵 **An identity woven from Al Sadu** | The Bedouin weaving listed by UNESCO, drawn stitch by stitch in SVG. |
| ♿ **Accessible** | WCAG-checked contrast, screen-reader labels, keyboard focus, reduced-motion support. |
| 📱 **Responsive** | Designed for phone, tablet and desktop, not just squeezed onto them. |

## 📄 The pages

<p align="center">
  <img src="docs/screenshots/regions.jpg" width="65%" alt="Regions page with heat tiles" />
  <img src="docs/screenshots/mobile.jpg" width="25%" alt="Marsad on a phone" />
</p>

**Overview** · **Unemployment** · **Employment** · **Regions** · **Wages** · **Women in the workforce** · **About**

Every filter lives in the URL, so any view can be shared as a link.

## 🧵 Why Al Sadu?

<img src="docs/screenshots/about.jpg" align="right" width="40%" alt="The Sadu section of the About page" />

Al Sadu is the Bedouin weaving of the Arabian Peninsula, made by women in precise geometric
patterns, and inscribed by UNESCO as intangible cultural heritage in 2020.

Data works the same way: small threads, each number saying little on its own, that together
weave a full picture of the labor market.

Every Sadu motif in Marsad (the page pattern, the woven band, the eyes on the charts, the
loader, even the logo) is generated from one small module, `saduShapes.ts`, that draws
shapes stitch by stitch, the way they're woven.

<br clear="right" />

## 🔄 From GASTAT to the screen

```mermaid
flowchart LR
    A["GASTAT<br/>quarterly Excel files"] -->|"Python script<br/>(openpyxl)"| B["JSON<br/>one file per quarter"]
    B -->|"TanStack Query<br/>(cached)"| C["Selectors<br/>(pure functions)"]
    C --> D["Charts & cards"]
```

The Excel layout changes from year to year, so the converter finds each table by its title
rather than its position, and checks the numbers as it goes.

## 🛠️ Technical decisions worth a look

- **Charts in Arabic.** SVG text-anchor flips under a right-to-left page, which pushes labels
  into the bars. The chart area is drawn left-to-right and mirrored by hand instead.
- **One source of truth for design.** `tokens.ts` feeds both Ant Design's theme and CSS
  variables, so a color or spacing change happens in one place.
- **Missing isn't zero.** Values GASTAT doesn't publish are shown as "not available" and
  leave gaps in lines, never fake drops to zero.
- **Feature-based structure.** Each page owns its folder; anything shared lives in `shared/`.

<details>
<summary><b>📁 Project structure</b></summary>

```
src/
  app/        layout, routing, navigation
  features/   one folder per page, plus labor-data (types, hooks, selectors)
  shared/     components, charts, Sadu motifs, i18n, theme tokens, helpers
public/data/  the survey data as JSON, one file per quarter
scripts/      the Python converter from GASTAT Excel to JSON
```

</details>

## 🚀 Run it locally

```bash
npm install
npm run dev
```

<details>
<summary><b>🔁 Updating the data</b></summary>

Download the quarterly Excel files from GASTAT into `raw-data/`, then:

```bash
python3 -m venv .venv
.venv/bin/pip install openpyxl
.venv/bin/python scripts/convert_labor_data.py raw-data/ public/data/
```

</details>

## 📚 Data source

General Authority for Statistics (GASTAT), Labour Force Survey, Labor Market Statistics bulletins.

---

<div align="center">

Made with care by **Rahaf** · An unofficial personal project, not affiliated with any government entity.

</div>