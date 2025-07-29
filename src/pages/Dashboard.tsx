import { useState, useEffect } from "react";
import { Waves } from "@/components/ui/waves";
import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RefreshCw, Activity, Download, Filter, TrendingUp, TrendingDown, Minus, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// PDF export dependencies
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

// --- Data Generator Functions (restored) ---
function generateTrafficSourceData() {
  return [
    { name: "Organic Search", value: Math.round(40000 + Math.random() * 10000) },
    { name: "Paid Search", value: Math.round(25000 + Math.random() * 8000) },
    { name: "Social", value: Math.round(18000 + Math.random() * 6000) },
    { name: "Referral", value: Math.round(12000 + Math.random() * 4000) },
    { name: "Direct", value: Math.round(10000 + Math.random() * 3000) },
  ];
}

function generateDeviceData() {
  return [
    { name: "Desktop", value: Math.round(35000 + Math.random() * 8000) },
    { name: "Mobile", value: Math.round(42000 + Math.random() * 9000) },
    { name: "Tablet", value: Math.round(9000 + Math.random() * 2000) },
  ];
}

function generateAgeData() {
  return [
    { name: "18-24", value: Math.round(8000 + Math.random() * 2000) },
    { name: "25-34", value: Math.round(18000 + Math.random() * 4000) },
    { name: "35-44", value: Math.round(16000 + Math.random() * 3000) },
    { name: "45-54", value: Math.round(12000 + Math.random() * 2000) },
    { name: "55+", value: Math.round(7000 + Math.random() * 1500) },
  ];
}

function generateGeographicData() {
  return [
    { name: "USA", revenue: Math.round(90000 + Math.random() * 20000) },
    { name: "India", revenue: Math.round(70000 + Math.random() * 15000) },
    { name: "UK", revenue: Math.round(40000 + Math.random() * 10000) },
    { name: "Germany", revenue: Math.round(30000 + Math.random() * 8000) },
    { name: "Canada", revenue: Math.round(25000 + Math.random() * 6000) },
    { name: "Australia", revenue: Math.round(20000 + Math.random() * 5000) },
  ];
}

function generateHourlyData() {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  return hours.map((hour, idx) => ({
    name: hour,
    value: Math.round(2000 + Math.sin(idx / 3) * 800 + Math.random() * 400),
  }));
}

function generateFunnelData() {
  // Simulate a funnel: Visitors > Product Views > Add to Cart > Purchases
  const base = 100000 + Math.random() * 20000;
  const productViews = base * (0.65 + Math.random() * 0.05);
  const addToCart = productViews * (0.35 + Math.random() * 0.05);
  const purchases = addToCart * (0.45 + Math.random() * 0.05);
  return [
    { name: "Visitors", users: Math.round(base) },
    { name: "Product Views", users: Math.round(productViews) },
    { name: "Add to Cart", users: Math.round(addToCart) },
    { name: "Purchases", users: Math.round(purchases) },
  ];
}

function generateVariedMetrics(metrics, randomize = false) {
  return metrics.map(metric => {
    let value = metric.value;
    let change = metric.change;
    let trend = metric.trend;
    if (randomize) {
      // Try to parse the value as a number, otherwise keep as string
      const num = parseFloat((value + '').replace(/[^\d.]/g, ''));
      if (!isNaN(num)) {
        // Add some random variation
        const varied = num * (0.98 + Math.random() * 0.04);
        if (typeof value === 'string' && value.includes('%')) {
          value = varied.toFixed(2) + '%';
        } else if (typeof value === 'string' && value.includes('$')) {
          value = '$' + varied.toLocaleString(undefined, { maximumFractionDigits: 2 });
        } else if (typeof value === 'string' && value.includes('m')) {
          value = (varied / 1000000).toFixed(1) + 'm';
        } else {
          value = varied.toLocaleString();
        }
        // Randomly change trend
        if (Math.random() > 0.7) {
          trend = trend === 'up' ? 'down' : 'up';
        }
        // Randomly change change value
        const sign = trend === 'up' ? '+' : '-';
        change = sign + (Math.random() * 10).toFixed(1) + '%';
      }
    }
    return { ...metric, value, change, trend };
  });
}

