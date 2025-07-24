
import { useState } from 'react';
import { sampleCompanies, sampleCategories } from '@/data/companyData';

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
  const [gitcoinVerified, setGitcoinVerified] = useState(false);

  // Use the comprehensive company list from our database
  const mockCompanies = sampleCompanies.map(company => ({
    id: company.id,
    name: company.name,
    category: company.category,
    logo: company.logo
  }));

  const mockCategories = sampleCategories.map(cat => ({
    id: cat.id,
    name: cat.name
  }));

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
    if (!value.trim()) {
      setFilteredCompanies(mockCompanies.slice(0, 50)); // Show first 50 companies when no search
      return;
    }

    const filtered = mockCompanies.filter(company =>
      company.name.toLowerCase().includes(value.toLowerCase()) ||
      company.category.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 100); // Limit to 100 results for performance
    
    setFilteredCompanies(filtered);
  };

  const handleCompanySelect = (company: { id: number; name: string; category: string; logo?: string }) => {
    setFormData(prev => ({
      ...prev,
      companyName: company.name,
      category: company.category // This should now match our new category IDs
    }));
  };

  const updateFormData = (field: keyof ReviewFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateFiles = (newFiles: File[]) => {
    setFiles(newFiles);
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
    setGitcoinVerified(false);
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
    gitcoinVerified,
    setGitcoinVerified,
    handleInputChange,
    handleRatingChange,
    handleCategoryChange,
    handleCompanyChange,
    handleCompanySearch,
    handleCompanySelect,
    updateFormData,
    updateFiles,
    resetForm,
  };
};
