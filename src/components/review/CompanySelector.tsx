
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Company {
  id: number;
  name: string;
  category: string;
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
  openCompanySelect,
  setOpenCompanySelect,
  filteredCompanies,
  handleCompanySearch,
  handleCompanySelect
}: CompanySelectorProps) => {
  return (
    <div>
      <label htmlFor="company" className="block text-sm font-medium mb-2">Company Name</label>
      <Popover open={openCompanySelect} onOpenChange={setOpenCompanySelect}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCompanySelect}
            className="w-full justify-between h-10"
            type="button"
          >
            <span className="truncate text-left">
              {companyName || "Select or type company name..."}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search or type company name..." 
              value={companyName}
              onValueChange={(value) => {
                setCompanyName(value);
                handleCompanySearch(value);
              }}
              className="h-9"
            />
            <CommandEmpty>
              <div className="py-6 text-center text-sm">
                <p>No company found.</p>
                <p className="text-xs text-muted-foreground mt-1">You can still use "{companyName}" for your review.</p>
              </div>
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {filteredCompanies.map((company) => (
                <CommandItem
                  key={company.id}
                  onSelect={() => {
                    handleCompanySelect(company);
                    setOpenCompanySelect(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col w-full">
                    <span className="font-medium">{company.name}</span>
                    <span className="text-xs text-muted-foreground">{company.category}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CompanySelector;
