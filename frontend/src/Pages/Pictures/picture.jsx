// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./picture.css";
// import Navbar from "../../Navbar/Navbar";

// const PictureManager = () => {
//   const [pictures, setPictures] = useState([]);
//   const [newPicture, setNewPicture] = useState({
//     imageName: "",
//     imageTitle: "",
//     category: "",
//   });
//   const [imageFile, setImageFile] = useState(null); // Store the uploaded image file
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation
//   const [pictureToDelete, setPictureToDelete] = useState(null); // Store picture to be deleted

//   // Fetch pictures from the API
//   useEffect(() => {
//     axios
//       .get("/api/picture")
//       .then((response) => {
//         setPictures(response.data);
//       })
//       .catch((error) => console.error("Error fetching pictures:", error));
//   }, []);

// const addPicture = async () => {
//     try {
//       if (!imageFile) {
//         alert("Please select an image file.");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("imageUrl", imageFile); // Correct field name
//       formData.append("imageName", newPicture.imageName);
//       formData.append("imageTitle", newPicture.imageTitle);
//       formData.append("category", newPicture.category);

//       // Send the request to add the picture
//       const response = await axios.post(
//         "/api/picture",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data", // Required for file upload
//           },
//         }
//       );

//       // Fetch the updated pictures from the server
//       const updatedPicturesResponse = await axios.get("/api/picture");

//       // Update the pictures state with the new list of pictures
//       setPictures(updatedPicturesResponse.data);

//       // Clear form fields
//       setNewPicture({ imageName: "", imageTitle: "", category: "" });
//       setImageFile(null); // Clear the file input
//       setShowAddModal(false); // Close the modal
//     } catch (error) {
//       console.error("Error adding picture:", error);
//     }
//   };

//   // Handle picture deletion
//   const deletePicture = (id) => {
//     axios
//       .delete(`/api/picture/${id}`)
//       .then(() => {
//         setPictures(pictures.filter((picture) => picture._id !== id));
//         setShowDeleteModal(false); // Close delete confirmation modal
//         setPictureToDelete(null); // Reset the picture to be deleted
//       })
//       .catch((error) => console.error("Error deleting picture:", error));
//   };

//   // Show delete confirmation modal
//   const confirmDelete = (picture) => {
//     setPictureToDelete(picture); // Store the picture to be deleted
//     setShowDeleteModal(true); // Show the delete confirmation modal
//   };

//   // Close the delete confirmation modal
//   const cancelDelete = () => {
//     setShowDeleteModal(false);
//     setPictureToDelete(null);
//   };

//   return (
//     <>
//     <Navbar/>
//     <div>
//       <h1>Picture Manager</h1>

//       {/* Add New Picture Button */}
//       <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
//         Add New Picture
//       </button>

//       {/* Add Picture Modal */}
//       {showAddModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>Add New Picture</h2>
//             <input
//               type="text"
//               placeholder="Image Name"
//               value={newPicture.imageName}
//               onChange={(e) =>
//                 setNewPicture({ ...newPicture, imageName: e.target.value })
//               }
//             />
//             <input
//               type="text"
//               placeholder="Image Title"
//               value={newPicture.imageTitle}
//               onChange={(e) =>
//                 setNewPicture({ ...newPicture, imageTitle: e.target.value })
//               }
//             />
//             <input
//               type="text"
//               placeholder="Category"
//               value={newPicture.category}
//               onChange={(e) =>
//                 setNewPicture({ ...newPicture, category: e.target.value })
//               }
//             />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setImageFile(e.target.files[0])}
//             />
//             <button className="btn btn-success" onClick={addPicture}>
//               Add Picture
//             </button>
//             <button
//               className="btn btn-secondary"
//               onClick={() => setShowAddModal(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>Are you sure you want to delete this picture?</h2>
//             <div>
//               <button
//                 className="btn btn-danger"
//                 onClick={() => deletePicture(pictureToDelete._id)}
//               >
//                 Yes, Delete
//               </button>
//               <button
//                 className="btn btn-secondary"
//                 onClick={cancelDelete}
//               >
//                 No, Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Display Pictures */}
//       <div className="picture-list">
//         {pictures.map((picture) => (
//           <div key={picture._id} className="picture-card">
//             <img src={picture.imageUrl} alt={picture.imageTitle} width="200" />
//             <p>Name: {picture.imageName}</p>
//             <p>Title: {picture.imageTitle}</p>
//             <p>Category: {picture.category}</p>
//             <button
//               className="btn btn-danger"
//               onClick={() => confirmDelete(picture)}
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//     </>
//   );
// };

