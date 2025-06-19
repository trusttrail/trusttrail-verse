
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { FileValidationHandler } from "./upload/FileValidationHandler";
import FileUploadZone from "./upload/FileUploadZone";
import FileList from "./upload/FileList";
import FileErrorDisplay from "./upload/FileErrorDisplay";
import { formatFileSize } from "@/utils/fileUtils";

interface FileUploadProps {
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  fileError: string | null;
  setFileError: (error: string | null) => void;
}

const FileUpload = ({ 
  selectedFiles, 
  setSelectedFiles, 
  fileError, 
  setFileError 
}: FileUploadProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const newFiles = Array.from(e.target.files || []);
    
    if (newFiles.length === 0) return;

    const validation = FileValidationHandler.validateNewFiles(newFiles, selectedFiles);
    
    if (!validation.isValid) {
      setFileError(validation.error!);
      e.target.value = '';
      return;
    }
    
    const allFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(allFiles);
    
    const totalSize = allFiles.reduce((total, file) => total + file.size, 0);
    toast({
      title: "Files Added",
      description: `${newFiles.length} file(s) uploaded successfully. Total: ${formatFileSize(totalSize)}`,
    });

    // Reset input
    e.target.value = '';
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
    setFileError(null);
    
    toast({
      title: "File Removed",
      description: "File has been removed from upload list.",
    });
  };

  return (
    <div>
      <label htmlFor="proof" className="block text-sm font-medium mb-2">
        Proof of Purchase (Required) - Multiple files allowed
      </label>
      
      <FileUploadZone onFileChange={handleFileChange} />

      {fileError && <FileErrorDisplay error={fileError} />}

      <FileList files={selectedFiles} onRemoveFile={removeFile} />
    </div>
  );
};

export default FileUpload;
