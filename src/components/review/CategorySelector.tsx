
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategory(value);
    
    // Filter categories based on input
    if (value.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(cat => 
        cat.name.toLowerCase().includes(value.toLowerCase()) ||
        cat.id.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
    
    setIsDropdownOpen(true);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsDropdownOpen(true);
    setFilteredCategories(categories);
  };

  const handleCategoryClick = (selectedCategory: Category) => {
    setCategory(selectedCategory.name);
    setIsDropdownOpen(false);
    inputRef.current?.blur();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update filtered categories when categories prop changes
  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  // Get display name for selected category
  const selectedCategory = categories.find(c => c.name === category || c.id === category);
  const displayValue = selectedCategory ? selectedCategory.name : category;

  return (
    <div className="relative">
      <label htmlFor="category" className="block text-sm font-medium mb-2">Category *</label>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Type or select category..."
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pr-8"
        />
        <ChevronDown 
          size={16} 
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
      
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-[100] w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="px-3 py-2 cursor-pointer hover:bg-accent text-sm transition-colors border-b border-border/50 last:border-b-0"
              >
                <div className="font-medium">{cat.name}</div>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {category.trim() === '' ? 'Start typing to search categories...' : 'No matching categories found. You can still submit with your custom category.'}
            </div>
          )}
        </div>
      )}
      
      {category && (
        <div className="mt-1 text-xs text-muted-foreground">
          {selectedCategory ? `Selected: ${selectedCategory.name}` : `Custom category: ${category}`}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
