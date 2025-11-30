"use client";

import React from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  accept = "image/*",
  maxSize = 5,
  className,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // For now, create a local URL (in production, upload to Cloudinary/S3)
      const imageUrl = URL.createObjectURL(file);
      onChange(imageUrl);

      // TODO: Implement actual upload to Cloudinary/S3
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await api.upload('/upload/image', formData);
      // onChange(response.data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (value) {
      URL.revokeObjectURL(value);
    }
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="block text-sm font-medium text-white">{label}</label>}

      <div className="relative">
        {value ? (
          <div className="relative group">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-secondary border-2 border-secondary">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-2 right-2 p-2 bg-black/80 hover:bg-primary rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className={cn(
              "w-full aspect-video border-2 border-dashed border-secondary rounded-lg",
              "flex flex-col items-center justify-center gap-3",
              "hover:border-primary hover:bg-secondary/30 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <>
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-white text-sm font-medium mb-1">{label}</p>
                  <p className="text-gray-400 text-xs">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Max size: {maxSize}MB
                  </p>
                </div>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-primary text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
