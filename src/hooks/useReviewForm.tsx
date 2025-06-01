
import { useState } from 'react';

export interface ReviewFormData {
  companyName: string;
  category: string;
  rating: number;
  title: string;
  review: string;
  pros: string;
  cons: string;
}

export const useReviewForm = () => {
  const [formData, setFormData] = useState<ReviewFormData>({
    companyName: '',
    category: '',
    rating: 0,
    title: '',
    review: '',
    pros: '',
    cons: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [openCompanySelect, setOpenCompanySelect] = useState(false);

  // Mock data for company search
  const mockCompanies = [
    { id: 1, name: "QuickSwap", category: "DeFi" },
    { id: 2, name: "OpenSea", category: "NFT" },
    { id: 3, name: "Uniswap", category: "DeFi" },
    { id: 4, name: "Axie Infinity", category: "Gaming" }
  ];

  const mockCategories = [
    { id: "defi", name: "DeFi" },
    { id: "nft", name: "NFT Marketplaces" },
    { id: "gaming", name: "Gaming" },
    { id: "dao", name: "DAOs" }
  ];

  const [filteredCompanies, setFilteredCompanies] = useState(mockCompanies);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  };

  const handleCompanyChange = (company: string) => {
    setFormData(prev => ({
      ...prev,
      companyName: company
    }));
  };

  const handleCompanySearch = (value: string) => {
    const filtered = mockCompanies.filter(company =>
      company.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  const handleCompanySelect = (company: { id: number; name: string; category: string }) => {
    setFormData(prev => ({
      ...prev,
      companyName: company.name,
      category: company.category
    }));
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      category: '',
      rating: 0,
      title: '',
      review: '',
      pros: '',
      cons: '',
    });
    setFiles([]);
  };

  return {
    formData,
    files,
    setFiles,
    fileError,
    setFileError,
    openCompanySelect,
    setOpenCompanySelect,
    mockCompanies,
    mockCategories,
    filteredCompanies,
    handleInputChange,
    handleRatingChange,
    handleCategoryChange,
    handleCompanyChange,
    handleCompanySearch,
    handleCompanySelect,
    resetForm,
  };
};
