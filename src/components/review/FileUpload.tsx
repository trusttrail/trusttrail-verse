
import React from 'react';
import { Upload, X, FileText, Image, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { validateFileType, validateFileSize } from "@/utils/inputSanitization";

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
  const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB total
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
  const MAX_FILES = 5;

  const calculateTotalSize = (files: File[]) => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const newFiles = Array.from(e.target.files || []);
    
    if (newFiles.length === 0) return;

    // Security validations
    for (const file of newFiles) {
      // Validate file type
      if (!validateFileType(file)) {
        setFileError(`Invalid file type: ${file.name}. Only PDF, PNG, JPEG, and JPG files are allowed.`);
        e.target.value = '';
        return;
      }

      // Validate individual file size
      if (!validateFileSize(file, 5)) {
        setFileError(`File too large: ${file.name}. Maximum size is 5MB per file.`);
        e.target.value = '';
        return;
      }

      // Additional security checks
      if (file.name.length > 255) {
        setFileError(`Filename too long: ${file.name}. Maximum 255 characters.`);
        e.target.value = '';
        return;
      }

      // Check for suspicious file extensions in filename
      const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
      const hassuspicious = suspiciousExtensions.some(ext => 
        file.name.toLowerCase().includes(ext)
      );
      
      if (hassuspicious) {
        setFileError(`Suspicious file detected: ${file.name}. This file type is not allowed.`);
        e.target.value = '';
        return;
      }
    }

    // Check total file count
    const allFiles = [...selectedFiles, ...newFiles];
    if (allFiles.length > MAX_FILES) {
      setFileError(`Too many files. Maximum ${MAX_FILES} files allowed.`);
      e.target.value = '';
      return;
    }

    // Check total size
    const totalSize = calculateTotalSize(allFiles);
    if (totalSize > MAX_TOTAL_SIZE) {
      setFileError(`Total file size exceeds ${formatFileSize(MAX_TOTAL_SIZE)} limit. Current total: ${formatFileSize(totalSize)}`);
      e.target.value = '';
      return;
    }
    
    setSelectedFiles(allFiles);
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-red-500" />;
  };

  const totalSize = calculateTotalSize(selectedFiles);

  return (
    <div>
      <label htmlFor="proof" className="block text-sm font-medium mb-2">
        Proof of Purchase (Required) - Multiple files allowed
      </label>
      
      <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300 hover:border-trustpurple-500 transition-colors">
        <input
          type="file"
          id="proof"
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
        <label htmlFor="proof" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-trustpurple-400 mb-2" />
            <span className="font-medium mb-1">
              Click to upload files
            </span>
            <span className="text-sm text-muted-foreground">
              PDF, PNG, JPG or JPEG (Max: {MAX_FILES} files, 5MB each, {formatFileSize(MAX_TOTAL_SIZE)} total)
            </span>
          </div>
        </label>
      </div>

      {fileError && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{fileError}</p>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">
              Uploaded Files ({selectedFiles.length}/{MAX_FILES})
            </p>
            <p className="text-sm text-muted-foreground">
              Total: {formatFileSize(totalSize)} / {formatFileSize(MAX_TOTAL_SIZE)}
            </p>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <div className="flex items-center space-x-2 flex-1">
                  {getFileIcon(file.type)}
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
