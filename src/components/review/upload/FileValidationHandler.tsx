
import { validateFileType, validateFileSize } from "@/utils/inputSanitization";

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export class FileValidationHandler {
  private static readonly MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB total
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
  private static readonly MAX_FILES = 5;

  static validateNewFiles(
    newFiles: File[], 
    existingFiles: File[]
  ): FileValidationResult {
    // Security validations for each file
    for (const file of newFiles) {
      // Validate file type
      if (!validateFileType(file)) {
        return {
          isValid: false,
          error: `Invalid file type: ${file.name}. Only PDF, PNG, JPEG, and JPG files are allowed.`
        };
      }

      // Validate individual file size
      if (!validateFileSize(file, 5)) {
        return {
          isValid: false,
          error: `File too large: ${file.name}. Maximum size is 5MB per file.`
        };
      }

      // Additional security checks
      if (file.name.length > 255) {
        return {
          isValid: false,
          error: `Filename too long: ${file.name}. Maximum 255 characters.`
        };
      }

      // Check for suspicious file extensions in filename
      const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
      const hasSuspicious = suspiciousExtensions.some(ext => 
        file.name.toLowerCase().includes(ext)
      );
      
      if (hasSuspicious) {
        return {
          isValid: false,
          error: `Suspicious file detected: ${file.name}. This file type is not allowed.`
        };
      }
    }

    // Check total file count
    const allFiles = [...existingFiles, ...newFiles];
    if (allFiles.length > this.MAX_FILES) {
      return {
        isValid: false,
        error: `Too many files. Maximum ${this.MAX_FILES} files allowed.`
      };
    }

    // Check total size
    const totalSize = allFiles.reduce((total, file) => total + file.size, 0);
    if (totalSize > this.MAX_TOTAL_SIZE) {
      return {
        isValid: false,
        error: `Total file size exceeds ${this.formatFileSize(this.MAX_TOTAL_SIZE)} limit. Current total: ${this.formatFileSize(totalSize)}`
      };
    }

    return { isValid: true };
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static get maxFiles() { return this.MAX_FILES; }
  static get maxTotalSize() { return this.MAX_TOTAL_SIZE; }
}
