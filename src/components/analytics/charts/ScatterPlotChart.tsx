
import React, { useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minRating, setMinRating] = useState<string>("0");

  const categories = ["all", ...new Set(data.map(d => d.category))];
  
  const filteredData = data.filter(item => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const ratingMatch = item.rating >= parseFloat(minRating);
    return categoryMatch && ratingMatch;
  });

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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.company}</p>
          <p className="text-sm text-muted-foreground">Category: {data.category}</p>
          <p className="text-sm">Rating: {data.rating}/5</p>
          <p className="text-sm">Reviews: {data.reviewCount}</p>
          {data.trustScore && <p className="text-sm">Trust Score: {data.trustScore}</p>}
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
            <span className="text-sm font-medium">Category:</span>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Min Rating:</span>
            <Select value={minRating} onValueChange={setMinRating}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0+</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant="outline" className="ml-auto">
            {filteredData.length} companies
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={filteredData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
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
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Scatter 
                dataKey="rating" 
                fill="#7b58f6"
                fillOpacity={0.7}
                strokeWidth={2}
                r={6}
                name="Companies"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ScatterPlotChart;
