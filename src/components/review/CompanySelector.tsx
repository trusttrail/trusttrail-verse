
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

interface Company {
  id: number;
  name: string;
  category: string;
  logo?: string;
}

interface CompanySelectorProps {
  companyName: string;
  setCompanyName: (name: string) => void;
  setCategory: (category: string) => void;
  openCompanySelect: boolean;
  setOpenCompanySelect: (open: boolean) => void;
  filteredCompanies: Company[];
  handleCompanySearch: (value: string) => void;
  handleCompanySelect: (company: Company) => void;
}

const CompanySelector = ({
  companyName,
  setCompanyName,
  filteredCompanies,
  handleCompanySearch,
  handleCompanySelect
}: CompanySelectorProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompanyName(value);
    handleCompanySearch(value);
    setIsDropdownOpen(true);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsDropdownOpen(true);
    handleCompanySearch(companyName);
  };

  const handleCompanyClick = (company: Company) => {
    console.log('Company selected:', company);
    handleCompanySelect(company);
    setIsDropdownOpen(false);
    setIsFocused(false);
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

  const showDropdown = isDropdownOpen && isFocused && (companyName.length > 0 || filteredCompanies.length > 0);

  return (
    <div className="relative">
      <label htmlFor="company" className="block text-sm font-medium mb-2">Company Name</label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="company"
          placeholder="Type company name to search or enter your own..."
          value={companyName}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={() => {
            // Delay hiding to allow click on dropdown items
            setTimeout(() => {
              if (!dropdownRef.current?.contains(document.activeElement)) {
                setIsFocused(false);
                setIsDropdownOpen(false);
              }
            }, 150);
          }}
          required
          className="w-full pr-8"
        />
        <ChevronDown 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform ${
            showDropdown ? 'rotate-180' : ''
          }`}
        />
      </div>
      
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-[100] max-h-80 overflow-y-auto"
        >
          {filteredCompanies.length > 0 ? (
            <div className="py-1">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleCompanyClick(company)}
                  className="px-3 py-3 cursor-pointer hover:bg-accent/80 border-b border-border/50 last:border-b-0 text-foreground transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {company.logo && (
                      <img 
                        src={company.logo} 
                        alt={`${company.name} logo`}
                        className="w-8 h-8 rounded-full object-contain bg-background/50 p-1"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/32x32/7c3aed/ffffff?text=${company.name.charAt(0)}`;
                        }}
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{company.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{company.category.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : companyName.length > 0 ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground bg-background">
              <p>No matching companies found.</p>
              <p className="text-xs mt-1">You can still use "{companyName}" for your review.</p>
            </div>
          ) : (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground bg-background">
              Start typing to search from {filteredCompanies.length}+ companies...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanySelector;
