
import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface LineChartProps {
  data: Array<{
    date: string;
    reviews: number;
    rating: number;
    [key: string]: any;
  }>;
  title: string;
  description: string;
  lines: Array<{
    dataKey: string;
    stroke: string;
    name: string;
  }>;
}

const CustomLineChart = ({ data, title, description, lines }: LineChartProps) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");
  const [visibleLines, setVisibleLines] = useState<string[]>(lines.map(l => l.dataKey));

  const filteredData = data.slice(timeRange === "7d" ? -7 : timeRange === "30d" ? -30 : 0);

  const chartConfig = lines.reduce((acc, line) => {
    acc[line.dataKey] = {
      label: line.name,
      color: line.stroke,
    };
    return acc;
  }, {} as any);

  const toggleLine = (dataKey: string) => {
    setVisibleLines(prev => 
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
            <span className="text-sm font-medium">Show:</span>
            {lines.map((line) => (
              <div key={line.dataKey} className="flex items-center space-x-2">
                <Checkbox
                  id={line.dataKey}
                  checked={visibleLines.includes(line.dataKey)}
                  onCheckedChange={() => toggleLine(line.dataKey)}
                />
                <label
                  htmlFor={line.dataKey}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  style={{ color: line.stroke }}
                >
                  {line.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="date"
                className="text-xs fill-muted-foreground"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {lines.map((line) => (
                visibleLines.includes(line.dataKey) && (
                  <Line
                    key={line.dataKey}
                    type="monotone"
                    dataKey={line.dataKey}
                    stroke={line.stroke}
                    strokeWidth={3}
                    dot={{ fill: line.stroke, r: 4 }}
                    name={line.name}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CustomLineChart;
