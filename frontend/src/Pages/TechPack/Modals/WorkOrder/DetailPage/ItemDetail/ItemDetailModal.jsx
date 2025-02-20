import React, { useState, useEffect, useRef } from "react";
import "./ItemDetailModal.css";
import axios from "axios";

const ItemDetailModal = ({ onClose, onSubmit, request }) => {
  const [formData, setFormData] = useState(
    request || {
      style_number: "",
      client_Id: "",
      class_Id: "",
      color_Id: "",
      quantity: "",
      size_scale: "",
      size_break: "",
      number_of_master_polybags_per_master_carton: "",
      number_of_pieces_per_master_carton: "",
      cbm_per_unit: "",
      total_cbm: "",
      comments: "",
      internal_comments: "",
      customer_po_number: "",
      individual_poly_bag: false,
      price_tickets: false,
      hanger: false,
    }
  );
  const [isChecked, setIsChecked] = useState(false);
  const [inputFields, setInputFields] = useState([]); // New state for dynamic input fields
  const [colors, setColors] = useState([]);
  const [clients, setClients] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPayload = {
      ...formData,
      package_by_size: inputFields,
    };
    onSubmit(finalPayload);
  };

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      { id: Date.now(), size: "", quantity: "" }, // Unique ID using timestamp
    ]);
  };

  const handleFieldChange = (e, id) => {
    const { name, value } = e.target;
    setInputFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [name]: value } : field
      )
    );
  };

  const handleDeleteField = (id) => {
    setInputFields(inputFields.filter((field) => field.id !== id));
  };

  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  useEffect(() => {
    // Define an async function to fetch all APIs
    const fetchData = async () => {
      try {
        // Use Promise.all to make all API requests concurrently
        const [colorsResponse, clientsResponse, classesResponse] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/colors"),
          axios.get("http://127.0.0.1:5000/api/clients"),
          axios.get("http://127.0.0.1:5000/api/classes"),
        ]);

        // Set data to state
        setColors(colorsResponse.data);
        setClients(clientsResponse.data);
        setClasses(classesResponse.data);
      } catch (err) {
        // Handle errors
        setError(err.message || "Something went wrong");
      }
    };

    fetchData();
  }, []);
  return (
    <div className="modal">
      <div className="modal-content modal-content_itemDetail" ref={modalRef}>
        <form onSubmit={handleSubmit}>
          <div className="form-section_itemDetail">
            <div>
              <label className="label-itemDetail_checkbox">
                <span>Packing by Size:</span>
                <input
                  type="checkbox"
                  className="checkbox_itemDetail"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              </label>
              {isChecked && (
                <div>
                  <button
                    type="button"
                    className="button1"
                    onClick={handleAddFields}
                  >
                    Add Size
                  </button>
                </div>
              )}
            </div>
          </div>

          {inputFields.map((field) => (
            <div key={field.id} className="form-section_itemDetail">
              <label className="label-itemDetail">
                Size:
                <input
                  type="text"
                  name="size"
                  value={field.size}
                  onChange={(e) => handleFieldChange(e, field.id)}
                />
              </label>
              <label className="label-itemDetail">
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  value={field.quantity}
                  onChange={(e) => handleFieldChange(e, field.id)}
                />
              </label>
              <button
                type="button"
                className="delete-icon"
                onClick={() => handleDeleteField(field.id)}
              >
                🗑️
              </button>
            </div>
          ))}

          <div className="form-section_itemDetail">
            <label className="label-itemDetail">
              Style #:
              <input
                type="text"
                name="style_number"
                value={formData.style_number}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-section_itemDetail">
            <label className="label-itemDetail select_labelItem">
              Client Name:
              <select
                name="client_Id"
                value={formData.client_Id}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="label-itemDetail select_labelItem">
              Class Name:
              <select
                name="class_Id"
                value={formData.class_Id}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="label-itemDetail select_labelItem">
              Color Name:
              <select
                name="color_Id"
                value={formData.color_Id}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {colors.map((color) => (
                  <option key={color._id} value={color._id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-section_itemDetail">
            <label className="label-itemDetail">
              Quantity:
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
            </label>
            <label className="label-itemDetail">
              Size Scale:
              <input
                type="text"
                name="size_scale"
                value={formData.size_scale}
                onChange={handleChange}
              />
            </label>
            <label className="label-itemDetail">
              Size Break:
              <input
                type="text"
                name="size_break"
                value={formData.size_break}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-section_itemDetail">
            <label className="label-itemDetail">
              Master Polybags per Carton:
              <input
                type="number"
                name="number_of_master_polybags_per_master_carton"
                value={
                  formData.number_of_master_polybags_per_master_carton
                }
                onChange={handleChange}
              />
            </label>
            <label className="label-itemDetail">
              Pieces per Master Carton:
              <input
                type="number"
                name="number_of_pieces_per_master_carton"
                value={
                  formData.number_of_pieces_per_master_carton
                }
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-section_itemDetail">
            <label className="label-itemDetail">
              CBM per Unit:
              <input
                type="text"
                name="cbm_per_unit"
                value={formData.cbm_per_unit}
                onChange={handleChange}
              />
            </label>
            <label className="label-itemDetail">
              Total CBM:
              <input
                type="text"
                name="total_cbm"
                value={formData.total_cbm}
                onChange={handleChange}
              />
            </label>
            <label className="label-itemDetail_checkbox">
              <span>Individual Poly Bag</span>
              <input
                type="checkbox"
                name="individual_poly_bag"
                checked={formData.individual_poly_bag}
                onChange={handleChange}
              />
            </label>
            <label className="label-itemDetail_checkbox">
              <span>Price Tickets</span>
              <input
                type="checkbox"
                name="price_tickets"
                checked={formData.price_tickets}
                onChange={handleChange}
              />
            </label>
            <label className="label-itemDetail_checkbox">
              <span>Hanger</span>
              <input
                type="checkbox"
                name="hanger"
                checked={formData.hanger}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-section_itemDetail">
            <label className="label-itemDetail">
              Comments:
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
              ></textarea>
            </label>
            <label className="label-itemDetail">
              Internal Comments:
              <textarea
                name="internal_comments"
                value={formData.internal_comments}
                onChange={handleChange}
              ></textarea>
            </label>
            <label className="label-itemDetail">
              Customer PO #:
              <input
                type="text"
                name="customer_po_number"
                value={formData.customer_po_number}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="modal-actions">
            {request ? <button type="submit" className="btn btn-save">
              Update
            </button> : <button type="submit" className="btn btn-save">
              Save
            </button>}
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemDetailModal;
