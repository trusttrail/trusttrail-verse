
import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  title: string;
  description: string;
  orientation?: "horizontal" | "vertical";
  color?: string;
}

const CustomBarChart = ({ data, title, description, orientation = "vertical", color = "#7b58f6" }: BarChartProps) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [displayCount, setDisplayCount] = useState<string>("10");

  const sortedData = [...data]
    .sort((a, b) => sortOrder === "desc" ? b.value - a.value : a.value - b.value)
    .slice(0, parseInt(displayCount));

  const chartConfig = {
    value: {
      label: "Value",
      color: color,
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            Reviews: {payload[0].value.toLocaleString()}
          </p>
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
            <span className="text-sm font-medium">Sort:</span>
            <Button
              variant={sortOrder === "desc" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortOrder("desc")}
            >
              High to Low
            </Button>
            <Button
              variant={sortOrder === "asc" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortOrder("asc")}
            >
              Low to High
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Show:</span>
            <Select value={displayCount} onValueChange={setDisplayCount}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="10">Top 10</SelectItem>
                <SelectItem value="15">Top 15</SelectItem>
                <SelectItem value="20">Top 20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={sortedData} 
              layout={orientation === "horizontal" ? "horizontal" : "vertical"}
              margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              {orientation === "horizontal" ? (
                <>
                  <XAxis type="number" className="text-xs fill-muted-foreground" />
                  <YAxis dataKey="name" type="category" className="text-xs fill-muted-foreground" width={80} />
                </>
              ) : (
                <>
                  <XAxis dataKey="name" className="text-xs fill-muted-foreground" angle={-45} textAnchor="end" height={80} />
                  <YAxis className="text-xs fill-muted-foreground" />
                </>
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="value" 
                fill={color}
                radius={orientation === "horizontal" ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                name="Reviews"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CustomBarChart;
