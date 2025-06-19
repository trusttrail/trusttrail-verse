
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip, Download } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface Attachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  url?: string;
}

interface ReviewCardAttachmentsProps {
  attachments?: Attachment[];
}

const ReviewCardAttachments = ({ attachments }: ReviewCardAttachmentsProps) => {
  const [showAttachments, setShowAttachments] = useState(false);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownloadAttachment = (attachment: Attachment) => {
    if (attachment.url) {
      window.open(attachment.url, '_blank');
    } else {
      toast({
        title: "Download Unavailable",
        description: "This file is not available for download.",
        variant: "destructive",
      });
    }
  };

  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowAttachments(!showAttachments)}
        className="flex items-center gap-1 mb-2"
      >
        <Paperclip size={14} />
        <span>Attachments ({attachments.length})</span>
      </Button>
      
      {showAttachments && (
        <div className="bg-muted/30 rounded-lg p-3 space-y-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center justify-between bg-background rounded p-2">
              <div className="flex items-center gap-2 flex-1">
                <Paperclip size={12} className="text-muted-foreground" />
                <span className="text-sm truncate">{attachment.filename}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatFileSize(attachment.fileSize)})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownloadAttachment(attachment)}
                className="h-6 w-6 p-0"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCardAttachments;
