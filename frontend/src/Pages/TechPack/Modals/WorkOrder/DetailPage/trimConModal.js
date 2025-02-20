import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

const TrimConModal = ({ isOpen, closeModal, onSubmit, techPackData }) => {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState(null);

  // Additional form state
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");

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
      const imageUrls = response.data.picture.map((item) => item);
      setImages(imageUrls || []);
    } catch (err) {
      console.error("Error fetching images for category:", err);
      setError("Failed to fetch images.");
    }
  };

  const handleImageSelection = (imageId) => {
    setSelectedImages([imageId]);
  };

  const handleSubmit = () => {
    if (selectedImages.length === 0) {
      alert("Please select at least one image.");
      return;
    }
  
    // Constructing rivetImages array with required properties
    const rivetImages = selectedImages.map((imageId) => ({
      image: imageId,  // Use the imageId from selectedImages
      color: color,
      size: size,
      quantity: quantity,
      comment: comment,
    }));
  
    // Construct the full payload
    const payload = {
        trimImages: rivetImages,
    };
  
    // Log payload for debugging
  
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
        <h2>Rivet Images</h2>
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
                        checked={selectedImages.includes(image._id)}
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

        <div className="form-group">
          <label htmlFor="color">Color:</label>
          <input
            type="text"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="size">Size:</label>
          <input
            type="text"
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

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

export default TrimConModal;
