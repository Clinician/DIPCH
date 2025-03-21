import React from "react";

interface Base64ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const Base64Image: React.FC<Base64ImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
}) => {
  // Check if the src is already a data URL
  const isDataUrl = src.startsWith("data:");

  // If it's not a data URL, assume it's a base64 string and convert it
  const imgSrc = isDataUrl ? src : `data:image/png;base64,${src}`;

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  );
};

export default Base64Image;
