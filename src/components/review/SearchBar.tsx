
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  companies?: Array<{
    id: number;
    name: string;
    category: string;
  }>;
  categories?: Array<{
    id: string;
    name: string;
  }>;
}

const SearchBar = ({ companies = [], categories = [] }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenSearch = () => {
    setOpen(true);
  };

  const handleSelectItem = (type: 'company' | 'category', item: any) => {
    setOpen(false);
    
    // In a real app, we would navigate to the specific company or category page
    // For now, we'll just log and show a toast
    console.log(`Selected ${type}:`, item);
    
    if (type === 'company') {
      // Navigate to company page (would be implemented in a real app)
      // navigate(`/review-portal/company/${item.id}`);
    } else {
      // Navigate to category page (would be implemented in a real app)
      // navigate(`/review-portal/category/${item.id}`);
    }
  };

  return (
    <section className="mb-10">
      <div className="relative" onClick={handleOpenSearch}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <Input 
          placeholder="Search for a company or category..." 
          className="pl-10 h-12 text-lg cursor-pointer" 
          readOnly
          onClick={handleOpenSearch}
        />
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search companies and categories..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {companies.length > 0 && (
            <CommandGroup heading="Companies">
              {companies.map(company => (
                <CommandItem 
                  key={`company-${company.id}`}
                  onSelect={() => handleSelectItem('company', company)}
                >
                  <div className="flex flex-col">
                    <span>{company.name}</span>
                    <span className="text-xs text-muted-foreground">{company.category}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {categories.length > 0 && (
            <CommandGroup heading="Categories">
              {categories.map(category => (
                <CommandItem 
                  key={`category-${category.id}`}
                  onSelect={() => handleSelectItem('category', category)}
                >
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </section>
  );
};

export default SearchBar;
