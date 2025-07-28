export interface MetricData {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface ChartData {
  name: string;
  value?: number;
  revenue?: number;
  users?: number;
  sessions?: number;
  date?: string;
  color?: string;
}

export interface TableData {
  id: string;
  campaign: string;
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  revenue: number;
  roas: number;
  status: 'active' | 'paused' | 'completed';
  lastModified: string;
}

// Metrics for dashboard cards
export const metricsData: MetricData[] = [
  {
    label: "Total Revenue",
    value: "$124,563",
    change: 12.5,
    trend: "up",
    icon: "DollarSign"
  },
  {
    label: "Active Users",
    value: "8,429",
    change: -2.3,
    trend: "down",
    icon: "Users"
  },
  {
    label: "Conversion Rate",
    value: "3.24%",
    change: 5.1,
    trend: "up",
    icon: "TrendingUp"
  },
  {
    label: "Avg. Session Duration",
    value: "4m 32s",
    change: 0.8,
    trend: "neutral",
    icon: "Clock"
  }
];

// Chart data for revenue over time
export const revenueChartData: ChartData[] = [
  { name: "Jan", value: 45000, revenue: 45000, users: 1200, sessions: 8400 },
  { name: "Feb", value: 52000, revenue: 52000, users: 1350, sessions: 9200 },
  { name: "Mar", value: 48000, revenue: 48000, users: 1280, sessions: 8800 },
  { name: "Apr", value: 61000, revenue: 61000, users: 1420, sessions: 9800 },
  { name: "May", value: 55000, revenue: 55000, users: 1380, sessions: 9400 },
  { name: "Jun", value: 67000, revenue: 67000, users: 1520, sessions: 10600 },
  { name: "Jul", value: 72000, revenue: 72000, users: 1680, sessions: 11200 },
  { name: "Aug", value: 69000, revenue: 69000, users: 1640, sessions: 10900 },
  { name: "Sep", value: 78000, revenue: 78000, users: 1750, sessions: 12100 },
  { name: "Oct", value: 82000, revenue: 82000, users: 1820, sessions: 12800 },
  { name: "Nov", value: 76000, revenue: 76000, users: 1720, sessions: 11800 },
  { name: "Dec", value: 89000, revenue: 89000, users: 1950, sessions: 13500 }
];

// Pie chart data for traffic sources
export const trafficSourceData: ChartData[] = [
  { name: "Organic Search", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Paid Ads", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Social Media", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Direct", value: 8, color: "hsl(var(--chart-4))" },
  { name: "Referral", value: 4, color: "hsl(var(--chart-5))" }
];

// Table data for campaign performance
export const campaignTableData: TableData[] = [
  {
    id: "1",
    campaign: "Summer Sale 2024",
    impressions: 125000,
    clicks: 3250,
    ctr: 2.6,
    spend: 4500,
    revenue: 18750,
    roas: 4.17,
    status: "active",
    lastModified: "2024-01-15"
  },
  {
    id: "2",
    campaign: "Holiday Campaign",
    impressions: 89000,
    clicks: 2890,
    ctr: 3.2,
    spend: 3200,
    revenue: 14600,
    roas: 4.56,
    status: "active",
    lastModified: "2024-01-14"
  },
  {
    id: "3",
    campaign: "Back to School",
    impressions: 67000,
    clicks: 1340,
    ctr: 2.0,
    spend: 2800,
    revenue: 8950,
    roas: 3.20,
    status: "paused",
    lastModified: "2024-01-12"
  },
  {
    id: "4",
    campaign: "Brand Awareness Q4",
    impressions: 145000,
    clicks: 4350,
    ctr: 3.0,
    spend: 5200,
    revenue: 21800,
    roas: 4.19,
    status: "active",
    lastModified: "2024-01-15"
  },
  {
    id: "5",
    campaign: "Product Launch",
    impressions: 78000,
    clicks: 2106,
    ctr: 2.7,
    spend: 3600,
    revenue: 12400,
    roas: 3.44,
    status: "completed",
    lastModified: "2024-01-10"
  },
  {
    id: "6",
    campaign: "Retargeting Campaign",
    impressions: 54000,
    clicks: 2160,
    ctr: 4.0,
    spend: 2400,
    revenue: 9800,
    roas: 4.08,
    status: "active",
    lastModified: "2024-01-13"
  }
];

// Real-time data simulation
export const generateRealTimeData = (): MetricData[] => {
  return metricsData.map(metric => ({
    ...metric,
    value: metric.label === "Total Revenue" 
      ? `$${(parseInt(metric.value.replace(/[$,]/g, '')) + Math.floor(Math.random() * 1000)).toLocaleString()}`
      : metric.label === "Active Users"
      ? `${(parseInt(metric.value.replace(/,/g, '')) + Math.floor(Math.random() * 100)).toLocaleString()}`
      : metric.value,
    change: metric.change + (Math.random() - 0.5) * 2
  }));
};