import React, { useState, useEffect } from "react";
import axios from "axios";
import "./sampleRequest.css";
import SampleRequestModal from "./SampleRequestModal";

const SampleRequestList = (techPackId) => {
  const [sampleRequests, setSampleRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const techpackId = techPackId.techPackId;
  // Fetch sample requests
  const fetchSampleRequests = async () => {
    try {
      const response = await axios.get(
        `/api/sample-requests`,
        techpackId
      );
      setSampleRequests(response.data);
    } catch (error) {
      console.error("Error fetching sample requests", error);
    }
  };

  // Handle Add button click
  const handleAddClick = () => {
    setCurrentRequest(null); // Clear current request for adding new
    setIsModalOpen(true);
  };

  // Handle Edit button click
  const handleEditClick = (request) => {
    setCurrentRequest(request); // Set request for editing
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`/api/sample-requests/${id}`);
      fetchSampleRequests(); // Refresh the list
    } catch (error) {
      console.error("Error deleting sample request", error);
    }
  };

  // Submit form data
  const handleFormSubmit = async (data) => {
    try {
      const submissionData = {
        ...data,
        techpackId,
      };

      if (currentRequest) {
        // Update request
        await axios.put(
          `/api/sample-requests/${currentRequest._id}`,
          submissionData
        );
      } else {
        // Add new request
        await axios.post(
          "/api/sample-requests",
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
          <button className="add-button_sample" onClick={handleAddClick}>
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
            {sampleRequests.map((request) => (
              <tr key={request._id}>
                <td>{request.styleNumber}</td>
                <td>{request.size}</td>
                <td>{request.quantity}</td>
                <td>{request.sampleType}</td>
                <td>{request.dueDate}</td>
                <td>{request.comments}</td>
                <td>{request.status}</td>
                <td>
                  <button onClick={() => handleEditClick(request)}>Edit</button>
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
