
import React from 'react';
import { AlertTriangle } from "lucide-react";

interface FileErrorDisplayProps {
  error: string;
}

const FileErrorDisplay = ({ error }: FileErrorDisplayProps) => {
  return (
    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
      <p className="text-red-700 text-sm">{error}</p>
    </div>
  );
};

export default FileErrorDisplay;
