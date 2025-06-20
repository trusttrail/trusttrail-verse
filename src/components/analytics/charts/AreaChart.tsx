
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  const chartConfig = areas.reduce((acc, area) => {
    acc[area.dataKey] = {
      label: area.name,
      color: area.fill,
    };
    return acc;
  }, {} as any);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="date"
                className="text-xs fill-muted-foreground"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {areas.map((area) => (
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
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CustomAreaChart;
