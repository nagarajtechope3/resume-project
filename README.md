# ResumeForge 📄

A completely free, modern **Resume Builder** web app — no login required, no server backend, works entirely in your browser.

## ✨ Features

| Feature | Details |
|---|---|
| **Live Preview** | Resume updates in real-time as you type |
| **3 Templates** | Minimal, Classic, Modern — switch instantly |
| **Dark / Light Mode** | Toggle with one click, persists on refresh |
| **PDF Download** | High-quality PDF export via jsPDF + html2canvas |
| **LocalStorage** | All data auto-saved — picks up where you left off |
| **ATS-Friendly** | Clean, machine-readable templates |
| **No Login** | 100% client-side, zero server calls |

## 🗂 Project Structure

```
resume-builder/
├── index.html          # Main HTML
├── css/
│   └── style.css       # Full design system & templates
├── js/
│   ├── data.js         # Data model & localStorage helpers
│   ├── templates.js    # 3 resume HTML renderers
│   ├── pdf.js          # PDF generation (html2canvas + jsPDF)
│   └── app.js          # Application controller
└── README.md
```

## 🚀 How to Run

**Option 1 – Double-click** (simplest)
Open `index.html` directly in your browser.

**Option 2 – Local server** (recommended for best PDF quality)
```bash
# Python 3
python3 -m http.server 3000

# Node.js (npx)
npx -y serve .

# VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then visit `http://localhost:3000`.

## 🎨 Templates

- **Minimal** – Clean single-column layout, indigo accents, ATS-optimized
- **Classic** – Two-column sidebar layout with dark navy header, serif typography
- **Modern** – Gradient header, purple timeline bullets, vibrant skill tags

## 🛠 Tech Stack

- **HTML5** – Semantic structure
- **CSS3** – Custom properties, Grid, Flexbox, animations
- **Vanilla JS** – No framework dependencies
- **[jsPDF](https://github.com/parallax/jsPDF)** – PDF generation (free, CDN)
- **[html2canvas](https://html2canvas.hertzen.com/)** – DOM-to-canvas capture (free, CDN)
- **Google Fonts** – Inter, Playfair Display, DM Sans

## 📋 Sections

- Personal Details (name, email, phone, location, website)
- Profile Summary
- Skills (tag-style input)
- Work Experience (multiple entries, collapsible)
- Education (multiple entries, collapsible)
- Projects (multiple entries with link + tech stack)
