import { useDropzone } from "react-dropzone";
import { Image, ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
type Image = {
  url: string;
  image: string;
};

type Props = {
  value?: File[];
  images?: any[];
  onChange: (files: File[]) => void;
  onRemoveExisting?: (image: string) => void;
  multiple?: boolean;
  maxFiles?: number;
  replace?: boolean;
};

const ImageUploader = ({ value = [], images = [], onChange, onRemoveExisting, multiple = true, maxFiles = 5, replace = false }: Props) => {
  const [newPhotosPreview, setNewPhotosPreview] = useState<string[]>([]);
  const [preview, setPreview] = useState<string[]>(images.map((el: Image) => el.url));
  [];


  useEffect(() => {
    const urls = value.filter((file): file is File => file instanceof File).map((file) => URL.createObjectURL(file));

    setNewPhotosPreview(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [value.map((file) => `${file.name}-${file.size}-${file.lastModified}`).join("|"), images.join("|"), replace]);


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

  const removeExistingPreview = (index: number) => {
    if (index < preview.length) {
      const removed = preview[index];

      setPreview((prev) => prev.filter((_, i) => i != index));

      onRemoveExisting?.(removed);

      return;
    }
  };

  const removeNewPreview = (index: number) => {

    if (index < newPhotosPreview.length) {
      setNewPhotosPreview((prev) => prev.filter((_, i) => i !== index));

      onChange(value.filter((_, i) => i !== index));
    }
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
                onClick={() => removeExistingPreview(index)}
                className="absolute top-2 right-2 cursor-pointer bg-red-500 p-1 text-white transition hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      {newPhotosPreview.length > 0 && (
        <div className="mt-5 grid grid-cols-4 gap-4">
          {newPhotosPreview.map((image, index) => (
            <div key={index} className="relative border border-(--border) bg-(--surface)">
              <img src={image} className="h-32 w-full object-cover" alt="preview" />

              <button
                type="button"
                onClick={() => removeNewPreview(index)}
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
