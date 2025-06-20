
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  const categories = [...new Set(data.map(d => d.category))];
  const days = [...new Set(data.map(d => d.day))];
  const maxValue = Math.max(...data.map(d => d.value));

  const getIntensity = (value: number) => {
    return value / maxValue;
  };

  const getValue = (category: string, day: string) => {
    const item = data.find(d => d.category === category && d.day === day);
    return item ? item.value : 0;
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid gap-1 p-4" style={{ gridTemplateColumns: `120px repeat(${days.length}, 1fr)` }}>
            <div></div>
            {days.map(day => (
              <div key={day} className="text-xs text-center font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {categories.map(category => (
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
                      className="aspect-square rounded border border-border/20 flex items-center justify-center text-xs font-medium hover:border-border/50 transition-colors cursor-pointer"
                      style={{
                        backgroundColor: `hsl(var(--primary) / ${intensity * 0.8 + 0.1})`,
                        color: intensity > 0.5 ? 'white' : 'inherit'
                      }}
                      title={`${category} - ${day}: ${value}`}
                    >
                      {value}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatMapChart;
