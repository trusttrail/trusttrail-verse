
import React from 'react';
import { Image, FileText } from "lucide-react";

interface FileIconProps {
  fileType: string;
}

const FileIcon = ({ fileType }: FileIconProps) => {
  if (fileType.startsWith('image/')) {
    return <Image className="h-4 w-4 text-blue-500" />;
  }
  return <FileText className="h-4 w-4 text-red-500" />;
};

export default FileIcon;