// export default PictureManager;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./picture.css";
import Navbar from "../../Navbar/Navbar";

const PictureManager = () => {
  const [pictures, setPictures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [newPicture, setNewPicture] = useState({
    imageName: "",
    imageTitle: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pictureToDelete, setPictureToDelete] = useState(null);

  // Fetch pictures from the API
  useEffect(() => {
    axios
      .get("/api/picture")
      .then((response) => {
        setPictures(response.data);
      })
      .catch((error) => console.error("Error fetching pictures:", error));
  }, []);

  // Add a new picture
  const addPicture = async () => {
    try {
      if (!imageFile) {
        alert("Please select an image file.");
        return;
      }

      const formData = new FormData();
      formData.append("imageUrl", imageFile);
      formData.append("imageName", newPicture.imageName);
      formData.append("imageTitle", newPicture.imageTitle);
      formData.append("category", newPicture.category);

      await axios.post("/api/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refresh the pictures
      const updatedPictures = await axios.get(
        "/api/picture"
      );
      setPictures(updatedPictures.data);

      setNewPicture({ imageName: "", imageTitle: "", category: "" });
      setImageFile(null);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding picture:", error);
    }
  };

  const deletePicture = (id) => {
    axios
      .delete(`/api/picture/${id}`)
      .then(() => {
        setPictures(pictures.filter((picture) => picture._id !== id));
        setShowDeleteModal(false); // Close delete confirmation modal
        setPictureToDelete(null); // Reset the picture to be deleted
      })
      .catch((error) => console.error("Error deleting picture:", error));
  };

  // Show delete confirmation modal
  const confirmDelete = (picture) => {
    setPictureToDelete(picture); // Store the picture to be deleted
    setShowDeleteModal(true); // Show the delete confirmation modal
  };

  // Close the delete confirmation modal
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPictureToDelete(null);
  };

  const filteredPictures = pictures.filter(
    (picture) =>
      (selectedCategory === "All Categories" ||
        picture.category === selectedCategory) &&
      picture.imageTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <button className="add-button show_modal_picture" onClick={() => setShowAddModal(true)}>
        Add New Picture
      </button>
      
      {/* Add Picture Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Picture</h2>
            <input
              type="text"
              placeholder="Image Name"
              value={newPicture.imageName}
              onChange={(e) =>
                setNewPicture({ ...newPicture, imageName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Image Title"
              value={newPicture.imageTitle}
              onChange={(e) =>
                setNewPicture({ ...newPicture, imageTitle: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category"
              value={newPicture.category}
              onChange={(e) =>
                setNewPicture({ ...newPicture, category: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            <button className="btn btn-success" onClick={addPicture}>
              Add Picture
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this picture?</h2>
            <div>
              <button
                className="btn btn-danger"
                onClick={() => deletePicture(pictureToDelete._id)}
              >
                Yes, Delete
              </button>
              <button className="btn btn-secondary" onClick={cancelDelete}>
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="image-gallery-container">
        {/* Header Section */}
        <div className="image-gallery-header">
          <select
            className="category-dropdown"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All Categories">All Categories</option>
            <option value="Category 1">Category 1</option>
            <option value="Category 2">Category 2</option>
          </select>
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Image Grid */}
        <div className="image-grid">
          {filteredPictures.map((picture) => (
            <div key={picture._id} className="image-card">
              <img
                src={picture.imageUrl}
                alt={picture.imageTitle}
                className="image-preview"
              />
              <div className="image-details">
                <div className="w-100">
                  <p className="image-title">{picture.imageTitle}</p>
                  <p className="image-category">{picture.category}</p>
                </div>
                <div>
                  <button
                    className="delete-button button_delete_picture"
                    // onClick={() => deletePicture(picture._id)}
                    onClick={() => confirmDelete(picture)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PictureManager;
