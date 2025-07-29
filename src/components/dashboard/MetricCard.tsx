import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetricData } from "@/data/mockData";

interface MetricCardProps {
  metric: MetricData;
  index?: number;
}

export function MetricCard({ metric, index = 0 }: MetricCardProps) {
  const { label, value, change, trend } = metric;

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

  const TrendIcon = trendIcon[trend];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          <div className={cn("p-2 rounded-full", 
            trend === 'up' ? 'bg-success/10' : 
            trend === 'down' ? 'bg-destructive/10' : 
            'bg-muted/10'
          )}>
            <TrendIcon className={cn("h-4 w-4", trendColor[trend])} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="flex items-center space-x-1 text-xs">
              <span className={cn("font-medium", trendColor[trend])}>
                {typeof change === 'number' ? (change > 0 ? '+' : '') + change.toFixed(1) + '%' : String(change)}
              </span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}