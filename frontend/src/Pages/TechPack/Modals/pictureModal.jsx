import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

const PictureModal = ({ isOpen, closeModal, onSubmit, techPackData }) => {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "/api/picture/cat_name"
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
      const response = await axios.get(
        `/api/picture/${category}`
      );
      const imageUrls = response.data.picture.map((item) => item); // Ensure `picture` exists
      setImages(imageUrls || []);
    } catch (err) {
      console.error("Error fetching images for category:", err);
      setError("Failed to fetch images.");
    }
  };
  const handleImageSelection = (imageId) => {
    setSelectedImages([imageId]); 
  };
  
  // const handleImageSelection = (imageId) => {
  //   setSelectedImages((prev) => {
  //     const updatedImages = prev.includes(imageId)
  //       ? prev.filter((id) => id !== imageId)
  //       : [...prev, imageId];
  //     console.log("Updated selected images:", updatedImages); // Debugging
  //     return updatedImages;
  //   });
  // };

  const handleSubmit = () => {
    if (selectedImages.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    // Debugging: Log selected images

    const payload = {
      pictures: selectedImages, // Ensure this contains selected image IDs
    };

    // Debugging: Log payload

    onSubmit(payload); // Pass payload to parent or API
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
        <h2>Category Images</h2>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
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
                        checked={selectedImages.includes(image._id)} // Ensure `_id` exists
                        onChange={() => handleImageSelection(image._id)}
                      />
                      <img
                        src={image.imageUrl}
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

export default PictureModal;
