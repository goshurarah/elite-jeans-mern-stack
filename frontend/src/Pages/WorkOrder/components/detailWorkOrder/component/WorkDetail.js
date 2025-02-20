import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../../../TechPack/techPackDetails.css";
import PictureModal from "../../../../TechPack/Modals/WorkOrder/DetailPage/pictureModal";
import TrimModal from "../../../../TechPack/Modals/WorkOrder/DetailPage/trimModal";
import RivetModal from "../../../../TechPack/Modals/WorkOrder/DetailPage/rivetModal";
import ButtonModal from "../../../../TechPack/Modals/WorkOrder/DetailPage/buttonModal";
import TrimConModal from "../../../../TechPack/Modals/WorkOrder/DetailPage/trimConModal";
import EditWorkOrderModal from "../../../../TechPack/Modals/WorkOrder/DetailPage/EditWorkOrderModal";
import EmailWorkOrderModal from "../../../../TechPack/Modals/WorkOrder/DetailPage/EmailWorkOrderModal";
import ConfirmDialog from "../../../../TechPack/Modals/WorkOrder/DetailPage/ConfirmDialog";
function WorkDetail({ techPackId }) {
  // const location = useLocation();
  // const { techPackId } = location.state || {};
  const [techPackData, setTechPackData] = useState(null);
  const [techPackDataTrim, setTechPackDataTrim] = useState(null);
  const [techPackDataRivet, setTechPackDataRivet] = useState(null);
  const [techPackDataButton, setTechPackDataButton] = useState(null);
  const [techPackDataTrimCon, setTechPackDataTrimCon] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenTrim, setModalIsOpenTrim] = useState(false);
  const [modalIsOpenRivet, setModalIsOpenRivet] = useState(false);
  const [modalIsOpenButton, setModalIsOpenButton] = useState(false);
  const [modalIsOpenTrimCon, setModalIsOpenTrimCon] = useState(false);
  const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const handleClickOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        `/api/work-orders/add-teachpack/${techPackId}`
      );
      console.log("Response data add work:", response.data);
      setOpen(false);
      setOpenAdd(false);
      setOpenAdd(false);
    } catch (error) {
      console.error("Error posting tech pack:", error);
    }
    console.log("Tech Pack Created!");
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleSubmitEmails = (emails) => {
  //   console.log("Submitted Emails:", emails);
  // };
  const handleSubmitEmails = async (emails) => {
    try {
      const response = await axios.post(
        `/api/work-orders/send-work-order-email/${techPackId}`,
        {
          email: emails,
        }
      );

      console.log("Work order email sent successfully:", response.data.message);
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data.error);
      } else {
        console.error("Error:", error.message);
      }
    }
  };
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Set the selected image
  };

  const handleCloseModal = () => {
    setSelectedImage(null); // Close the modal by setting the image back to null
  };
  const techPackDataa = () => {
    axios
      .get(`/api/work-orders/${techPackId}`)
      .then((response) => {
        setTechPackData(response.data);
        setTechPackDataTrim(response.data);
        setTechPackDataRivet(response.data);

        setTechPackDataButton(response.data);
        setTechPackDataTrimCon(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load TechPack data");
        setLoading(false);
      });
  };
  useEffect(() => {
    if (techPackId) {
      setLoading(true);
      techPackDataa();
    }
  }, [techPackId]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const openModalTrim = () => setModalIsOpenTrim(true);
  const openModalRivet = () => setModalIsOpenRivet(true);
  const closeModalRivet = () => setModalIsOpenRivet(false);
  const openModalButton = () => setModalIsOpenButton(true);
  const openModalTrimCon = () => setModalIsOpenTrimCon(true);
  const openModalEdit = () => setModalIsOpenEdit(true);

  const closeModalButton = () => setModalIsOpenButton(false);
  const closeModalTrimCon = () => setModalIsOpenTrimCon(false);
  const closeModalEdit = () => setModalIsOpenEdit(false);
  const closeModalTrim = () => setModalIsOpenTrim(false);

  const handlePostSubmit = (payload) => {
    axios
      .put(`/api/work-orders/${techPackId}`, payload)
      .then(() => {
        setTechPackData((prevData) => ({
          ...prevData,
          //   pictures: [...prevData.pictures, ...payload.pictures],
        }));
        techPackDataa();
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };
  const handleDownload = () => {
    fetch(`/api/work-orders/${techPackId}/download-pdf`)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error("Failed to download PDF");
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `workorder-${techPackId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => console.error(error));
  };
  const handlePostSubmitTrim = (payload) => {
    axios
      .put(`/api/work-orders/${techPackId}`, payload)
      .then(() => {
        setTechPackData((prevData) => ({
          ...prevData,
          trim_id: [...prevData.trim_id, ...payload.trim_id],

          //   trimImages: Array.isArray(prevData.labelTrim)
          //     ? [...prevData.labelTrim, ...payload.labelTrim]
          //     : [prevData.labelTrim, ...payload.labelTrim],
        }));
        setTechPackData((prevData) => ({
          ...prevData,
          trim_id: [], // Reset trim_id array if necessary
          // trimImages: [], // Optionally reset trimImages
        }));
        techPackDataa();
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };
  const handlePostSubmitRivet = (payload) => {
    axios
      .put(`/api/work-orders/${techPackId}`, payload)
      .then(() => {
        setTechPackDataRivet((prevData) => ({
          ...prevData,
          // pictures: [...prevData.pictures, ...payload.pictures],
        }));
        techPackDataa();
      })

      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };
  const handlePostSubmitButton = (payload) => {
    axios
      .put(`/api/work-orders/${techPackId}`, payload)
      .then(() => {
        setTechPackDataButton((prevData) => ({
          ...prevData,
          // pictures: [...prevData.pictures, ...payload.pictures],
        }));
        techPackDataa();
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };
  const handlePostSubmitTrimCon = (payload) => {
    axios
      .put(`/api/work-orders/${techPackId}`, payload)

      .then(() => {
        setTechPackDataTrimCon((prevData) => ({
          ...prevData,
          // pictures: [...prevData.pictures, ...payload.pictures],
        }));
        techPackDataa();
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };
  const handlePostSubmitEdit = (newTechPack) => {
    techPackDataa();
  };
  useEffect(() => {
    handlePostSubmit();
  }, []);
  return (
    <div>
      <div>
      <Button
        variant="contained"
        onClick={openModalEdit}
        // isOpen={openModalEdit}
        color="primary"
        sx={{ mx: 2 }}
      >
        Edit Modal
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{ mx: 2 }}
        onClick={handleDownload}
      >
        Download Work Order
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{ m: 2 }}
        onClick={handleClickOpen}
      >
        Email Work Order
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{ m: 2 }}
        onClick={handleClickOpenAdd}
      >
        Add Tech Pack
      </Button>
      
      <Link to={`/work-order-detail/${techPackId}/fit-comment`}>
        <Button variant="contained" color="primary" sx={{ m: 2 }}>
          Fit Comments
        </Button>
      </Link>
      </div>
      <div className="table_container_detail_page container">
        <div className="style-detail-container">
          <table className="style-detail-table">
            <thead>
              <tr>
                <th colSpan="4" className="style-detail-header">
                  Work Order Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="label_style">Vendor</td>
                <td className="value_style">
                  {" "}
                  {techPackData?.vendor?.name || "N/A"}
                </td>
                <td className="label_style">Work Order #</td>
                <td className="value_style"> {techPackData?.workOrderId || "N/A"}</td>
              </tr>
              <tr>
                <td className="label_style">Trim</td>
                <td className="value_style">{techPackData?.trim || "N/A"}</td>
                <td className="label_style">Item Type</td>
                <td className="value_style">
                  {techPackData?.itemType?.name || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label_style">Category</td>
                <td className="value_style">
                  {" "}
                  {techPackData?.category?.name || "N/A"}
                </td>
                <td className="label_style">Shipping Status</td>
                <td className="value_style">
                  {" "}
                  {techPackData?.shippingStatus || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label_style">Subcategory</td>
                <td className="value_style">
                  {" "}
                  {techPackData?.subCategory?.name || "N/A"}
                </td>
                <td className="label_style">Date Created</td>
                <td className="value_style">
                  {" "}
                  {new Date(techPackData?.createdAt).toLocaleDateString()}
                  
                </td>
              </tr>
              <tr>
                <td className="label_style">ETD</td>

                <td className="value_style">
                  {" "}
                  {new Date(techPackData?.etd).toLocaleDateString()}
                </td>
                <td className="label_style">Last Updated</td>
                <td className="value_style">
                  {" "}
                  {techPackData?.lastUpdated || "N/A"}
                </td>
              </tr>
              <tr>
                {/* <td className="label_style">LEG OPENING:</td> */}
                <td className="value_style">
                  {selectedImage && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                      }}
                      onClick={handleCloseModal} // Close the modal when clicking anywhere outside the image
                    >
                      <img
                        src={selectedImage}
                        alt="Selected"
                        style={{
                          maxWidth: "90%",
                          maxHeight: "90%",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  )}
                  <h3>Style Picture</h3>
                  {techPackData?.pictures?.map((picture) => (
                    <img
                      key={picture._id}
                      src={picture.imageUrl}
                      alt={`Picture for ${picture.category}`}
                      style={{
                        maxWidth: "150px",
                        margin: "10px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() => handleImageClick(picture.imageUrl)} // Open the image when clicked
                    />
                  ))}
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={openModal}
                      sx={{ mb: 2 }}
                    >
                      Upload Image
                    </Button>
                  </div>
                </td>
                <td className="value_style">
                  <h3>Trim & Label</h3>
                  {techPackData?.trim_id?.map((trim) => (
                    <img
                      key={trim._id}
                      src={trim.previewImage}
                      alt={`trim for ${trim.name}`}
                      style={{
                        maxWidth: "150px",
                        margin: "10px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() => handleImageClick(trim.previewImage)} // Open the image when clicked
                    />
                  ))}
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={openModalTrim}
                      sx={{ mb: 2 }}
                    >
                      Upload Image
                    </Button>
                  </div>
                </td>
                <td className="value_style">
                  <div className="rivet_button_All">
                    <div>
                      <h3>Rivets</h3>
                      {techPackDataRivet?.rivetImages?.map((rivetImage) => (
                        <img
                          key={rivetImage._id}
                          src={rivetImage.image.imageUrl}
                          alt={`Picture for ${rivetImage.image.category}`}
                          style={{
                            maxWidth: "150px",
                            margin: "10px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            transition: "transform 0.3s ease",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleImageClick(rivetImage.image.imageUrl)
                          } // Open the image when clicked
                        />
                      ))}
                      <div>
                        <div>
                          color:{" "}
                          {techPackDataRivet?.rivetImages[0]?.color || "N/A"}
                        </div>
                        <div>
                          size:{" "}
                          {techPackDataRivet?.rivetImages[0]?.size || "N/A"}
                        </div>
                        <div>
                          quantity:{" "}
                          {techPackDataRivet?.rivetImages[0]?.quantity || "N/A"}
                        </div>
                        <div>
                          comment{" "}
                          {techPackDataRivet?.rivetImages[0]?.comment || "N/A"}
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={openModalRivet}
                          sx={{ mb: 2 }}
                        >
                          Upload Image
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3>Button</h3>
                      {techPackDataButton?.buttonImages?.map((buttonImage) => (
                        <img
                          key={buttonImage._id}
                          src={buttonImage.image.imageUrl}
                          alt={`Picture for ${buttonImage.image.category}`}
                          style={{
                            maxWidth: "150px",
                            margin: "10px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            transition: "transform 0.3s ease",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleImageClick(buttonImage.image.imageUrl)
                          } // Open the image when clicked
                        />
                      ))}
                      <div>
                        <div>
                          color:{" "}
                          {techPackDataButton?.buttonImages[0]?.color || "N/A"}
                        </div>
                        <div>
                          size:{" "}
                          {techPackDataButton?.buttonImages[0]?.size || "N/A"}
                        </div>
                        <div>
                          quantity:{" "}
                          {techPackDataButton?.buttonImages[0]?.quantity ||
                            "N/A"}
                        </div>
                        <div>
                          comment:{" "}
                          {techPackDataButton?.buttonImages[0]?.comment ||
                            "N/A"}
                        </div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={openModalButton}
                          sx={{ mb: 2 }}
                        >
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="value_style">
                  <h3>Trim</h3>
                  {techPackDataTrimCon?.trimImages?.map((rivetImage) => (
                    <img
                      key={rivetImage._id}
                      src={rivetImage.image.imageUrl}
                      alt={`Picture for ${rivetImage.image.category}`}
                      style={{
                        maxWidth: "150px",
                        margin: "10px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleImageClick(rivetImage.image.imageUrl)
                      } // Open the image when clicked
                    />
                  ))}
                  <div>
                    <div>
                      color:{" "}
                      {techPackDataTrimCon?.trimImages[0]?.color || "N/A"}
                    </div>
                    <div>
                      size: {techPackDataTrimCon?.trimImages[0]?.size || "N/A"}
                    </div>
                    <div>
                      quantity:{" "}
                      {techPackDataTrimCon?.trimImages[0]?.quantity || "N/A"}
                    </div>
                    <div>
                      comment{" "}
                      {techPackDataTrimCon?.trimImages[0]?.comment || "N/A"}
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={openModalTrimCon}
                      sx={{ mb: 2 }}
                    >
                      Upload Image
                    </Button>
                  </div>
                </td>
              </tr>
              <tr></tr>
              {/* <tr>
                <td className="label_style">Sample Pictures</td>
                <td className="value_style" colSpan="3">
                  None
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
      <PictureModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        onSubmit={handlePostSubmit}
        techPackData={techPackData}
      />
      <TrimModal
        isOpen={modalIsOpenTrim}
        closeModal={closeModalTrim}
        onSubmit={handlePostSubmitTrim}
        techPackData={techPackDataTrim}
      />
      <RivetModal
        isOpen={modalIsOpenRivet}
        closeModal={closeModalRivet}
        onSubmit={handlePostSubmitRivet}
        techPackData={techPackDataRivet}
      />
      <ButtonModal
        isOpen={modalIsOpenButton}
        closeModal={closeModalButton}
        onSubmit={handlePostSubmitButton}
        techPackData={techPackDataButton}
      />
      <TrimConModal
        isOpen={modalIsOpenTrimCon}
        closeModal={closeModalTrimCon}
        onSubmit={handlePostSubmitTrimCon}
        techPackData={techPackDataTrimCon}
      />
      <EditWorkOrderModal
        isOpen={modalIsOpenEdit}
        closeModal={closeModalEdit}
        onSubmit={handlePostSubmitEdit}
        techPackData={techPackData}
      />
      <EmailWorkOrderModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmitEmails}
      />
      <ConfirmDialog
        open={openAdd}
        onClose={handleCloseAdd}
        onConfirm={handleConfirm}
        title="Confirm"
        message="Do you want to create Tech Pack from Order?"
      />
    </div>
  );
}

export default WorkDetail;
