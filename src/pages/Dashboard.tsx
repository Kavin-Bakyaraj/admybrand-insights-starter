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

export default function Dashboard() {
  const [currentMetrics, setCurrentMetrics] = useState<MetricData[]>(metricsData);
  const [isRealTime, setIsRealTime] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

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
    // Here you would typically filter your data based on the date range
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">ADmyBRAND Insights</h1>
                  <p className="text-sm text-muted-foreground">AI-Powered Analytics Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <DateFilter onDateRangeChange={handleDateRangeChange} />
              
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
      <main className="container mx-auto px-6 py-8 space-y-8">
        
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentMetrics.map((metric, index) => (
              <MetricCard key={metric.label} metric={metric} index={index} />
            ))}
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              data={revenueChartData}
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
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard
            title="User Growth"
            data={revenueChartData}
            type="line"
            dataKey="users"
            index={2}
            height={300}
          />
          
          <ChartCard
            title="Session Volume"
            data={revenueChartData}
            type="bar"
            dataKey="sessions"
            index={3}
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