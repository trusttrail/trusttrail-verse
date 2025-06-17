
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { formatFileSize } from "@/utils/fileUtils";
import { FileValidationHandler } from "./FileValidationHandler";
import FileIcon from "./FileIcon";

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

const FileList = ({ files, onRemoveFile }: FileListProps) => {
  if (files.length === 0) return null;

  const totalSize = files.reduce((total, file) => total + file.size, 0);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">
          Uploaded Files ({files.length}/{FileValidationHandler.maxFiles})
        </p>
        <p className="text-sm text-muted-foreground">
          Total: {formatFileSize(totalSize)} / {FileValidationHandler.formatFileSize(FileValidationHandler.maxTotalSize)}
        </p>
      </div>
      
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
            <div className="flex items-center space-x-2 flex-1">
              <FileIcon fileType={file.type} />
              <span className="text-sm truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({formatFileSize(file.size)})
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(index)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
