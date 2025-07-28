// Additional data for more comprehensive analytics
import type { ChartData } from "./mockData";

// Device breakdown data
export const deviceData: ChartData[] = [
  { name: "Desktop", value: 52, color: "hsl(var(--chart-1))" },
  { name: "Mobile", value: 38, color: "hsl(var(--chart-2))" },
  { name: "Tablet", value: 10, color: "hsl(var(--chart-3))" }
];

// Geographic data
export const geographicData: ChartData[] = [
  { name: "United States", value: 42, revenue: 1067000 },
  { name: "United Kingdom", value: 18, revenue: 458000 },
  { name: "Canada", value: 12, revenue: 305000 },
  { name: "Germany", value: 10, revenue: 254000 },
  { name: "Australia", value: 8, revenue: 203000 },
  { name: "France", value: 6, revenue: 152000 },
  { name: "Others", value: 4, revenue: 102000 }
];

// Hour by hour data for today
export const hourlyData: ChartData[] = [
  { name: "00:00", value: 145, users: 89, sessions: 156 },
  { name: "01:00", value: 132, users: 78, sessions: 143 },
  { name: "02:00", value: 98, users: 56, sessions: 107 },
  { name: "03:00", value: 87, users: 45, sessions: 94 },
  { name: "04:00", value: 76, users: 34, sessions: 82 },
  { name: "05:00", value: 89, users: 43, sessions: 96 },
  { name: "06:00", value: 156, users: 87, sessions: 167 },
  { name: "07:00", value: 234, users: 134, sessions: 251 },
  { name: "08:00", value: 345, users: 198, sessions: 372 },
  { name: "09:00", value: 467, users: 267, sessions: 501 },
  { name: "10:00", value: 523, users: 298, sessions: 561 },
  { name: "11:00", value: 589, users: 334, sessions: 632 },
  { name: "12:00", value: 634, users: 367, sessions: 681 },
  { name: "13:00", value: 678, users: 389, sessions: 728 },
  { name: "14:00", value: 712, users: 401, sessions: 764 },
  { name: "15:00", value: 698, users: 394, sessions: 749 },
  { name: "16:00", value: 645, users: 365, sessions: 692 },
  { name: "17:00", value: 567, users: 321, sessions: 608 },
  { name: "18:00", value: 489, users: 278, sessions: 524 },
  { name: "19:00", value: 423, users: 241, sessions: 454 },
  { name: "20:00", value: 356, users: 203, sessions: 382 },
  { name: "21:00", value: 298, users: 169, sessions: 320 },
  { name: "22:00", value: 234, users: 133, sessions: 251 },
  { name: "23:00", value: 187, users: 106, sessions: 201 }
];

// Age demographics
export const ageData: ChartData[] = [
  { name: "18-24", value: 18, color: "hsl(var(--chart-1))" },
  { name: "25-34", value: 32, color: "hsl(var(--chart-2))" },
  { name: "35-44", value: 28, color: "hsl(var(--chart-3))" },
  { name: "45-54", value: 15, color: "hsl(var(--chart-4))" },
  { name: "55+", value: 7, color: "hsl(var(--chart-5))" }
];

// Conversion funnel data
export const funnelData: ChartData[] = [
  { name: "Visitors", value: 100000, users: 100000 },
  { name: "Product Views", value: 45000, users: 45000 },
  { name: "Add to Cart", value: 18000, users: 18000 },
  { name: "Checkout", value: 12000, users: 12000 },
  { name: "Purchase", value: 8500, users: 8500 }
];