import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";

const PointOfMeasure = () => {
  const [data, setData] = useState([]); // List of Point of Measure
  const [selectedData, setSelectedData] = useState([]); // List of selected records
  const [showModal, setShowModal] = useState(false); // To show/hide the modal
  const [search, setSearch] = useState(""); // Search query
  const [formData, setFormData] = useState({ code: "", description: "", tolerance: "" });
  const [editId, setEditId] = useState(null);
  const [pomLibrary, setPomLibrary] = useState([]); // POM Library data
  const [checkedRecords, setCheckedRecords] = useState([]); // Records selected in modal

  const apiBaseURL = "/api/point-of-measure";

  // Fetch all records
  const fetchData = async () => {
    try {
      const response = await axios.get(apiBaseURL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch POM Library records
  const fetchPomLibrary = async () => {
    try {
      const response = await axios.get(apiBaseURL);
      setPomLibrary(response.data);
    } catch (error) {
      console.error("Error fetching POM Library:", error);
    }
  };

  // Filter records based on search
  const handleSearch = async () => {
    try {
      const response = await axios.get(`${apiBaseURL}/filter`, { params: { code: search } });
      setData(response.data);
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  // Handle form submission (Add/Edit)
  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${apiBaseURL}/${editId}`, formData);
      } else {
        await axios.post(apiBaseURL, formData);
      }
      setShowModal(false);
      setFormData({ code: "", description: "", tolerance: "" });
      setEditId(null);
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Handle Add Record to Table from Library
  const addSelectedToTable = () => {
    const selectedRecords = pomLibrary.filter(record => checkedRecords.includes(record._id));
    setSelectedData(prev => [...prev, ...selectedRecords]);
    setShowModal(false); // Close the modal after selection
  };

  // Handle Delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseURL}/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // Handle Edit action
  const handleEdit = (record) => {
    setFormData(record);
    setEditId(record._id);
    setShowModal(true);
  };

  // Handle Checkbox Change in the Modal
  const handleCheckboxChange = (id) => {
    setCheckedRecords(prevState => 
      prevState.includes(id) 
        ? prevState.filter(recordId => recordId !== id) // Deselect
        : [...prevState, id] // Select
    );
  };

  // On component mount, fetch the data
  useEffect(() => {
    fetchData();
    fetchPomLibrary(); // Fetch POM library records
  }, []);

  return (
    <div className="container mt-5">
      <h1>Point of Measure</h1>

      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
        <Button className="ms-3" onClick={() => setShowModal(true)}>Add New</Button>
        <Button className="ms-3" onClick={() => setShowModal(true)}>Open POM Library</Button>
      </div>

      <Table bordered>
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Tolerance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedData.map((record) => (
            <tr key={record._id}>
              <td>{record.code}</td>
              <td>{record.description}</td>
              <td>{record.tolerance}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(record)} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(record._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Point of Measure" : "Add Point of Measure"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                disabled={!!editId} // Code cannot be edited in update
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tolerance</Form.Label>
              <Form.Control
                type="text"
                value={formData.tolerance}
                onChange={(e) => setFormData({ ...formData, tolerance: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* POM Library Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Point of Measure from Library</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered>
            <thead>
              <tr>
                <th>Select</th>
                <th>Code</th>
                <th>Description</th>
                <th>Tolerance</th>
              </tr>
            </thead>
            <tbody>
              {pomLibrary.map((record) => (
                <tr key={record._id}>
                  <td>
                    <Form.Check 
                      type="checkbox" 
                      onChange={() => handleCheckboxChange(record._id)}
                    />
                  </td>
                  <td>{record.code}</td>
                  <td>{record.description}</td>
                  <td>{record.tolerance}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addSelectedToTable}>
            Add to Table
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PointOfMeasure;
