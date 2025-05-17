
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <section className="mb-10">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <Input 
          placeholder="Search for a company or category..." 
          className="pl-10 h-12 text-lg" 
        />
      </div>
    </section>
  );
};

export default SearchBar;
