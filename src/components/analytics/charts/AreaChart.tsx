
import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface AreaChartProps {
  data: Array<{
    date: string;
    [key: string]: any;
  }>;
  title: string;
  description: string;
  areas: Array<{
    dataKey: string;
    stackId: string;
    fill: string;
    name: string;
  }>;
}

const CustomAreaChart = ({ data, title, description, areas }: AreaChartProps) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");
  const [visibleAreas, setVisibleAreas] = useState<string[]>(areas.map(a => a.dataKey));

  const filteredData = data.slice(timeRange === "7d" ? -7 : timeRange === "30d" ? -30 : 0);

  const chartConfig = areas.reduce((acc, area) => {
    acc[area.dataKey] = {
      label: area.name,
      color: area.fill,
    };
    return acc;
  }, {} as any);

  const toggleArea = (dataKey: string) => {
    setVisibleAreas(prev => 
      prev.includes(dataKey) 
        ? prev.filter(key => key !== dataKey)
        : [...prev, dataKey]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time Range:</span>
            <Button
              variant={timeRange === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("7d")}
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("30d")}
            >
              30 Days
            </Button>
            <Button
              variant={timeRange === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("all")}
            >
              All
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Categories:</span>
            {areas.map((area) => (
              <div key={area.dataKey} className="flex items-center space-x-2">
                <Checkbox
                  id={area.dataKey}
                  checked={visibleAreas.includes(area.dataKey)}
                  onCheckedChange={() => toggleArea(area.dataKey)}
                />
                <label
                  htmlFor={area.dataKey}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  style={{ color: area.fill }}
                >
                  {area.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="date"
                className="text-xs fill-muted-foreground"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {areas.map((area) => (
                visibleAreas.includes(area.dataKey) && (
                  <Area
                    key={area.dataKey}
                    type="monotone"
                    dataKey={area.dataKey}
                    stackId={area.stackId}
                    stroke={area.fill}
                    fill={area.fill}
                    fillOpacity={0.6}
                    name={area.name}
                  />
                )
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CustomAreaChart;
