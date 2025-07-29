
# ADmyBRAND Insights – Modern Analytics Dashboard

[![Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&logoColor=fff)](https://vitejs.dev/) [![TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-38BDF8?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/) [![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-111827)](https://ui.shadcn.com/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, real-time analytics dashboard for digital marketing agencies. Built with React, Vite, Tailwind CSS, shadcn/ui, and Recharts. Showcases best practices in UI/UX, component architecture, and interactive data visualization.

---

## ✨ Features

- **Key Metrics Overview**: Beautiful metric cards for revenue, users, conversions, growth, and more
- **Interactive Charts**: Line, bar, area, and pie/donut charts with real-time updates and smooth animations
- **Advanced Data Table**: Sorting, filtering (including date range), pagination, CSV/PDF export, and loading skeletons
- **Responsive Design**: Looks perfect on desktop, tablet, and mobile
- **Modern UI/UX**: Glassmorphism, theme-aware selection, beautiful visual hierarchy, and micro-interactions
- **Dark/Light Mode**: Toggle between dark and light themes
- **Animated Background**: Custom, theme-adaptive animated Waves background
- **Component Architecture**: Reusable, type-safe components for cards, charts, tables, and more
- **Mock Data**: Realistic, dynamic sample data for all visualizations

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/Kavin-Bakyaraj/admybrand-insights-starter.git
cd admybrand-insights-starter

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the dashboard.

---

## �️ Folder Structure

```
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and media
│   ├── components/
│   │   ├── dashboard/     # Dashboard-specific components (ThemeToggle, etc.)
│   │   └── ui/            # UI primitives (Card, Button, Waves, etc.)
│   ├── data/              # Mock and dynamic data generators
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Main pages (Dashboard, NotFound, etc.)
│   └── App.tsx            # App entry point
├── tailwind.config.ts     # Tailwind CSS config
├── vite.config.ts         # Vite config
└── ...
```

---

## 🧩 Main Components

- `Dashboard.tsx`: Main dashboard page, layout, and logic
- `MetricCard`, `ChartCard`: Metric and chart display components
- `DataTable`: Advanced table with sorting, filtering, pagination, and export
- `Waves`: Animated, theme-aware canvas background
- `ThemeToggle`: Dark/light mode switch

---

## 🖌️ UI/UX Highlights

- **Glassmorphism**: All cards, containers, and section titles use glassy, blurred backgrounds
- **Theme-Aware Selection**: Custom ::selection styles for both light and dark mode
- **Micro-Animations**: Framer Motion for smooth transitions and hover effects
- **Loading Skeletons**: Beautiful skeletons for table loading states
- **Accessibility**: Keyboard and screen reader friendly

---

## �️ Tech Stack

- **Frontend**: React, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Animation**: framer-motion
- **Export**: jsPDF, html2canvas
- **Icons**: lucide-react

---

## � Contributing

Contributions, issues, and feature requests are welcome! Feel free to fork the repo and submit a pull request.

---

## 📄 License

MIT

---

## 👤 Author

Kavin Bakyaraj 

---

## 💡 Inspiration

This project is a showcase of rapid AI-powered development and beautiful, modern UI design for analytics platforms.
