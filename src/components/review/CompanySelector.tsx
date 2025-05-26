
import React from 'react';
import { Input } from "@/components/ui/input";

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
  setCompanyName
}: CompanySelectorProps) => {
  return (
    <div>
      <label htmlFor="company" className="block text-sm font-medium mb-2">Company Name</label>
      <Input
        id="company"
        placeholder="Enter company name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
        className="w-full"
      />
    </div>
  );
};

export default CompanySelector;
