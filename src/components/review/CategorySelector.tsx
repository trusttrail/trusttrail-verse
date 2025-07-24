
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  category: string;
  setCategory: (category: string) => void;
  categories: Category[];
}

const CategorySelector = ({ category, setCategory, categories }: CategorySelectorProps) => {
  console.log('CategorySelector props:', { category, categoriesCount: categories.length });
  
  return (
    <div>
      <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="max-h-80 bg-popover border border-border z-[100]">
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id} className="cursor-pointer">
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {category && (
        <div className="mt-1 text-xs text-muted-foreground">
          Selected: {categories.find(c => c.id === category)?.name || category}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
