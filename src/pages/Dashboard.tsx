import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { DateFilter } from "@/components/dashboard/DateFilter";
import { Button } from "@/components/ui/button";
import { RefreshCw, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  metricsData,
  revenueChartData,
  trafficSourceData,
  campaignTableData,
  generateRealTimeData,
  type MetricData
} from "@/data/mockData";
import {
  deviceData,
  geographicData,
  hourlyData,
  ageData,
  funnelData
} from "@/data/additionalData";

export default function Dashboard() {
  const [currentMetrics, setCurrentMetrics] = useState<MetricData[]>(metricsData);
  const [isRealTime, setIsRealTime] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filteredData, setFilteredData] = useState(revenueChartData);

  // Real-time data simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRealTime) {
      interval = setInterval(() => {
        setCurrentMetrics(generateRealTimeData());
        setLastUpdated(new Date());
      }, 3000); // Update every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRealTime]);

  const toggleRealTime = () => {
    setIsRealTime(!isRealTime);
    if (!isRealTime) {
      setCurrentMetrics(generateRealTimeData());
      setLastUpdated(new Date());
    } else {
      setCurrentMetrics(metricsData);
    }
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    console.log("Date range changed:", range);
    
    // Filter data based on date range
    if (range.from && range.to) {
      // Generate filtered data based on date range
      const monthDiff = Math.abs(range.to.getMonth() - range.from.getMonth());
      const filteredMonths = revenueChartData.slice(0, Math.max(1, monthDiff + 1));
      setFilteredData(filteredMonths);
    } else {
      setFilteredData(revenueChartData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">ADmyBRAND Insights</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">AI-Powered Analytics Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <DateFilter onDateRangeChange={handleDateRangeChange} />
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={isRealTime ? "default" : "outline"}
                  size="sm"
                  onClick={toggleRealTime}
                  className={cn(
                    "transition-all duration-200",
                    isRealTime && "animate-pulse"
                  )}
                >
                  <RefreshCw className={cn("mr-2 h-4 w-4", isRealTime && "animate-spin")} />
                  {isRealTime ? "Live" : "Static"}
                </Button>
                
                <ThemeToggle />
              </div>
            </div>
          </div>
          
          {isRealTime && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs text-muted-foreground"
            >
              Live data • Last updated: {lastUpdated.toLocaleTimeString()}
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Metrics Cards */}
        <section>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-semibold text-foreground mb-6"
          >
            Key Performance Indicators
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {currentMetrics.slice(0, 4).map((metric, index) => (
              <MetricCard key={metric.label} metric={metric} index={index} />
            ))}
          </div>
        </section>

        {/* Additional Metrics Row */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {currentMetrics.slice(4, 8).map((metric, index) => (
              <MetricCard key={metric.label} metric={metric} index={index + 4} />
            ))}
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-semibold text-foreground mb-6"
            >
              Revenue Trends
            </motion.h2>
            <ChartCard
              title="Monthly Revenue"
              data={filteredData}
              type="area"
              dataKey="revenue"
              index={0}
              height={350}
            />
          </div>
          
          <div>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-semibold text-foreground mb-6"
            >
              Traffic Sources
            </motion.h2>
            <ChartCard
              title="Traffic Distribution"
              data={trafficSourceData}
              type="pie"
              dataKey="value"
              index={1}
              height={350}
            />
          </div>
        </section>

        {/* Additional Charts */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <ChartCard
            title="User Growth"
            data={filteredData}
            type="line"
            dataKey="users"
            index={2}
            height={300}
          />
          
          <ChartCard
            title="Session Volume"
            data={filteredData}
            type="bar"
            dataKey="sessions"
            index={3}
            height={300}
          />
        </section>

        {/* Additional Analytics Section */}
        <section>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-semibold text-foreground mb-6"
          >
            Additional Insights
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            <ChartCard
              title="Device Breakdown"
              data={deviceData}
              type="pie"
              dataKey="value"
              index={4}
              height={280}
            />
            
            <ChartCard
              title="Age Demographics"
              data={ageData}
              type="pie"
              dataKey="value"
              index={5}
              height={280}
            />
            
            <ChartCard
              title="Geographic Revenue"
              data={geographicData}
              type="bar"
              dataKey="revenue"
              index={6}
              height={280}
            />
          </div>
        </section>

        {/* Hourly Performance */}
        <section>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl font-semibold text-foreground mb-6"
          >
            Today's Hourly Performance
          </motion.h2>
          <ChartCard
            title="Hourly Activity"
            data={hourlyData}
            type="area"
            dataKey="value"
            index={7}
            height={300}
          />
        </section>
        
        {/* Conversion Funnel */}
        <section>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl font-semibold text-foreground mb-6"
          >
            Conversion Funnel
          </motion.h2>
          <ChartCard
            title="Sales Funnel Analysis"
            data={funnelData}
            type="bar"
            dataKey="users"
            index={8}
            height={300}
          />
        </section>

        {/* Data Table */}
        <section>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-semibold text-foreground mb-6"
          >
            Campaign Performance
          </motion.h2>
          <DataTable data={campaignTableData} title="Campaign Analytics" />
        </section>

      </main>
    </div>
  );
}