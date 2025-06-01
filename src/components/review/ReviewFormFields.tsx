
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRating from "./StarRating";
import CategorySelector from "./CategorySelector";
import CompanySelector from "./CompanySelector";
import FileUpload from "./FileUpload";
import { ReviewFormData } from '@/hooks/useReviewForm';

interface ReviewFormFieldsProps {
  formData: ReviewFormData;
  files: File[];
  setFiles: (files: File[]) => void;
  fileError: string | null;
  setFileError: (error: string | null) => void;
  openCompanySelect: boolean;
  setOpenCompanySelect: (open: boolean) => void;
  mockCategories: Array<{ id: string; name: string }>;
  filteredCompanies: Array<{ id: number; name: string; category: string }>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRatingChange: (rating: number) => void;
  handleCategoryChange: (category: string) => void;
  handleCompanyChange: (company: string) => void;
  handleCompanySearch: (value: string) => void;
  handleCompanySelect: (company: { id: number; name: string; category: string }) => void;
}

const ReviewFormFields = ({
  formData,
  files,
  setFiles,
  fileError,
  setFileError,
  openCompanySelect,
  setOpenCompanySelect,
  mockCategories,
  filteredCompanies,
  handleInputChange,
  handleRatingChange,
  handleCategoryChange,
  handleCompanyChange,
  handleCompanySearch,
  handleCompanySelect,
}: ReviewFormFieldsProps) => {
  return (
    <>
      {/* Company Selection */}
      <div className="space-y-2">
        <Label htmlFor="company">Company/Project *</Label>
        <CompanySelector
          companyName={formData.companyName}
          setCompanyName={handleCompanyChange}
          setCategory={handleCategoryChange}
          openCompanySelect={openCompanySelect}
          setOpenCompanySelect={setOpenCompanySelect}
          filteredCompanies={filteredCompanies}
          handleCompanySearch={handleCompanySearch}
          handleCompanySelect={handleCompanySelect}
        />
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <CategorySelector
          category={formData.category}
          setCategory={handleCategoryChange}
          categories={mockCategories}
        />
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label>Overall Rating *</Label>
        <StarRating
          rating={formData.rating}
          setRating={handleRatingChange}
        />
      </div>

      {/* Review Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Review Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Summarize your experience in one line"
          required
        />
      </div>

      {/* Review Content */}
      <div className="space-y-2">
        <Label htmlFor="review">Your Review *</Label>
        <Textarea
          id="review"
          name="review"
          value={formData.review}
          onChange={handleInputChange}
          placeholder="Share your detailed experience..."
          className="min-h-[120px]"
          required
        />
      </div>

      {/* Pros */}
      <div className="space-y-2">
        <Label htmlFor="pros">What did you like? (Optional)</Label>
        <Textarea
          id="pros"
          name="pros"
          value={formData.pros}
          onChange={handleInputChange}
          placeholder="List the positive aspects..."
          className="min-h-[80px]"
        />
      </div>

      {/* Cons */}
      <div className="space-y-2">
        <Label htmlFor="cons">What could be improved? (Optional)</Label>
        <Textarea
          id="cons"
          name="cons"
          value={formData.cons}
          onChange={handleInputChange}
          placeholder="List areas for improvement..."
          className="min-h-[80px]"
        />
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Supporting Documents (Optional)</Label>
        <FileUpload
          selectedFiles={files}
          setSelectedFiles={setFiles}
          fileError={fileError}
          setFileError={setFileError}
        />
        {files.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {files.length} file(s) selected
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewFormFields;
