import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TrimMangement.css";
import Navbar from "../../Navbar/Navbar";

const TrimManagement = () => {
  const [trims, setTrims] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    previewImage: null,
  });
  const [editTrimId, setEditTrimId] = useState(null);

  const apiEndpoint = "/api/trim";

  // Fetch trims from API
  useEffect(() => {
    fetchTrims();
  }, []);

  const fetchTrims = async () => {
    try {
      const response = await axios.get(apiEndpoint);
      setTrims(response.data); // Assuming the response contains the trims array
    } catch (error) {
      console.error("Error fetching trims:", error);
    }
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    const method = editTrimId ? "PUT" : "POST";
    const url = editTrimId ? `${apiEndpoint}/${editTrimId}` : apiEndpoint;

    const trimFormData = new FormData();
    trimFormData.append("name", formData.name);
    trimFormData.append("description", formData.description);
    if (formData.previewImage) {
      trimFormData.append("previewImage", formData.previewImage);
    }

    try {
      const response = await axios({
        method,
        url,
        data: trimFormData,
      });

      if (response.status === 200 || response.status === 201) {
        alert(
          editTrimId ? "Trim updated successfully!" : "Trim added successfully!"
        );
        setShowModal(false);
        setFormData({ name: "", description: "", previewImage: null });
        setEditTrimId(null);
        fetchTrims();
      } else {
        alert("Failed to save trim.");
      }
    } catch (error) {
      console.error("Error saving trim:", error);
      alert("An error occurred while saving the trim.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trim?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(`${apiEndpoint}/${id}`);
        if (response.status === 200) {
          alert("Trim deleted successfully!");
          fetchTrims();
        } else {
          alert("Failed to delete trim.");
        }
      } catch (error) {
        console.error("Error deleting trim:", error);
        alert("An error occurred while deleting the trim.");
      }
    }
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "previewImage.png"; // Default filename
    link.click();
  };

  const openModalForEdit = (trim) => {
    setEditTrimId(trim._id);
    setFormData({
      name: trim.name,
      description: trim.description,
      previewImage: null,
    });
    setShowModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="trim-management">
        <button className="add-button" onClick={() => setShowModal(true)}>
          Add Trim
        </button>

        <div className="trim-list">
          {trims.length > 0 ? (
            <table className="trim-table">
              {trims.map((trim) => (
                <tbody key={trim._id}>
                  <tr
                    style={{
                      backgroundColor: "#F3F4F8",
                    }}
                  >
                    <td
                      className="value_style value_style_tile_trim"
                      colSpan="3"
                    >
                      {" "}
                      {trim?.name || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="label_style label_style_trim">
                      Description
                    </td>
                    <td className="value_style" colSpan="3">
                      {" "}
                      {trim.description || "N/A"}
                    </td>
                  </tr>
                  <tr
                    style={{
                      backgroundColor: "#F3F4F8",
                    }}
                  >
                    <td className="label_style label_style_trim">
                      Preview Image
                    </td>
                    <td className="value_style" colSpan="3">
                      <img
                        src={trim.previewImage}
                        alt="Preview"
                        className="preview-image trim_table_img"
                        onClick={() => handleDownload(trim.previewImage)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="value_style" colSpan="3">
                      <button
                        className="action-button edit"
                        onClick={() => openModalForEdit(trim)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDelete(trim._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="action-button download"
                        onClick={() => handleDownload(trim.previewImage)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          ) : (
            <p>No trims available.</p>
          )}
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>{editTrimId ? "Edit Trim" : "Add Trim"}</h3>
              <form onSubmit={handleAddOrEdit}>
                <label>
                  Name:
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  ></textarea>
                </label>
                <label>
                  Preview Image:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        previewImage: e.target.files[0],
                      })
                    }
                  />
                </label>
                <div className="modal-actions">
                  <button type="submit" className="modal-button">
                    Save
                  </button>
                  <button
                    type="button"
                    className="modal-button cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TrimManagement;
