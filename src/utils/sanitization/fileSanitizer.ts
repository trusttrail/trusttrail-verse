
export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'image/png', 
    'image/jpeg',
    'image/jpg',
    'image/webp'
  ];
  
  // Additional MIME type validation
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
  const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  
  // Check both MIME type and extension for double validation
  const isValidType = allowedTypes.includes(file.type);
  const isValidExtension = allowedExtensions.includes(fileExtension);
  
  // Additional security check for file name
  const hasValidName = !/[<>:"/\\|?*\x00-\x1f]/.test(file.name);
  
  return isValidType && isValidExtension && hasValidName;
};

export const validateFileSize = (file: File, maxSizeInMB: number = 10): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes && file.size > 0; // Ensure file is not empty
};
