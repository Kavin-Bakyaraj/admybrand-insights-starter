import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RefreshCw, Activity, Download, Filter } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { cn } from "@/lib/utils";

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
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Components
const MetricCard = ({ metric, index }: { metric: any; index: number }) => (
  <div 
    className="bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
      </div>
      <div className={cn("text-sm font-medium",
        metric.trend === 'up' && metric.change.startsWith('+') ? 'text-success' :
        metric.trend === 'up' && metric.change.startsWith('-') ? 'text-success' :
        'text-destructive'
      )}>
        {metric.change}
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, data, type, dataKey, height = 300 }: { title: string; data: any[]; type: string; dataKey: string; height?: number }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data available
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={dataKey} stroke="hsl(var(--primary))" fillOpacity={0.6} fill="hsl(var(--primary))" />
          </AreaChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey={dataKey} stroke="hsl(var(--chart-1))" strokeWidth={2} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={dataKey} fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

const DataTable = ({ data, title }: { data: any[]; title: string }) => {
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const filteredData = data.filter(item =>
    item.campaign.toLowerCase().includes(filter.toLowerCase())
  );

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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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

  return (
    <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
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
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
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
            {sortedData.map((row, index) => (
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
      </div>
      
      <div className="px-6 py-3 bg-muted/50 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Showing {sortedData.length} of {data.length} campaigns
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
    
    return campaigns.map((name, idx) => {
      const baseImpressions = 500000 + (idx * 100000);
      const baseClicks = 25000 + (idx * 5000);
      const baseSpend = 15000 + (idx * 3000);
      const baseRevenue = 50000 + (idx * 15000);
      
      return {
        campaign: name,
        impressions: Math.round(baseImpressions * (0.8 + Math.random() * 0.4)),
        clicks: Math.round(baseClicks * (0.8 + Math.random() * 0.4)),
        ctr: Number((Math.random() * 8 + 2).toFixed(1)),
        spend: Math.round(baseSpend * (0.8 + Math.random() * 0.4)),
        revenue: Math.round(baseRevenue * (0.8 + Math.random() * 0.4)),
        roas: Number((2 + Math.random() * 2).toFixed(2)),
        status: ["active","paused","completed"][Math.floor(Math.random() * 3)]
      };
    });
  };

  // Fixed traffic source data
  const generateTrafficSourceData = () => [
    { name: "Organic Search", value: 35 + Math.round(Math.random() * 10) },
    { name: "Paid Advertising", value: 28 + Math.round(Math.random() * 8) },
    { name: "Social Media", value: 20 + Math.round(Math.random() * 6) },
    { name: "Email Marketing", value: 12 + Math.round(Math.random() * 5) },
    { name: "Direct Traffic", value: 5 + Math.round(Math.random() * 3) }
  ];

  const generateDeviceData = () => [
    { name: "Desktop", value: 45 + Math.round(Math.random() * 10) },
    { name: "Mobile", value: 40 + Math.round(Math.random() * 10) },
    { name: "Tablet", value: 15 + Math.round(Math.random() * 5) }
  ];

  const generateAgeData = () => [
    { name: "18-24", value: 22 + Math.round(Math.random() * 8) },
    { name: "25-34", value: 35 + Math.round(Math.random() * 10) },
    { name: "35-44", value: 28 + Math.round(Math.random() * 8) },
    { name: "45-54", value: 12 + Math.round(Math.random() * 5) },
    { name: "55+", value: 3 + Math.round(Math.random() * 3) }
  ];

  const generateGeographicData = () => [
    { name: "United States", revenue: 120000 + Math.round(Math.random() * 50000) },
    { name: "United Kingdom", revenue: 85000 + Math.round(Math.random() * 30000) },
    { name: "Canada", revenue: 65000 + Math.round(Math.random() * 25000) },
    { name: "Australia", revenue: 45000 + Math.round(Math.random() * 20000) },
    { name: "Germany", revenue: 38000 + Math.round(Math.random() * 15000) }
  ];

  const generateHourlyData = () => {
    const hours = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
    return hours.map(hour => ({
      name: hour,
      value: Math.round(Math.random() * 3000 + 500),
      users: Math.round(Math.random() * 2000 + 300),
      sessions: Math.round(Math.random() * 2500 + 400)
    }));
  };

  const generateFunnelData = () => [
    { name: "Visitors", users: 100000 },
    { name: "Product Views", users: 45000 },
    { name: "Add to Cart", users: 12000 },
    { name: "Checkout", users: 8500 },
    { name: "Purchase", users: 6200 }
  ];

  const generateVariedMetrics = (baseMetrics: any[], isRealTime: boolean) => {
    if (!isRealTime) return baseMetrics;
    
    return baseMetrics.map(metric => ({
      ...metric,
      value: typeof metric.value === 'string' && metric.value.includes('$') 
        ? `$${(parseInt(metric.value.replace(/[$,]/g, '')) * (0.95 + Math.random() * 0.1)).toLocaleString()}`
        : typeof metric.value === 'string' && metric.value.includes('%')
        ? `${(parseFloat(metric.value) * (0.95 + Math.random() * 0.1)).toFixed(1)}%`
        : typeof metric.value === 'string' && metric.value.includes('m')
        ? `${(parseFloat(metric.value) * (0.95 + Math.random() * 0.1)).toFixed(0)}m ${metric.value.split(' ')[1] || ''}`
        : metric.value,
      change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 15 + 1).toFixed(1)}%`
    }));
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">ADmyBRAND Insights</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">AI-Powered Analytics Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleRealTime}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-md transition-all",
                  isRealTime 
                    ? 'bg-success text-success-foreground shadow-lg' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                <RefreshCw className={cn("h-4 w-4", isRealTime && "animate-spin")} />
                {isRealTime ? 'Live Mode' : 'Static Mode'}
              </button>
              <ThemeToggle />
            </div>
          </div>
          
          {isRealTime && (
            <div className="mt-2 text-xs text-muted-foreground">
              🔴 Live data • Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metrics Cards */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentMetrics.slice(0, 4).map((metric, index) => (
              <MetricCard key={metric.label} metric={metric} index={index} />
            ))}
          </div>
        </section>

        {/* Additional Metrics Row */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentMetrics.slice(4, 8).map((metric, index) => (
              <MetricCard key={metric.label} metric={metric} index={index + 4} />
            ))}
          </div>
        </section>

        {/* Main Charts Section */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Revenue Trends</h2>
            <ChartCard
              title="Monthly Revenue"
              data={filteredChartData}
              type="area"
              dataKey="revenue"
              height={350}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Traffic Sources</h2>
            <ChartCard
              title="Traffic Distribution"
              data={trafficSourceData}
              type="pie"
              dataKey="value"
              height={350}
            />
          </div>
        </section>

        {/* Additional Charts */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ChartCard
            title="User Growth"
            data={filteredChartData}
            type="line"
            dataKey="users"
            height={300}
          />
          
          <ChartCard
            title="Session Volume"
            data={filteredChartData}
            type="bar"
            dataKey="sessions"
            height={300}
          />
        </section>

        {/* Additional Analytics Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Additional Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            <ChartCard
              title="Device Breakdown"
              data={deviceData}
              type="pie"
              dataKey="value"
              height={280}
            />
            
            <ChartCard
              title="Age Demographics"
              data={ageData}
              type="pie"
              dataKey="value"
              height={280}
            />
            
            <ChartCard
              title="Geographic Revenue"
              data={geographicData}
              type="bar"
              dataKey="revenue"
              height={280}
            />
          </div>
        </section>

        {/* Hourly Performance */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Today's Hourly Performance</h2>
          <ChartCard
            title="Hourly Activity"
            data={hourlyData}
            type="area"
            dataKey="value"
            height={300}
          />
        </section>
        
        {/* Conversion Funnel */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Conversion Funnel</h2>
          <ChartCard
            title="Sales Funnel Analysis"
            data={funnelData}
            type="bar"
            dataKey="users"
            height={300}
          />
        </section>

        {/* Data Table */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Campaign Performance</h2>
          <DataTable data={currentCampaignData} title="Campaign Performance" />
        </section>

      </main>
    </div>
  );
}