// Mock data
const metricsData = [
  { label: "Total Revenue", value: "$284,320", change: "+12.5%", trend: "up" },
  { label: "Active Users", value: "28,450", change: "+8.2%", trend: "up" },
  { label: "Conversion Rate", value: "3.24%", change: "-2.1%", trend: "down" },
  { label: "Avg Order Value", value: "$156.80", change: "+5.7%", trend: "up" },
  { label: "Total Sessions", value: "142,680", change: "+15.3%", trend: "up" },
  { label: "Bounce Rate", value: "32.1%", change: "-4.2%", trend: "up" },
  { label: "Page Views", value: "2.4m", change: "+18.7%", trend: "up" },
  { label: "Customer LTV", value: "$890.45", change: "+11.2%", trend: "up" }
];

// Custom tooltip component with proper typing
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-xl">
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
            {entry.name}: {entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Modern MetricCard Component
const MetricCard = ({ metric, index }: { metric: any; index: number }) => {
  const trendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus
  };

  const trendColor = {
    up: "text-success",
    down: "text-destructive", 
    neutral: "text-muted-foreground"
  };

  const TrendIcon = trendIcon[metric.trend as keyof typeof trendIcon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="h-full"
    >
      <Card className="h-full border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 bg-white/60 dark:bg-card/80 backdrop-blur-2xl relative overflow-hidden ring-1 ring-inset ring-black/10 dark:ring-white/10 glassmorphism-box">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent dark:from-primary/10 dark:via-card/10 dark:to-accent/10 pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {metric.label}
          </CardTitle>
          <motion.div 
            className={cn("p-2 rounded-full backdrop-blur-sm",
              metric.trend === 'up' ? 'bg-success/10 shadow-success/20' : 
              metric.trend === 'down' ? 'bg-destructive/10 shadow-destructive/20' : 
              'bg-muted/10'
            )}
            whileHover={{ scale: 1.1 }}
          >
            <TrendIcon className={cn("h-4 w-4", trendColor[metric.trend as keyof typeof trendColor])} />
          </motion.div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-2">
            <motion.div 
              className="text-3xl font-bold text-foreground"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {metric.value}
            </motion.div>
            <div className="flex items-center space-x-2 text-sm">
              <Badge variant={metric.change.startsWith('+') ? 'default' : 'destructive'} className="px-2 py-1">
                {metric.change}
              </Badge>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Modern ChartCard Component
const ChartCard = ({ title, data, type, dataKey, height = 300, index = 0 }: { 
  title: string; 
  data: any[]; 
  type: string; 
  dataKey: string; 
  height?: number;
  index?: number;
}) => {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="h-full"
      >
        <Card className="h-full border-0 shadow-2xl bg-white/60 dark:bg-card/80 backdrop-blur-2xl relative overflow-hidden ring-1 ring-inset ring-black/10 dark:ring-white/10 glassmorphism-box">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 text-muted-foreground relative z-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                <Activity className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p>No data available</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" strokeOpacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke="hsl(var(--primary))" 
              fill={`url(#gradient-${index})`}
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--background))" }}
            />
          </AreaChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" strokeOpacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: "hsl(var(--chart-1))", strokeWidth: 2, fill: "hsl(var(--background))" }}
            />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" strokeOpacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={dataKey} 
              fill="hsl(var(--chart-2))" 
              radius={[8, 8, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={130}
              paddingAngle={2}
              dataKey={dataKey}
            >
              {data.map((entry, pieIndex) => (
                <Cell 
                  key={`cell-${pieIndex}`} 
                  fill={`hsl(var(--chart-${(pieIndex % 5) + 1}))`}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{
                fontSize: '12px',
                color: 'hsl(var(--muted-foreground))'
              }}
            />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="h-full"
    >
      <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/60 dark:bg-card/80 backdrop-blur-lg relative overflow-hidden ring-1 ring-inset ring-black/10 dark:ring-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent dark:from-primary/10 dark:via-card/10 dark:to-accent/10 pointer-events-none" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-6 px-4 sm:px-6 relative z-10">
          <div style={{ width: '100%', height }} className="flex items-center justify-center">
            <ResponsiveContainer>
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DataTable = ({ data, title }: { data: any[]; title: string }) => {
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 6;

  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [filter, sortField, sortDirection, dateRange]);

  const isDateFiltered = dateRange.from && dateRange.to;
  let filteredData = data.filter(item =>
    item.campaign.toLowerCase().includes(filter.toLowerCase())
  );
  if (isDateFiltered) {
    filteredData = filteredData.filter(item => {
      if (!item.date) return true;
      return item.date >= dateRange.from && item.date <= dateRange.to;
    });
  }

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const totalRows = sortedData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedData = sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const downloadCSV = () => {
    const headers = ["Campaign", "Impressions", "Clicks", "CTR", "Spend", "Revenue", "ROAS", "Status"];
    const csvContent = [
      headers.join(","),
      ...sortedData.map(row => [
        `"${row.campaign}"`,
        row.impressions,
        row.clicks,
        `${row.ctr}%`,
        `$${row.spend}`,
        `$${row.revenue}`,
        row.roas,
        row.status
      ].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campaign_performance.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    const tableSection = document.getElementById('campaign-table-pdf');
    if (!tableSection) return;
    const canvas = await html2canvas(tableSection, { backgroundColor: null, scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = { width: canvas.width, height: canvas.height };
    const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
    const imgWidth = imgProps.width * ratio;
    const imgHeight = imgProps.height * ratio;
    pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, 32, imgWidth, imgHeight);
    pdf.save('campaign_performance.pdf');
  };

  React.useEffect(() => { setPage(1); }, [filter, sortField, sortDirection, dateRange]);

  return (
    <div className="bg-white/60 dark:bg-card/80 rounded-xl shadow-2xl ring-1 ring-inset ring-black/10 dark:ring-white/10 backdrop-blur-2xl overflow-hidden glassmorphism-box">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">
            <span className="inline-block px-4 py-1 rounded-xl bg-white/70 dark:bg-card/70 backdrop-blur-md shadow-md border border-white/30 dark:border-card/30">
              {title}
            </span>
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Filter campaigns..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">From</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))}
                  className="px-2 py-1 border border-border rounded bg-background text-foreground text-xs"
                />
                <label className="text-xs text-muted-foreground">To</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))}
                  className="px-2 py-1 border border-border rounded bg-background text-foreground text-xs"
                />
              </div>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors border border-border"
              >
                <FileText className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto px-2 pb-2" id="campaign-table-pdf">
        {loading ? (
          <table className="w-full animate-pulse">
            <thead className="bg-muted/50">
              <tr>
                {["campaign", "impressions", "clicks", "ctr", "spend", "revenue", "roas", "status"].map((field) => (
                  <th key={field} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-1">{field.charAt(0).toUpperCase() + field.slice(1)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {[...Array(rowsPerPage)].map((_, i) => (
                <tr key={i}>
                  {[...Array(8)].map((_, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-20 bg-muted/40 rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {["campaign", "impressions", "clicks", "ctr", "spend", "revenue", "roas", "status"].map((field) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field)}
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted"
                  >
                    <div className="flex items-center gap-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortField === field && (
                        <span className="text-primary">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {row.campaign}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {row.impressions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {row.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {row.ctr}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    ${row.spend.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success">
                    ${row.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {row.roas}x
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn("inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                      row.status === 'active' ? 'bg-success/10 text-success' :
                      row.status === 'paused' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-6 py-3 bg-muted/50 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((page - 1) * rowsPerPage + 1, totalRows)}-
          {Math.min(page * rowsPerPage, totalRows)} of {totalRows} campaigns
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-background border border-border text-foreground disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-background border border-border text-foreground disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  // Fixed data generators with consistent structure
  const generateYearlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((month, index) => ({
      name: month, // This is crucial - charts expect 'name' property
      month: month,
      revenue: Math.round(150000 + (index * 15000) + (Math.sin(index) * 30000)),
      users: Math.round(25000 + (index * 2000) + (Math.cos(index) * 5000)),
      sessions: Math.round(45000 + (index * 3000) + (Math.sin(index * 1.5) * 8000)),
      value: Math.round(150000 + (index * 15000) + (Math.sin(index) * 30000)) // For area charts
    }));
  };

  const generateCampaignData = () => {
    const campaigns = [
      "Valentine's Day Special",
      "Customer Loyalty Program", 
      "Video Ad Series - Tech Products",
      "Influencer Collaboration Campaign",
      "Summer Sale",
      "Back to School",
      "Holiday Blitz",
      "New Product Launch",
      "Referral Drive",
      "Flash Sale",
      "Brand Awareness",
      "App Install Campaign"
    ];
    // Generate a date for each campaign, spread over the last 12 months
    const today = new Date();
    return campaigns.map((name, idx) => {
      const baseImpressions = 500000 + (idx * 100000);
      const baseClicks = 25000 + (idx * 5000);
      const baseSpend = 15000 + (idx * 3000);
      const baseRevenue = 50000 + (idx * 15000);
      // Each campaign is assigned a date, one per month
      const date = new Date(today.getFullYear(), today.getMonth() - (campaigns.length - 1 - idx), 15);
      return {
        campaign: name,
        impressions: Math.round(baseImpressions * (0.8 + Math.random() * 0.4)),
        clicks: Math.round(baseClicks * (0.8 + Math.random() * 0.4)),
        ctr: Number((Math.random() * 8 + 2).toFixed(1)),
        spend: Math.round(baseSpend * (0.8 + Math.random() * 0.4)),
        revenue: Math.round(baseRevenue * (0.8 + Math.random() * 0.4)),
        roas: Number((2 + Math.random() * 2).toFixed(2)),
        status: ["active","paused","completed"][Math.floor(Math.random() * 3)],
        date: date.toISOString().slice(0, 10) // YYYY-MM-DD
      };
    });
  };

  // State management
  const [baseYearlyData] = useState(generateYearlyData());
  const [baseCampaignData] = useState(generateCampaignData());
  const [currentMetrics, setCurrentMetrics] = useState(metricsData);
  const [isRealTime, setIsRealTime] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filteredChartData, setFilteredChartData] = useState(generateYearlyData());
  const [currentCampaignData, setCurrentCampaignData] = useState(generateCampaignData());
  const [trafficSourceData, setTrafficSourceData] = useState(generateTrafficSourceData());
  const [deviceData, setDeviceData] = useState(generateDeviceData());
  const [ageData, setAgeData] = useState(generateAgeData());
  const [geographicData, setGeographicData] = useState(generateGeographicData());
  const [hourlyData, setHourlyData] = useState(generateHourlyData());
  const [funnelData, setFunnelData] = useState(generateFunnelData());

  // Real-time data simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRealTime) {
      interval = setInterval(() => {
        // Update metrics
        setCurrentMetrics(generateVariedMetrics(metricsData, true));

        // Update chart data with variations - FIXED STRUCTURE
        const updatedChartData = baseYearlyData.map(item => ({
          ...item,
          name: item.name, // Ensure name is preserved
          revenue: Math.round(item.revenue * (0.95 + Math.random() * 0.1)),
          users: Math.round(item.users * (0.95 + Math.random() * 0.1)),
          sessions: Math.round(item.sessions * (0.95 + Math.random() * 0.1)),
          value: Math.round(item.revenue * (0.95 + Math.random() * 0.1)) // For area charts
        }));
        setFilteredChartData(updatedChartData);

        // Update campaign data
        setCurrentCampaignData(prev => prev.map(campaign => ({
          ...campaign,
          impressions: Math.round(campaign.impressions * (0.98 + Math.random() * 0.04)),
          clicks: Math.round(campaign.clicks * (0.98 + Math.random() * 0.04)),
          ctr: Number((campaign.ctr * (0.95 + Math.random() * 0.1)).toFixed(1)),
          spend: Math.round(campaign.spend * (0.98 + Math.random() * 0.04)),
          revenue: Math.round(campaign.revenue * (0.98 + Math.random() * 0.04)),
          roas: Number((campaign.roas * (0.95 + Math.random() * 0.1)).toFixed(2))
        })));

        // Update other chart data
        setTrafficSourceData(generateTrafficSourceData());
        setDeviceData(generateDeviceData());
        setAgeData(generateAgeData());
        setGeographicData(generateGeographicData());
        setHourlyData(generateHourlyData());
        setFunnelData(generateFunnelData());

        setLastUpdated(new Date());
      }, 2000); // Update every 2 seconds
    } else {
      // Reset to base data when turning off real-time
      setCurrentMetrics(metricsData);
      setFilteredChartData(baseYearlyData);
      setCurrentCampaignData(baseCampaignData);
      setTrafficSourceData(generateTrafficSourceData());
      setDeviceData(generateDeviceData());
      setAgeData(generateAgeData());
      setGeographicData(generateGeographicData());
      setHourlyData(generateHourlyData());
      setFunnelData(generateFunnelData());
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRealTime, baseYearlyData, baseCampaignData]);

  const toggleRealTime = () => {
    setIsRealTime(!isRealTime);
    setLastUpdated(new Date());
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Glassmorphism global styles for text readability */}
      <style>{`
        .glass-text {
          text-shadow: 0 2px 16px rgba(0,0,0,0.12), 0 1.5px 2px rgba(0,0,0,0.10);
        }
        .dark .glass-text {
          text-shadow: 0 2px 16px rgba(0,0,0,0.32), 0 1.5px 2px rgba(0,0,0,0.18);
        }
      `}</style>
      {/* Theme-aware selection color styles */}
      <style>{`
        ::selection {
          background: #111;
          color: #fff;
        }
        html.dark ::selection, body.dark ::selection, .dark ::selection {
          background: #fff;
          color: #111;
        }
      `}</style>
      {/* Animated Waves Background */}
      <Waves
        className="pointer-events-none z-0"
        lineColor="hsl(var(--primary)/0.12)"
        backgroundColor="transparent"
        waveSpeedX={0.0125}
        waveSpeedY={0.005}
        waveAmpX={32}
        waveAmpY={16}
        xGap={16}
        yGap={36}
        friction={0.92}
        tension={0.004}
        maxCursorMove={100}
      />
      {/* Add a dark mode overlay for better contrast */}
      <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-background/80 to-muted/40 z-0" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/60 dark:bg-card/80 backdrop-blur-2xl shadow-2xl border-b border-border/40 ring-1 ring-inset ring-black/10 dark:ring-white/10 sticky top-0 glassmorphism-header"
        style={{
          WebkitBackdropFilter: 'blur(24px)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-primary via-primary to-accent rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Activity className="h-7 w-7 text-primary-foreground" />
                </motion.div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent glass-text">
                    ADmyBRAND Insights
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium glass-text">
                    AI-Powered Analytics Dashboard
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={toggleRealTime}
                variant={isRealTime ? "default" : "outline"}
                size="lg"
                className={cn("relative overflow-hidden transition-all duration-300",
                  isRealTime 
                    ? 'bg-gradient-to-r from-success to-success/80 text-success-foreground shadow-lg shadow-success/25 border-0' 
                    : 'bg-card/50 backdrop-blur-sm hover:bg-card/80 border-border/50'
                )}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={isRealTime ? { x: ['-100%', '100%'] } : {}}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
                <RefreshCw className={cn("mr-2 h-5 w-5", isRealTime && "animate-spin")} />
                {isRealTime ? 'Live Mode' : 'Static Mode'}
              </Button>
              <ThemeToggle />
            </motion.div>
          </div>
          
          {isRealTime && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 text-sm"
            >
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-muted-foreground font-medium">
                Live data • Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
        
        {/* Metrics Cards */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.h2 
            className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3 glass-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
            <span className="inline-block px-4 py-1 rounded-xl bg-white/70 dark:bg-card/70 backdrop-blur-md shadow-md border border-white/30 dark:border-card/30">
              Key Performance Indicators
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10">
            {currentMetrics.slice(0, 4).map((metric, index) => (
              <MetricCard key={metric.label} metric={metric} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Additional Metrics Row */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10">
            {currentMetrics.slice(4, 8).map((metric, index) => (
              <MetricCard key={metric.label} metric={metric} index={index + 4} />
            ))}
          </div>
        </motion.section>

        {/* Main Charts Section */}
        <motion.section 
          className="grid grid-cols-1 2xl:grid-cols-2 gap-x-10 xl:gap-x-14"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex flex-col gap-10">
            <motion.h2 
              className="text-2xl font-bold text-foreground flex items-center gap-3 glass-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="w-1 h-8 bg-gradient-to-b from-chart-1 to-chart-2 rounded-full"></div>
              <span className="inline-block px-4 py-1 rounded-xl bg-white/70 dark:bg-card/70 backdrop-blur-md shadow-md border border-white/30 dark:border-card/30">
                Revenue Trends
              </span>
            </motion.h2>
            <ChartCard
              title="Monthly Revenue"
              data={filteredChartData}
              type="area"
              dataKey="revenue"
              height={350}
              index={0}
            />
            <ChartCard
              title="User Growth"
              data={filteredChartData}
              type="line"
              dataKey="users"
              height={320}
              index={2}
            />
          </div>
          <div className="flex flex-col gap-10">
            <motion.h2 
              className="text-2xl font-bold text-foreground flex items-center gap-3 glass-text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <div className="w-1 h-8 bg-gradient-to-b from-chart-3 to-chart-4 rounded-full"></div>
              <span className="inline-block px-4 py-1 rounded-xl bg-white/70 dark:bg-card/70 backdrop-blur-md shadow-md border border-white/30 dark:border-card/30">
                Traffic Sources
              </span>
            </motion.h2>
            <ChartCard
              title="Traffic Distribution"
              data={trafficSourceData}
              type="pie"
              dataKey="value"
              height={350}
              index={1}
            />
            <ChartCard
              title="Session Volume"
              data={filteredChartData}
              type="bar"
              dataKey="sessions"
              height={320}
              index={3}
            />
          </div>
        </motion.section>


        {/* Additional Analytics Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.h2 
            className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3 glass-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 }}
          >
            <div className="w-1 h-8 bg-gradient-to-b from-chart-5 to-primary rounded-full"></div>
            <span className="inline-block px-4 py-1 rounded-xl bg-white/70 dark:bg-card/70 backdrop-blur-md shadow-md border border-white/30 dark:border-card/30">
              Additional Insights
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 lg:gap-10 xl:gap-12">
            <ChartCard
              title="Device Breakdown"
              data={deviceData}
              type="pie"
              dataKey="value"
              height={300}
              index={4}
            />
            
            <ChartCard
              title="Age Demographics"
              data={ageData}
              type="pie"
              dataKey="value"
              height={300}
              index={5}
            />
            
            <ChartCard
              title="Geographic Revenue"
              data={geographicData}
              type="bar"
              dataKey="revenue"
              height={300}
              index={6}
            />
          </div>
        </motion.section>

        {/* Hourly Performance */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <motion.h2 
            className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3 glass-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="w-1 h-8 bg-gradient-to-b from-accent to-chart-1 rounded-full"></div>
            <span className="inline-block px-4 py-1 rounded-xl bg-white/70 dark:bg-card/70 backdrop-blur-md shadow-md border border-white/30 dark:border-card/30">
              Today's Hourly Performance
            </span>
          </motion.h2>
          <ChartCard
            title="Hourly Activity"
            data={hourlyData}
            type="area"
            dataKey="value"
            height={320}
            index={7}
          />
        </motion.section>
        
        {/* Conversion Funnel - Now Dynamic */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <motion.h2 
            className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3 glass-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.7 }}
          >
            <div className="w-1 h-8 bg-gradient-to-b from-chart-2 to-chart-3 rounded-full"></div>
            <span className="inline-block px-4 py-1 rounded-xl bg-white/70 dark:bg-card/70 backdrop-blur-md shadow-md border border-white/30 dark:border-card/30">
              Conversion Funnel
            </span>
            {isRealTime && (
              <Badge variant="outline" className="ml-2 animate-pulse bg-success/10 text-success border-success/20">
                Live Updates
              </Badge>
            )}
          </motion.h2>
          <ChartCard
            title="Sales Funnel Analysis"
            data={funnelData}
            type="bar"
            dataKey="users"
            height={320}
            index={8}
          />
        </motion.section>

        {/* Data Table */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <motion.h2 
            className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3 glass-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.9 }}
          >
            <div className="w-1 h-8 bg-gradient-to-b from-chart-4 to-chart-5 rounded-full"></div>
            <span className="inline-block px-4 py-1 rounded-xl bg-white/70 dark:bg-card/70 backdrop-blur-md shadow-md border border-white/30 dark:border-card/30">
              Campaign Performance
            </span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.0, duration: 0.5 }}
          >
            <DataTable data={currentCampaignData} title="Campaign Performance" />
          </motion.div>
        </motion.section>

      </main>
    </div>
  );
}