import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  value?: File[];

  onChange: (files: File[]) => void;

  multiple?: boolean;

  maxFiles?: number;
};

const ImageUploader = ({
  value = [],
  onChange,
  multiple = true,
  maxFiles = 5,
}: Props) => {
  const [preview, setPreview] = useState<string[]>([]);

  useEffect(() => {
    const urls = value.map((file) => URL.createObjectURL(file));

    setPreview(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [value]);

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

    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
  });

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
 p-10 text-center border-2 border-dashed cursor-pointer
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
              <img src={image} className="object-cover w-full h-32" />

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
