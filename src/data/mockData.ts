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
    value: "$2,547,892",
    change: 18.2,
    trend: "up",
    icon: "DollarSign"
  },
  {
    label: "Active Users",
    value: "64,429",
    change: -3.1,
    trend: "down",
    icon: "Users"
  },
  {
    label: "Conversion Rate",
    value: "4.67%",
    change: 12.5,
    trend: "up",
    icon: "TrendingUp"
  },
  {
    label: "Avg. Session Duration",
    value: "6m 42s",
    change: 8.3,
    trend: "up",
    icon: "Clock"
  },
  {
    label: "Total Orders",
    value: "12,847",
    change: 15.7,
    trend: "up",
    icon: "ShoppingCart"
  },
  {
    label: "Bounce Rate",
    value: "32.1%",
    change: -4.2,
    trend: "up",
    icon: "ArrowLeft"
  },
  {
    label: "Email Subscribers",
    value: "89,254",
    change: 22.1,
    trend: "up",
    icon: "Mail"
  },
  {
    label: "Return Customer Rate",
    value: "67.8%",
    change: 9.4,
    trend: "up",
    icon: "RotateCcw"
  }
];

// Chart data for revenue over time
export const revenueChartData: ChartData[] = [
  { name: "Jan", value: 187000, revenue: 187000, users: 4200, sessions: 28400 },
  { name: "Feb", value: 234000, revenue: 234000, users: 4850, sessions: 32200 },
  { name: "Mar", value: 198000, revenue: 198000, users: 4280, sessions: 28800 },
  { name: "Apr", value: 287000, revenue: 287000, users: 5420, sessions: 38900 },
  { name: "May", value: 265000, revenue: 265000, users: 5180, sessions: 34400 },
  { name: "Jun", value: 324000, revenue: 324000, users: 6520, sessions: 42600 },
  { name: "Jul", value: 389000, revenue: 389000, users: 7680, sessions: 48200 },
  { name: "Aug", value: 356000, revenue: 356000, users: 7240, sessions: 45900 },
  { name: "Sep", value: 428000, revenue: 428000, users: 8750, sessions: 54100 },
  { name: "Oct", value: 467000, revenue: 467000, users: 9420, sessions: 58800 },
  { name: "Nov", value: 398000, revenue: 398000, users: 8720, sessions: 51800 },
  { name: "Dec", value: 523000, revenue: 523000, users: 10950, sessions: 67500 }
];

// Pie chart data for traffic sources
export const trafficSourceData: ChartData[] = [
  { name: "Organic Search", value: 42, color: "hsl(var(--chart-1))" },
  { name: "Paid Advertising", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Social Media", value: 18, color: "hsl(var(--chart-3))" },
  { name: "Direct Traffic", value: 8, color: "hsl(var(--chart-4))" },
  { name: "Email Marketing", value: 4, color: "hsl(var(--chart-5))" }
];

// Table data for campaign performance
export const campaignTableData: TableData[] = [
  {
    id: "1",
    campaign: "Black Friday 2024 Mega Sale",
    impressions: 2540000,
    clicks: 127000,
    ctr: 5.0,
    spend: 45000,
    revenue: 287500,
    roas: 6.39,
    status: "active",
    lastModified: "2024-01-15"
  },
  {
    id: "2",
    campaign: "Holiday Shopping Campaign",
    impressions: 1890000,
    clicks: 94500,
    ctr: 5.0,
    spend: 32000,
    revenue: 198400,
    roas: 6.20,
    status: "active",
    lastModified: "2024-01-14"
  },
  {
    id: "3",
    campaign: "Spring Collection Launch",
    impressions: 1267000,
    clicks: 50680,
    ctr: 4.0,
    spend: 28000,
    revenue: 145600,
    roas: 5.20,
    status: "active",
    lastModified: "2024-01-12"
  },
  {
    id: "4",
    campaign: "Brand Awareness Q4",
    impressions: 3450000,
    clicks: 172500,
    ctr: 5.0,
    spend: 52000,
    revenue: 312000,
    roas: 6.00,
    status: "active",
    lastModified: "2024-01-15"
  },
  {
    id: "5",
    campaign: "Product Launch - Smart Home",
    impressions: 1780000,
    clicks: 89000,
    ctr: 5.0,
    spend: 36000,
    revenue: 216000,
    roas: 6.00,
    status: "active",
    lastModified: "2024-01-10"
  },
  {
    id: "6",
    campaign: "Retargeting High Intent Users",
    impressions: 540000,
    clicks: 43200,
    ctr: 8.0,
    spend: 24000,
    revenue: 168000,
    roas: 7.00,
    status: "active",
    lastModified: "2024-01-13"
  },
  {
    id: "7",
    campaign: "Summer Fashion Collection",
    impressions: 2100000,
    clicks: 105000,
    ctr: 5.0,
    spend: 42000,
    revenue: 252000,
    roas: 6.00,
    status: "paused",
    lastModified: "2024-01-11"
  },
  {
    id: "8",
    campaign: "Mobile App Download Campaign",
    impressions: 1560000,
    clicks: 78000,
    ctr: 5.0,
    spend: 28000,
    revenue: 154000,
    roas: 5.50,
    status: "active",
    lastModified: "2024-01-09"
  },
  {
    id: "9",
    campaign: "Valentine's Day Special",
    impressions: 890000,
    clicks: 44500,
    ctr: 5.0,
    spend: 18000,
    revenue: 126000,
    roas: 7.00,
    status: "completed",
    lastModified: "2024-01-08"
  },
  {
    id: "10",
    campaign: "Customer Loyalty Program",
    impressions: 670000,
    clicks: 40200,
    ctr: 6.0,
    spend: 15000,
    revenue: 108000,
    roas: 7.20,
    status: "active",
    lastModified: "2024-01-07"
  },
  {
    id: "11",
    campaign: "Video Ad Series - Tech Products",
    impressions: 2890000,
    clicks: 144500,
    ctr: 5.0,
    spend: 58000,
    revenue: 348000,
    roas: 6.00,
    status: "active",
    lastModified: "2024-01-14"
  },
  {
    id: "12",
    campaign: "Influencer Collaboration Campaign",
    impressions: 1240000,
    clicks: 74400,
    ctr: 6.0,
    spend: 25000,
    revenue: 175000,
    roas: 7.00,
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