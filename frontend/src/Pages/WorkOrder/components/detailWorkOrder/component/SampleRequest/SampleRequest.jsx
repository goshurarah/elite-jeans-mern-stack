import React, { useState, useEffect } from "react";
import axios from "axios";
import SampleRequestModal from "../../../../../TechPack/Modals/WorkOrder/SampleRequest/SampleRequestModal";
import "./SampleRequest.css"
const SampleRequestList = (techPackId) => {
  // console.log("last",techPackId);
  const [sampleRequests, setSampleRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const workOrder_Id = techPackId.techPackId;

  // Fetch sample requests
  const fetchSampleRequests = async () => {
    try {
      const response = await axios.post(
        `/api/work-orders/sample-requests-by-work-orders`,
        {id:workOrder_Id}
        // '677e6a4455c3e9c1c90a1be8'
      );
      setSampleRequests(response.data.data);
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
    const isConfirmed = window.confirm("Are you sure you want to delete this sample request?");
  
    if (isConfirmed) {
      try {
        await axios.delete(`/api/sample-requests/${id}`);
        fetchSampleRequests(); // Refresh the list
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
          `/api/work-orders/create-sample-request/${currentRequest._id}`,
          submissionData
        );
      } else {
        // Add new request
        await axios.post(
          "/api/work-orders/create-sample-request",
          submissionData
        );
      }
      fetchSampleRequests(); // Refresh the list
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error submitting form data", error);
    }
  };

  useEffect(() => {
    fetchSampleRequests();
  }, []);

  return (
    <div className="container">
      <div className="table-container_sample">
        <div className="table-header_sample">
          <h5>Sample Request</h5>
          <button className="add-button_sample_css" onClick={handleAddClick}>
            + Add
          </button>
        </div>
        <table className="custom-table_sample">
          <thead>
            <tr>
              <th>Style #</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Sample Type</th>
              <th>Due Date</th>
              <th>Comments</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sampleRequests &&
              sampleRequests?.map((request) => (
                <tr key={request._id}>
                  <td>{request.styleNumber}</td>
                  <td>{request.size}</td>
                  <td>{request.quantity}</td>
                  <td>{request.sampleType}</td>
                  <td>{request.dueDate}</td>
                  <td>{request.comments}</td>
                  <td>{request.status}</td>
                  <td>
                    <button onClick={() => handleEditClick(request)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(request._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <SampleRequestModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          request={currentRequest}
        />
      )}
    </div>
  );
};

export default SampleRequestList;
