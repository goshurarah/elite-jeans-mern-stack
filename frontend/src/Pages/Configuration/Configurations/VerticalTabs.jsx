import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import "./VerticalTabs.css";
import Navbar from "../../../Navbar/Navbar";

const VerticalTabs = () => {
  const [activeTab, setActiveTab] = useState("Vendors");
  const [data, setData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [newName, setNewName] = useState("");

  const apiEndpoints = useMemo(
    () => ({
      Vendors: "/api/vendors",
      Categories: "/api/categories",
      Subcategories: "/api/subcategories",
      ItemTypes: "/api/item-types",
      Colors: "/api/colors",
      SizeScales: "/api/size-scales",
      SizeBreaks: "/api/size-breaks",
      Clients: "/api/clients",
      SalesContracts: "/api/sales-contracts",
    }),
    []
  );

  const fetchData = useCallback(
    async (tab) => {
      try {
        const response = await axios.get(apiEndpoints[tab]);
        setData(response.data);
      } catch (error) {
        console.error(`Error fetching ${tab} data:`, error);
      }
    },
    [apiEndpoints]
  );

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  const handleAddData = async () => {
    try {
      const response = await axios.post(apiEndpoints[activeTab], formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert("Data added successfully!");
        setShowAddModal(false);
        setFormData({ name: "" });
        fetchData(activeTab);
      } else {
        alert("Failed to add data.");
      }
    } catch (error) {
      console.error("Error adding data:", error);
      alert("Failed to add data.");
    }
  };

  const handleUpdateData = async () => {
    if (newName && updateId) {
      try {
        const response = await axios.put(
          `${apiEndpoints[activeTab]}/${updateId}`,
          { name: newName },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          alert("Data updated successfully!");
          setShowUpdateModal(false);
          setNewName(""); 
          fetchData(activeTab);
        } else {
          alert("Failed to update data.");
        }
      } catch (error) {
        console.error("Error updating data:", error);
        alert("Failed to update data.");
      }
    }
  };

  const handleDeleteData = async () => {
    try {
      const response = await axios.delete(
        `${apiEndpoints[activeTab]}/${deleteId}`
      );

      if (response.status === 200) {
        alert("Data deleted successfully!");
        setShowDeleteModal(false);
        fetchData(activeTab);
      } else {
        alert("Failed to delete data.");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Failed to delete data.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="tabs">
          {Object.keys(apiEndpoints).map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="content">
          {data.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <button
                    className="add-button add_button_config"
                    onClick={() => setShowAddModal(true)}
                  >
                    Add {activeTab}
                  </button>

                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>
                        <button
                          className="action-button update"
                          onClick={() => {
                            setUpdateId(item._id);
                            setNewName(item.name); // Initialize newName with current value
                            setShowUpdateModal(true);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="action-button delete"
                          onClick={() => {
                            setDeleteId(item._id);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No data available.</p>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add {activeTab}</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddData();
                }}
              >
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
                <div className="modal-actions">
                  <button type="submit" className="modal-button">
                    Add
                  </button>
                  <button
                    type="button"
                    className="modal-button cancel"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {showUpdateModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Update {activeTab}</h3>
              <label>
                New Name:
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </label>
              <div className="modal-actions">
                <button onClick={handleUpdateData} className="modal-button">
                  Update
                </button>
                <button
                  type="button"
                  className="modal-button cancel"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Are you sure you want to delete this {activeTab}?</h3>
              <div className="modal-actions">
                <button
                  onClick={handleDeleteData}
                  className="modal-button delete"
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  className="modal-button cancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  No, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VerticalTabs;
