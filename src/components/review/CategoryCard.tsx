
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    count: number;
  }
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Card className="hover:border-trustpurple-500/30 hover:shadow-sm transition-all cursor-pointer">
      <CardContent className={cn(
        "p-4 flex flex-col items-center justify-center text-center"
      )}>
        <div className="text-3xl mb-2">{category.icon}</div>
        <h3 className="font-medium mb-1">{category.name}</h3>
        <p className="text-xs text-muted-foreground">{category.count} companies</p>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
