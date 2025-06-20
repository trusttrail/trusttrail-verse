
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface HeatMapChartProps {
  data: Array<{
    category: string;
    day: string;
    value: number;
  }>;
  title: string;
  description: string;
}

const HeatMapChart = ({ data, title, description }: HeatMapChartProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [intensityLevel, setIntensityLevel] = useState<string>("medium");

  const categories = ["all", ...new Set(data.map(d => d.category))];
  const days = [...new Set(data.map(d => d.day))];
  
  const filteredData = selectedCategory === "all" 
    ? data 
    : data.filter(d => d.category === selectedCategory);

  const maxValue = Math.max(...filteredData.map(d => d.value));
  const minValue = Math.min(...filteredData.map(d => d.value));

  const getIntensity = (value: number) => {
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const multiplier = intensityLevel === "low" ? 0.5 : intensityLevel === "high" ? 1.5 : 1;
    return Math.min(normalizedValue * multiplier, 1);
  };

  const getValue = (category: string, day: string) => {
    const item = filteredData.find(d => d.category === category && d.day === day);
    return item ? item.value : 0;
  };

  const displayCategories = selectedCategory === "all" ? categories.slice(1) : [selectedCategory];

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
            <span className="text-sm font-medium">Intensity:</span>
            <Select value={intensityLevel} onValueChange={setIntensityLevel}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant="outline" className="ml-auto">
            Range: {minValue} - {maxValue}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid gap-1 p-4 min-w-[600px]" style={{ gridTemplateColumns: `120px repeat(${days.length}, 1fr)` }}>
            <div></div>
            {days.map(day => (
              <div key={day} className="text-xs text-center font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {displayCategories.map(category => (
              <React.Fragment key={category}>
                <div className="text-xs font-medium text-muted-foreground p-2 truncate">
                  {category}
                </div>
                {days.map(day => {
                  const value = getValue(category, day);
                  const intensity = getIntensity(value);
                  return (
                    <div
                      key={`${category}-${day}`}
                      className="aspect-square rounded border border-border/20 flex items-center justify-center text-xs font-medium hover:border-border/50 transition-all cursor-pointer hover:scale-105"
                      style={{
                        backgroundColor: value > 0 ? `hsl(var(--primary) / ${intensity * 0.8 + 0.1})` : 'hsl(var(--muted) / 0.3)',
                        color: intensity > 0.5 ? 'white' : 'inherit'
                      }}
                      title={`${category} - ${day}: ${value} reviews`}
                    >
                      {value > 0 ? value : ''}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 px-4">
            <span className="text-xs text-muted-foreground">Less activity</span>
            <div className="flex items-center gap-1">
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-sm border border-border/20"
                  style={{ backgroundColor: `hsl(var(--primary) / ${opacity * 0.8 + 0.1})` }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">More activity</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatMapChart;
