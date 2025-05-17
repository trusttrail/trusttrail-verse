
import React from 'react';
import CategoryCard from "@/components/review/CategoryCard";

interface CategoriesSectionProps {
  categories: {
    id: string;
    name: string;
    icon: string;
    count: number;
  }[];
}

const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  return (
    <section className="mb-10">
      <h3 className="text-2xl font-bold mb-4">Main Categories</h3>
      <p className="text-muted-foreground mb-6">Browse reviews by category to find what you're looking for</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
