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

  replace?: boolean;
};

const ImageUploader = ({ value = [], images = [], onChange, onRemoveExisting, multiple = true, maxFiles = 5, replace = false }: Props) => {
  const [preview, setPreview] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  useEffect(() => {
    const urls = value.filter((file): file is File => file instanceof File).map((file) => URL.createObjectURL(file));

    const activeImages = images.filter((image) => !removedImages.includes(image));

    setPreview([...activeImages, ...urls]);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [value.map((file) => `${file.name}-${file.size}-${file.lastModified}`).join("|"), images.join("|"), removedImages.join("|"), replace]);

  const onDrop = (acceptedFiles: File[]) => {
    let files = acceptedFiles;

    if (!multiple) {
      files = acceptedFiles.slice(0, 1);
    }

    if (replace) {
      onChange(files);
      return;
    }

    const merged = [...value, ...files].slice(0, maxFiles);

    onChange(merged);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,

    multiple,

    maxFiles,

    maxSize: 5 * 1024 * 1024,

    accept: {
      "image/*": [".png", ".jpeg", ".webp"],
    },
  });

  const removeImage = (index: number) => {
    const activeImages = images.filter((image) => !removedImages.includes(image));
    if (index < activeImages.length) {
      const removed = activeImages[index];

      setRemovedImages((prev) => [...prev, removed]);

      onRemoveExisting?.(removed);

      return;
    }
    const fileIndex = index - activeImages.length;

    onChange(value.filter((_, i) => i !== fileIndex));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`cursor-pointer border-2 border-dashed p-10 text-center transition ${
          isDragActive ? "border-orange-500 bg-orange-500/10" : "border-(--border) bg-(--surface-secondary)"
        } `}
      >
        <input {...getInputProps()} />

        <ImagePlus size={40} className="mx-auto mb-4 text-(--foreground-secondary)" />

        <p className="text-(--foreground-secondary)">{isDragActive ? "Upuść zdjęcia tutaj" : "Przeciągnij zdjęcia lub kliknij"}</p>
      </div>

      {preview.length > 0 && (
        <div className="mt-5 grid grid-cols-4 gap-4">
          {preview.map((image, index) => (
            <div key={index} className="relative border border-(--border) bg-(--surface)">
              <img src={image} className="h-32 w-full object-cover" alt="preview" />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 cursor-pointer bg-red-500 p-1 text-white transition hover:bg-red-600"
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
