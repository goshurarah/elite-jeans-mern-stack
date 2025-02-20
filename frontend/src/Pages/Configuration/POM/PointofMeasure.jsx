// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button, Table, Modal, Form } from "react-bootstrap";
// const PointOfMeasure = () => {
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({ code: "", description: "", tolerance: "" });
//   const [editId, setEditId] = useState(null);
//   const apiBaseURL = "/api/point-of-measure";
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(apiBaseURL);
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(`${apiBaseURL}/filter`, { params: { code: search } });
//       setData(response.data);
//     } catch (error) {
//       console.error("Error filtering data:", error);
//     }
//   };
//   const handleSubmit = async () => {
//     try {
//       if (editId) {

//         await axios.put(`${apiBaseURL}/${editId}`, formData);
//       } else {

//         await axios.post(apiBaseURL, formData);
//       }
//       setShowModal(false);
//       setFormData({ code: "", description: "", tolerance: "" });
//       setEditId(null);
//       fetchData();
//     } catch (error) {
//       console.error("Error saving data:", error);
//     }
//   };
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${apiBaseURL}/${id}`);
//       fetchData();
//     } catch (error) {
//       console.error("Error deleting record:", error);
//     }
//   };

//   const handleEdit = (record) => {
//     setFormData(record);
//     setEditId(record._id);
//     setShowModal(true);
//   };
//   useEffect(() => {
//     fetchData();
//   }, []);
//   return (
//     <div className="container mt-5">

//       <div className="d-flex mb-3">
//         <input
//           type="text"
//           className="form-control me-2"
//           placeholder="Search by code"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <Button onClick={handleSearch}>Search</Button>
//         <Button className="ms-3" onClick={() => setShowModal(true)}>Add New</Button>
//       </div>
//       <Table bordered>
//         <thead>
//           <tr>
//             <th>Code</th>
//             <th>Description</th>
//             <th>Tolerance</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((record) => (
//             <tr key={record._id}>
//               <td>{record.code}</td>
//               <td>{record.description}</td>
//               <td>{record.tolerance}</td>
//               <td>
//                 <Button variant="warning" onClick={() => handleEdit(record)} className="me-2">
//                   Edit
//                 </Button>
//                 <Button variant="danger" onClick={() => handleDelete(record._id)}>
//                   Delete
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>{editId ? "Edit Point of Measure" : "Add Point of Measure"}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Code</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={formData.code}
//                 onChange={(e) => setFormData({ ...formData, code: e.target.value })}
//                 disabled={!!editId}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Tolerance</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={formData.tolerance}
//                 onChange={(e) => setFormData({ ...formData, tolerance: e.target.value })}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSubmit}>
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };
// export default PointOfMeasure;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PointofMeasure.css";
import Navbar from "../../../Navbar/Navbar";
import { Button } from "@mui/material";
const PointOfMeasure = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    tolerance: "",
  });
  const [editId, setEditId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const apiBaseURL = "/api/point-of-measure";

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get(apiBaseURL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Search data

  // Handle form submission
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

  // Delete record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseURL}/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // Edit record
  const handleEdit = (record) => {
    setFormData(record);
    setEditId(record._id);
    setShowModal(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination logic
  // Filtered data based on search query
  const filteredData = data.filter(
    (item) =>
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.tolerance.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate the filtered data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update totalPages based on filtered data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Navbar />
      <div className="button_pom_top">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
        >
          Add Point of measure
        </Button>
      </div>
      <div className="table-container_pom">
        <h4 className="btn_pom_css">Points of Measure</h4>

        {/* <button className="ms-3" onClick={() => setShowModal(true)}>
          Add New
        </button> */}
        <div className="search_input_main">
          <span className="search_label_pom">Search:</span>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input_pom"
          />
        </div>
        {/* <button onClick={handleSearch} className="search-btn_pom">
          Search
        </button> */}
        <table className="custom-table_pom">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Tolerance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index}>
                <td>{row.code}</td>
                <td>{row.description}</td>
                <td>{row.tolerance}</td>
                <td>
                  <button
                    onClick={() => handleEdit(row)}
                    className="me-2 edit_pom"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(row._id)}
                    className="delete_pom"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination_all_pom">
          <p className="pagination">
            Page {currentPage} of {totalPages}
          </p>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editId ? "Edit Point of Measure" : "Add Point of Measure"}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <label>
                Code:
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Tolerance:
                <input
                  type="text"
                  value={formData.tolerance}
                  onChange={(e) =>
                    setFormData({ ...formData, tolerance: e.target.value })
                  }
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ code: "", description: "", tolerance: "" });
                    setEditId(null);
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PointOfMeasure;
