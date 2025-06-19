
import React from 'react';
import CategoryCard from "@/components/review/CategoryCard";
import { web3Categories } from '@/data/web3Categories';

interface CategoriesSectionProps {
  categories: {
    id: string | number;
    name: string;
    icon?: string;
    count?: number;
  }[];
}

const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  // Use the first 12 Web3 categories for the home page display
  const displayCategories = web3Categories.slice(0, 12).map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    count: cat.count
  }));

  return (
    <section className="mb-10">
      <h3 className="text-2xl font-bold mb-4">Web3 Categories</h3>
      <p className="text-muted-foreground mb-6">Browse reviews by category to find what you're looking for</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayCategories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
