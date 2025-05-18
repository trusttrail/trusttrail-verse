
import React from 'react';
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  fileError: string | null;
  setFileError: (error: string | null) => void;
}

const FileUpload = ({ 
  selectedFile, 
  setSelectedFile, 
  fileError, 
  setFileError 
}: FileUploadProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    
    if (file) {
      // Check file type
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setFileError('Invalid file format. Please upload PDF, PNG, JPEG, or JPG files only.');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  return (
    <div>
      <label htmlFor="proof" className="block text-sm font-medium mb-2">
        Proof of Purchase (Required)
      </label>
      <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300 hover:border-trustpurple-500 transition-colors">
        <input
          type="file"
          id="proof"
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="proof" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-trustpurple-400 mb-2" />
            <span className="font-medium mb-1">
              {selectedFile ? selectedFile.name : "Click to upload file"}
            </span>
            <span className="text-sm text-muted-foreground">
              PDF, PNG, JPG or JPEG (max. 5MB)
            </span>
          </div>
        </label>
      </div>
      {fileError && (
        <p className="text-destructive text-sm mt-2">{fileError}</p>
      )}
      {selectedFile && (
        <p className="text-green-600 text-sm mt-2">
          File uploaded: {selectedFile.name}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
