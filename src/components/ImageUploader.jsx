import { useState, useEffect } from "react";

// Controlled-ish uploader: parent owns the actual File via onFileSelect,
// this component just handles the local preview rendering.
// initialPreview lets you show an existing image (e.g. current profile pic).
function ImageUploader({ onFileSelect, initialPreview = null, label = "Upload image" }) {
  const [preview, setPreview] = useState(initialPreview);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    onFileSelect(file);
    setPreview(URL.createObjectURL(file));
  };

  // Clean up the object URL when the component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="image-uploader">
      {preview && (
        <img src={preview} alt="Preview" className="image-uploader-preview" />
      )}
      <label className="image-uploader-label">
        {label}
        <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleChange} />
      </label>
    </div>
  );
}

export default ImageUploader;