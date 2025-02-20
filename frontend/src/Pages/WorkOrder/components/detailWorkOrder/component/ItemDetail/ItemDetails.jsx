import React, { useState, useEffect } from "react";
import "./ItemDetails.css";
import axios from "axios";
import ItemDetailModal from "../../../../../TechPack/Modals/WorkOrder/DetailPage/ItemDetail/ItemDetailModal";
import "./ItemDetails.css"
function ItemDetails({ techPackId }) {
  const [itemDetail, setItemDetail] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const workOrder_Id = techPackId;
  // Fetch fetchItemDetails
  const fetchItemDetails = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/api/work-orders/item-detail-by-work-orders`,
        { workOrder_Id: workOrder_Id }
      );
      setItemDetail(response.data.data);
    } catch (error) {
      console.error("Error fetching sample requests", error);
    }
  };
  // Handle Add button click
  const handleAddClick = () => {
    setCurrentRequest(null); // Clear current request for adding new
    setIsModalOpen(true);
  };
  // { workOrder_Id: '677e6a4455c3e9c1c90a1be8' }
  // Handle Edit button click
  const handleEditClick = (request) => {
    setCurrentRequest(request); // Set request for editing
    setIsModalOpen(true);
  };
  // Handle Delete
  const handleDeleteClick = async (id) => {
    // Show confirmation dialog before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this sample request?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/work-orders/item-detail/${id}`);
        fetchItemDetails()
      } catch (error) {
        console.error("Error deleting sample request", error);
      }
    } else {
      console.log("Delete action was canceled.");
    }
  };
  // Submit form data
  const handleFormSubmit = async (data) => {
    try {
      const submissionData = {
        ...data,
        workOrder_Id,
      };
      if (currentRequest) {
        // Update request
        await axios.put(
          `http://localhost:5000/api/work-orders/item-detail/${currentRequest._id}`,
          submissionData
        );
      } else {
        // Add new request
        await axios.post(
          "http://localhost:5000/api/work-orders/item-detail/create",
          submissionData
        );
        
      }
      setIsModalOpen(false); // Close the modal
      fetchItemDetails()
    } catch (error) {
      console.error("Error submitting form data", error);
    }
  };
  useEffect(() => {
    fetchItemDetails()
  }, []);
  return (
    <div>
      <div className="item-details-container">
        <div className="top_item_detail">
          <span>Item Details</span>
          <span>
            {" "}
            <button className="add-button_sample_css" onClick={handleAddClick}>
              + Add
            </button>
          </span>
        </div>
        <table className="item-details-table">
          <thead>
            <tr>
              <th>Style #</th>
              <th>Size</th>
              <th>Size Scale</th>
              <th>Size Breakdown</th>
              <th>Packaging Instructions</th>
              <th>Quantity</th>
              <th>Comments / Alterations</th>
              <th>Internal Comments</th>
              <th>Client Name</th>
              <th>Customer PO #</th>
              <th>Special Handling</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {itemDetail &&
              itemDetail?.map((request) => (
                <tr key={request._id}>
                  <td>{request._id}</td>
                  <td></td>
                  <td>{request.size_scale || ''}</td>
                  <td>{request.size_break || ''}</td>
                  <td></td>
                  <td>{request.quantity || ''}</td>
                  <td>{request.comments || ''}</td>
                  <td>{request.internal_comments || ''}</td>
                  <td>{request.client_Id?.name || ''}</td>
                  <td>{request.customer_po_number || ''}</td>
                  <td></td>
                  <td>
                    <div className="action-button-container">
                      <button className="edit-button">
                        <i className="fas fa-edit" onClick={() => handleEditClick(request)}></i>
                      </button>
                      <button className="delete-button">
                        <i className="fas fa-trash" onClick={() => handleDeleteClick(request._id)}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <ItemDetailModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          request={currentRequest}
        />
      )}
    </div>
  );
}
export default ItemDetails;