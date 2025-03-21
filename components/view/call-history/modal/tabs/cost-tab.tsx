"use client";

import { ExecutionModel } from "@/app/modules/call-history/interface";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

interface CostTabProps {
  execution: ExecutionModel;
}

export function CostTab({ execution }: CostTabProps) {
  const costBreakdown = execution.cost_breakdown || {};
  const totalCost = execution.total_cost || 0.0;
  
  // Generate colors for the pie chart segments
  const COLORS = [
    "rgb(20, 184, 166)", // teal-500
    "rgb(59, 130, 246)", // blue-500
    "rgb(245, 158, 11)", // amber-500
    "rgb(139, 92, 246)", // violet-500
    "rgb(236, 72, 153)", // pink-500
    "rgb(34, 197, 94)", // green-500
  ];
  
  // Format data for Recharts
  const chartData = Object.entries(costBreakdown).map(([name, value], index) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1) || "Unknown", // Capitalize first letter
    value: Number(value) || 0.0,
    color: COLORS[index % COLORS.length]
  }));
  
  // Create chart config for shadcn Chart
  const chartConfig = chartData.reduce((config, entry) => {
    config[entry.name] = {
      label: entry.name,
      color: entry.color
    };
    return config;
  }, {} as Record<string, { label: string, color: string }>);
  
  if (chartData.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        <p>No cost data available for this call.</p>
      </div>
    );
  }

  const formatCost = (value: number, precision: number = 3) => {
    return value.toFixed(precision);
  };

  return (
    <Card>
      <CardHeader className="flex items-center">
        <CardTitle className="text-lg">Cost Breakdown</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Call Cost Distribution</CardDescription>
      </CardHeader>
      
      {/* shadcn Chart with Recharts PieChart */}
      <CardContent className="flex justify-center py-4">
        <div className="flex-1 pb-0 h-64">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                strokeWidth={5}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent 
                    hideLabel
                    indicator="dot"
                  />
                }
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground">
                <tspan x="50%" dy="-5" className="text-lg font-bold fill-foreground">${formatCost(totalCost)}</tspan>
                <tspan x="50%" dy="20" className="text-xs fill-muted-foreground">Total Cost</tspan>
              </text>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
      
      {/* Legend */}
      <CardContent className="space-y-2">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-sm" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm">{entry.name}</span>
            <span className="text-sm ml-auto">${formatCost(entry.value, 6)}</span>
          </div>
        ))}
      </CardContent>
      
      {/* Detailed Cost Cards */}
      <CardContent className="grid grid-cols-2 gap-3 mt-6">
        {chartData.map((entry) => (
          <Card key={entry.name} className="p-4 bg-sidebar text-sidebar-foreground">
            <div className="text-sm font-medium">{entry.name}</div>
            <div className="text-xl font-bold mt-1">${formatCost(entry.value, 6)}</div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
} 