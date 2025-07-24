
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
  return (
    <div>
      <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="max-h-80 bg-popover border border-border z-40">
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
