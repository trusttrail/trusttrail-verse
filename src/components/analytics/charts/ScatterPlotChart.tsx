
import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ScatterPlotChartProps {
  data: Array<{
    rating: number;
    reviewCount: number;
    company: string;
    category: string;
    trustScore?: number;
  }>;
  title: string;
  description: string;
}

const ScatterPlotChart = ({ data, title, description }: ScatterPlotChartProps) => {
  const chartConfig = {
    rating: {
      label: "Rating",
      color: "#7b58f6",
    },
    reviewCount: {
      label: "Review Count",
      color: "#2c9fff",
    },
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="reviewCount" 
                type="number"
                domain={['dataMin', 'dataMax']}
                name="Review Count"
                className="text-xs fill-muted-foreground"
              />
              <YAxis 
                dataKey="rating" 
                type="number"
                domain={[0, 5]}
                name="Rating"
                className="text-xs fill-muted-foreground"
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter 
                dataKey="rating" 
                fill="var(--color-rating)"
                fillOpacity={0.7}
                strokeWidth={2}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ScatterPlotChart;
