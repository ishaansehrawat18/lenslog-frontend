import { useState, useEffect, useRef } from "react";
import { UploadCloud, ImageOff } from "lucide-react";

function ImageUploader({ onFileSelect, initialPreview = null, label = "Upload image" }) {
  const [preview, setPreview] = useState(initialPreview);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    onFileSelect(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
        dragActive ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
      } ${preview ? "aspect-square" : "aspect-video"}`}
    >
      {preview ? (
        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 py-10 text-gray-400">
          <UploadCloud size={32} strokeWidth={1.5} />
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs">Drag & drop or click to browse</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

export default ImageUploader;