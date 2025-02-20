import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

const TrimModal = ({ isOpen, closeModal, onSubmit, techPackData }) => {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "/api/trim/getnames"
        );
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = async (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedImages([]); // Clear previously selected images
    try {
      // Corrected the URL to include the category as a query parameter
      const response = await axios.get(
        `/api/trim/names?name=${category}`
      );
      console.error(
        "Error fetching categorieszzzzzzzzzzzzzzzzzzz:",
        response.data.trims
      );
      setImages(response.data.trims || []); // Ensure fallback for empty response
    } catch (err) {
      console.error("Error fetching images for category:", err);
      setError("Failed to fetch images.");
    }
  };

  // const handleImageSelection = (imageId) => {
  //   setSelectedImages((prev) =>
  //     prev.includes(imageId)
  //       ? prev.filter((id) => id !== imageId)
  //       : [...prev, imageId]
  //   );
  // };
  const handleImageSelection = (imageId) => {
    setSelectedImages((prev) => {
      const updatedImages = prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId];
      return updatedImages;
    });
  };

  const handleSubmit = () => {
    if (selectedImages.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    const payload = {
      trim_id: selectedImages,
    };

    onSubmit(payload);
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      style={modalStyles}
    >
      <div className="modal-content">
        <h2>Trim and Label Image</h2>
        <div className="form-group">
          <label htmlFor="category">Trim:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select a Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div className="images-gallery">
            <h3>Images for {selectedCategory}</h3>
            <div className="images">
              {images.length > 0 ? (
                images.map((image, index) => (
                  <div
                    key={index}
                    className="image-item"
                    style={imageItemStyle}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image._id)}
                        onChange={() => handleImageSelection(image._id)}
                      />
                      <img
                        src={image.previewImage}
                        alt={`image-${index}`}
                        style={imageStyle}
                      />
                    </label>
                  </div>
                ))
              ) : (
                <p>No images available for this category.</p>
              )}
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="modal-actions">
          <button type="button" className="cancel-button" onClick={closeModal}>
            Close
          </button>
          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1000,
  },
  content: {
    width: "50%",
    margin: "auto",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    maxHeight: "80vh",
    overflowY: "auto",
  },
};

const imageItemStyle = {
  margin: "10px",
  display: "inline-block",
  textAlign: "center",
};

const imageStyle = {
  maxWidth: "150px",
  maxHeight: "150px",
  objectFit: "cover",
  display: "block",
};

export default TrimModal;
