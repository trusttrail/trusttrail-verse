
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { web3Categories } from '@/data/web3Categories';

interface CategoryViewProps {
  categories: {
    id: string | number;
    name: string;
    icon?: string;
    count?: number;
  }[];
}

const CategoriesView = ({ categories }: CategoryViewProps) => {
  // Use web3Categories as the primary source, fallback to props if needed
  const displayCategories = web3Categories.length > 0 ? web3Categories : categories.map(cat => ({
    id: cat.id.toString(),
    name: cat.name,
    icon: cat.icon || '📦',
    count: cat.count || 0,
    description: `Projects in ${cat.name} category`
  }));

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Web3 Categories</h2>
      <p className="text-muted-foreground mb-6">Explore projects across different Web3 sectors and find what you're looking for</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCategories.map(category => (
          <Card key={category.id} className="hover:shadow-md transition-all hover:border-trustpurple-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <div className="text-2xl">{category.icon}</div>
              </div>
              <CardDescription className="text-sm">
                {category.description || `${category.count} projects available`}
              </CardDescription>
              <div className="text-sm text-muted-foreground">
                {category.count} projects
              </div>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full hover:bg-trustpurple-500/10">
                Browse {category.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesView;
