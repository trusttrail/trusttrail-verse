
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
import { useToast } from '@/hooks/use-toast';

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
  // Only show companies that have reviews
  recentReviews?: Array<{
    id: number;
    companyName: string;
    reviewerAddress: string;
  }>;
}

const SearchBar = ({ companies = [], categories = [], recentReviews = [] }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter companies to only those with reviews
  const companiesWithReviews = companies.filter(company => 
    recentReviews.some(review => review.companyName === company.name)
  );

  const handleOpenSearch = () => {
    setOpen(true);
  };

  const handleSelectItem = (type: 'company' | 'category', item: any) => {
    setOpen(false);
    
    // In a real app, we would navigate to the specific company or category page
    // For now, we'll just show a toast
    toast({
      title: `Selected ${type}: ${item.name}`,
      description: `This would navigate to the ${type} detail page in a full implementation.`,
    });
    
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
          placeholder="Search for reviewed companies or categories..." 
          className="pl-10 h-12 text-lg cursor-pointer" 
          readOnly
          onClick={handleOpenSearch}
        />
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search companies with reviews..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {companiesWithReviews.length > 0 ? (
            <CommandGroup heading="Companies with Reviews">
              {companiesWithReviews.map(company => (
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
          ) : (
            <CommandGroup heading="No Reviewed Companies">
              <CommandItem disabled>
                No companies have been reviewed yet
              </CommandItem>
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
