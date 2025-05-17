
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryViewProps {
  categories: {
    id: string;
    name: string;
    icon: string;
    count: number;
  }[];
}

const CategoriesView = ({ categories }: CategoryViewProps) => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">All Categories</h2>
      <p className="text-muted-foreground mb-6">Browse reviews by category to find what you're looking for</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map(category => (
          <Card key={category.id} className="hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <div className="text-3xl">{category.icon}</div>
              </div>
              <CardDescription>{category.count} companies</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">Browse {category.name}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesView;
