import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PictureModal from "./Modals/pictureModal";
import TrimModal from "./Modals/trimModal";
import SampleRequestList from "./sampleRequest";
import RivetModal from "./Modals/rivetModal";
import ButtonModal from "./Modals/buttonModal";
import StyleDetail from "../../Components/StyleDetail/styleDetail";
import StyleDetailAll from "../../Components/StyleDetail/StyleDetailAll";
import "./techPackDetails.css";
import Navbar from "../../Navbar/Navbar";
import EditTechPackModal from "./Modals/WorkOrder/DetailPage/EditTechPackModal";
function VerticalTechPackTable() {
  const navigate = useNavigate();

  const [techPack, setTechPack] = useState({});
  const location = useLocation();
  const { techPackId } = location.state || {};
  const [techPackData, setTechPackData] = useState(null);
  const [techPackDataTrim, setTechPackDataTrim] = useState(null);
  const [techPackDataRivet, setTechPackDataRivet] = useState(null);
  const [techPackDataButton, setTechPackDataButton] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenTrim, setModalIsOpenTrim] = useState(false);
  const [modalIsOpenRivet, setModalIsOpenRivet] = useState(false);
  const [modalIsOpenButton, setModalIsOpenButton] = useState(false);
  const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
  const openModalEdit = () => setModalIsOpenEdit(true);
  const closeModalEdit = () => setModalIsOpenEdit(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Set the selected image
  };

  const handleCloseModal = () => {
    setSelectedImage(null); // Close the modal by setting the image back to null
  };
  const techPackDataa = () => {
    axios
      .get(`/api/techPack/${techPackId}`)
      .then((response) => {
        setTechPackData(response.data.data);
        setTechPackDataTrim(response.data.data);
        setTechPackDataRivet(response.data.data);

        setTechPackDataButton(response.data.data);

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
  const closeModalButton = () => setModalIsOpenButton(false);
  const closeModalTrim = () => setModalIsOpenTrim(false);

  const handlePostSubmit = (payload) => {
    axios
      .put(`/api/techPack/${techPackId}`, payload)
      .then(() => {
        setTechPackData((prevData) => ({
          ...prevData,
          // pictures: [...prevData.pictures, ...payload.pictures],
        }));
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  const handlePostSubmitTrim = (payload) => {
    axios
      .put(`/api/techPack/${techPackId}`, payload)
      .then(() => {
        setTechPackData((prevData) => ({
          ...prevData,
          labelTrim: Array.isArray(prevData?.labelTrim)
            ? [...prevData?.labelTrim, ...payload?.labelTrim]
            : [prevData?.labelTrim, ...payload?.labelTrim],
        }));
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };
  const handlePostSubmitRivet = (payload) => {
    axios
      .put(`/api/techPack/${techPackId}`, payload)
      .then(() => {
        setTechPackDataRivet((prevData) => ({
          ...prevData,
          // pictures: [...prevData.pictures, ...payload.pictures],
        }));
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };
  const handlePostSubmitButton = (payload) => {
    axios
      .put(`/api/techPack/${techPackId}`, payload)
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
  const handlePostSubmitEdit = (newTechPack) => {
    techPackDataa();
  };
  useEffect(() => {
    handlePostSubmit();
  }, []);
  const handleSampleSpecsButtonClick = () => {
    if (techPackId) {
      navigate(`/sample-specs/${techPackId}`); 
    } else {
      console.error('TechPack ID is not available');
    }
  };
  return (
    <>
      <Navbar />
      <Button
        variant="contained"
        onClick={openModalEdit}
        // isOpen={openModalEdit}
        color="primary"
        sx={{ m: 2 }}
      >
        Edit Modal
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSampleSpecsButtonClick}
      >
        Sample/Graded Specs
      </Button>
      <div className="table_container_detail_page container">
        <div className="style-detail-container">
          <table className="style-detail-table">
            <thead>
              <tr>
                <th colSpan="4" className="style-detail-header">
                  Pack ID: {techPackData?.techPackId || "N/A"}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="label_style">Style</td>
                <td className="value_style">
                  {" "}
                  {techPackData?.styleId || "N/A"}
                </td>
                <td className="label_style">Vendor</td>
                <td className="value_style">
                  {" "}
                  {techPackData?.vendor?.name || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label_style">Category</td>
                <td className="value_style">
                  {techPackData?.category?.name || "N/A"}
                </td>
                <td className="label_style">Sub Category</td>
                <td className="value_style">
                  {techPackData?.subCategory?.name || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label_style">Item Type</td>
                <td className="value_style">
                  {" "}
                  {techPackData?.itemType?.name || "N/A"}
                </td>
                <td className="label_style">Date Created</td>
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
                      key={picture?._id}
                      src={picture?.imageUrl}
                      alt={`Picture for ${picture?.category}`}
                      style={{
                        maxWidth: "150px",
                        margin: "10px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() => handleImageClick(picture?.imageUrl)} // Open the image when clicked
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
                  {techPackDataTrim?.labelTrim && (
                    <img
                      key={techPackDataTrim?.labelTrim?._id}
                      src={techPackDataTrim?.labelTrim?.previewImage}
                      alt={`Picture for ${techPackDataTrim?.labelTrim?.name}`}
                      style={{
                        maxWidth: "150px",
                        margin: "10px",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s ease",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleImageClick(
                          techPackDataTrim?.labelTrim?.previewImage
                        )
                      } // Open the image when clicked
                    />
                  )}
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
                          key={rivetImage?._id}
                          src={rivetImage?.image?.imageUrl}
                          alt={`Picture for ${rivetImage?.image?.category}`}
                          style={{
                            maxWidth: "150px",
                            margin: "10px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            transition: "transform 0.3s ease",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleImageClick(rivetImage?.image?.imageUrl)
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
                          key={buttonImage?._id}
                          src={buttonImage?.image?.imageUrl}
                          alt={`Picture for ${buttonImage?.image?.category}`}
                          style={{
                            maxWidth: "150px",
                            margin: "10px",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            transition: "transform 0.3s ease",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleImageClick(buttonImage?.image?.imageUrl)
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
              </tr>
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
      <SampleRequestList techPackId={techPackId} />
      <StyleDetailAll techPackId={techPackId} />
      <EditTechPackModal
        isOpen={modalIsOpenEdit}
        closeModal={closeModalEdit}
        onSubmit={handlePostSubmitEdit}
        techPackData={techPackData}
      />
    </>
  );
}

export default VerticalTechPackTable;
