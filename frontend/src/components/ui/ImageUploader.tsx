import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  value?: File[];
  images?: string[];
  onChange: (files: File[]) => void;

  onRemoveExisting?: (image: string) => void;

  multiple?: boolean;
  maxFiles?: number;
  isEdit?: boolean;
};

const ImageUploader = ({
  value = [],
  images = [],
  onChange,
  multiple = true,
  maxFiles = 5,
}: Props) => {
  const [preview, setPreview] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  useEffect(() => {
    const urls = value
      .filter((file) => file instanceof File)
      .map((file) => URL.createObjectURL(file));

    const activeImages = images.filter(
      (image) => !removedImages.includes(image)
    );

    setPreview([...activeImages, ...urls]);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [
    value.map((file) => file.name).join(","),
    images.join(","),
    removedImages.join(","),
  ]);

  const onDrop = (acceptedFiles: File[]) => {
    let files = acceptedFiles;

    if (!multiple) {
      files = acceptedFiles.slice(0, 1);
    }

    const merged = [...value, ...files].slice(0, maxFiles);

    onChange(merged);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles,
    maxSize: 2 * 1024 * 1024,

    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
  });

  const removeImage = (index: number) => {
    if (index < images.length) {
      const removed = images[index];

      setRemovedImages((prev) => [...prev, removed]);

      return;
    }

    const fileIndex = index - images.length;

    onChange(value.filter((_, i) => i !== fileIndex));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          p-10 
          text-center 
          border-2 
          border-dashed 
          cursor-pointer
          border-gray-300

          ${isDragActive ? "border-orange-500 bg-orange-50" : ""}
        `}
      >
        <input {...getInputProps()} />

        <ImagePlus size={40} className="mx-auto mb-4 text-gray-400" />

        <p className="text-gray-500">
          {isDragActive
            ? "Upuść zdjęcia tutaj"
            : "Przeciągnij zdjęcia lub kliknij"}
        </p>
      </div>

      {preview.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-5">
          {preview.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                className="object-cover w-full h-32"
                alt="preview"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className=" top-2 right-2 absolute p-1 text-white bg-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ImageUploader;
