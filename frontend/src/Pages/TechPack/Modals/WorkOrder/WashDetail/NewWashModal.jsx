import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NewWashModal.css";

const NewWashModal = ({
  show,
  closeModal,
  onSubmit,
  techPackId,
  styleDetail,
  selectedCard,
}) => {
  const SelectedId2 = selectedCard?.id;
  const styleDetail1 = styleDetail?._id;

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "/api/picture/cat_name"
        );
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const fetchImages = async () => {
        try {
          const response = await axios.get(
            `/api/picture/${selectedCategory}`
          );
          setImages(response.data.picture || []);
        } catch (err) {
          console.error("Error fetching images:", err);
        }
      };

      fetchImages();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCard) {
      setSelectedCategory(selectedCard.detail_category || "");
      setSelectedImage(selectedCard.imageUrl || null);
      setComments(selectedCard.comments || "");
      setNotes("");
    } else {
      setSelectedCategory("");
      setSelectedImage(null);
      setComments("");
      setNotes("");
    }
  }, [selectedCard]);

  const handleCategoryChange = async (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedImage(null);
  };

  const handleImageSelection = (imageId) => {
    setSelectedImage(imageId);
  };

  const handleSubmit = () => {
    if (!selectedImage) {
      alert("Please select an image.");
      return;
    }

    const payload = {
      pic: selectedImage,
      detail_category: selectedCategory,
      workOrder_Id: techPackId,
      comments: comments,
      notes: notes,
      wash_detail_id: styleDetail1,
      id: SelectedId2,
    };
    onSubmit(payload);
    closeModal();
  };

  return (
    <div className={`modal-overlay ${show ? "show" : ""}`} onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{selectedCard ? "Edit Category Images" : "New Detail Images"}</h2>

        {/* Category selection */}
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
                        type="radio"
                        name="image" // Radio button name for single selection
                        checked={selectedImage === image._id}
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

        {/* Comments and Notes */}
        <div className="form-group">
          <label htmlFor="comments">Comments:</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Enter comments..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter additional notes..."
          />
        </div>

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
    </div>
  );
};

// Styles for image item
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

export default NewWashModal;
