import React, { useEffect, useState } from "react";
import "./styleDetail.css";
import axios from "axios";
import StyleDetailModal from "../../../../TechPack/Modals/WorkOrder/StyleDetail/StyleDetail";
import StyleImage from "./styleImage";

function StyleDetail({ techPackId }) {
  const [styleDetail, setStyleDetail] = useState(null);  // Initialize as null to check for data
  const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
  
  const openModalEdit = () => setModalIsOpenEdit(true); // Open the modal
  const closeModalEdit = () => setModalIsOpenEdit(false); // Close the modal
  const handlePostSubmitEdit = (newTechPack) => {
    fetchStyleDetail()
  };

  const techPackIdP = techPackId;

  const fetchStyleDetail = async () => {
    try {
      const response = await axios.post(
        `/api/work-orders/styled-detail-by-work-orders`,
        {
          workOrder_Id: techPackIdP,
        }
      );
      setStyleDetail(response.data[0]);
    } catch (err) {
      console.error("Error fetching style details:", err);
    }
  };

  useEffect(() => {
    fetchStyleDetail();
  }, [techPackId]);

  const isDataAvailable = styleDetail && Object.keys(styleDetail).length > 0;

  return (
    <>
      <div className="container">
        <div className="style-detail-container">
          <table className="style-detail-table">
            <thead>
              <tr>
                <th colSpan="4" className="style-detail-header">
                  <div className="style-detail-header_div">
                    <span>Style Detail</span>

                    {/* Conditionally render Add/Edit button */}
                    <span onClick={openModalEdit} className="add_edit_arrow">
                      {isDataAvailable ? "Edit" : "Add"}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="label_style">Descriptions</td>
                <td className="value_style">
                  {styleDetail?.description || "N/A"}
                </td>
                <td className="label_style">Fabric</td>
                <td className="value_style"> {styleDetail?.fabric || "N/A"}</td>
              </tr>
              <tr>
                <td className="label_style">Inseam</td>
                <td className="value_style">
                  {styleDetail?.inseam || "N/A"}
                </td>
                <td className="label_style">Stitching Thickness</td>
                <td className="value_style"> {styleDetail?.stitchingThickness || "N/A"}</td>
              </tr>
              <tr>
                <td className="label_style">Sewing Thread Color</td>
                <td className="value_style">
                  {styleDetail?.sewingThreadColor || "N/A"}
                </td>
                <td className="label_style">Stitching Comments</td>
                <td className="value_style">
                  {styleDetail?.stitchingComments || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label_style">Bar Tacks</td>
                <td className="value_style">{styleDetail?.barTacks || "N/A"}</td>
                <td className="label_style">Hardware</td>
                <td className="value_style"> {styleDetail?.hardware || "N/A"}</td>
              </tr>
              <tr>
                <td className="label_style">Comments:</td>
                <td className="value_style">
                  {styleDetail?.comments || "N/A"}
                </td>
                <td className="label_style">Summary</td>
                <td className="value_style">{styleDetail?.summary || "N/A"}</td>
              </tr>
              <tr>
                <td className="label_style">Sample Pictures</td>
                <td className="value_style" colSpan="3">
                  <img
                    src={styleDetail?.samplePicture}
                    alt="samplePicture"
                    className="style_detail_sample_picture"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal for adding or editing */}
        <StyleDetailModal
          isOpen={modalIsOpenEdit}
          closeModal={closeModalEdit}
          onSubmit={handlePostSubmitEdit}
          techPackData={styleDetail}
          techPackId={techPackId}
        />
      </div>

      <StyleImage techPackId={techPackId} styleDetail={styleDetail} />
    </>
  );
}

export default StyleDetail;
