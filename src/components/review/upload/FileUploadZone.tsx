
import React from 'react';
import { Upload } from "lucide-react";
import { FileValidationHandler } from "./FileValidationHandler";

interface FileUploadZoneProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadZone = ({ onFileChange }: FileUploadZoneProps) => {
  return (
    <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300 hover:border-trustpurple-500 transition-colors">
      <input
        type="file"
        id="proof"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={onFileChange}
        multiple
      />
      <label htmlFor="proof" className="cursor-pointer">
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-trustpurple-400 mb-2" />
          <span className="font-medium mb-1">
            Click to upload files
          </span>
          <span className="text-sm text-muted-foreground">
            PDF, PNG, JPG or JPEG (Max: {FileValidationHandler.maxFiles} files, 5MB each, {FileValidationHandler.formatFileSize(FileValidationHandler.maxTotalSize)} total)
          </span>
        </div>
      </label>
    </div>
  );
};

export default FileUploadZone;
