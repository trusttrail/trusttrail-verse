
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRating from "./StarRating";
import CategorySelector from "./CategorySelector";
import CompanySelector from "./CompanySelector";
import FileUpload from "./FileUpload";
import { ReviewFormData } from '@/hooks/useReviewForm';

interface ReviewFormContentProps {
  formData: ReviewFormData;
  files: File[];
  setFiles: (files: File[]) => void;
  fileError: string | null;
  setFileError: (error: string | null) => void;
  openCompanySelect: boolean;
  setOpenCompanySelect: (open: boolean) => void;
  filteredCompanies: Array<{ id: number; name: string; category: string }>;
  categories: Array<{ id: string; name: string; icon?: string }>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRatingChange: (rating: number) => void;
  handleCategoryChange: (category: string) => void;
  handleCompanyChange: (company: string) => void;
  handleCompanySearch: (value: string) => void;
  handleCompanySelect: (company: { id: number; name: string; category: string }) => void;
}

const ReviewFormContent = ({
  formData,
  files,
  setFiles,
  fileError,
  setFileError,
  openCompanySelect,
  setOpenCompanySelect,
  filteredCompanies,
  categories,
  handleInputChange,
  handleRatingChange,
  handleCategoryChange,
  handleCompanyChange,
  handleCompanySearch,
  handleCompanySelect,
}: ReviewFormContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <CategorySelector
              category={formData.category}
              setCategory={handleCategoryChange}
              categories={categories.map(cat => ({ id: cat.id, name: cat.name }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Review Title *</Label>
          <Input
            id="title"
            name="title"
            placeholder="Summarize your experience in a few words"
            value={formData.title}
            onChange={handleInputChange}
            className="text-sm sm:text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating *</Label>
          <StarRating
            rating={formData.rating}
            setRating={handleRatingChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Review Content *</Label>
          <Textarea
            id="review"
            name="review"
            placeholder="Share your detailed experience, what went well, what could be improved..."
            value={formData.review}
            onChange={handleInputChange}
            className="min-h-[120px] text-sm sm:text-base"
          />
        </div>

        <div className="space-y-2">
          <Label>Supporting Documents (Required for Blockchain Submission)</Label>
          <FileUpload
            selectedFiles={files}
            setSelectedFiles={setFiles}
            fileError={fileError}
            setFileError={setFileError}
          />
          <p className="text-xs text-muted-foreground">
            Upload proof documents to support your review. This will be stored on IPFS and linked to your blockchain transaction.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewFormContent;
