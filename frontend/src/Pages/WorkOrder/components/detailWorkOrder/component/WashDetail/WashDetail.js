import React, { useEffect, useState } from "react";
import "./WashDetail.css";
import axios from "axios";
import WashImage from "./washImage";
import WashDetailModal from "../../../../../TechPack/Modals/WorkOrder/WashDetail/washDetail";


function WashDetail({ techPackId }) {
  const [styleDetail, setStyleDetail] = useState(null);
  const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
  
  const openModalEdit = () => setModalIsOpenEdit(true);
  const closeModalEdit = () => setModalIsOpenEdit(false); 
  const handlePostSubmitEdit = (newTechPack) => {
    fetchStyleDetail()
  };

  const techPackIdP = techPackId;

  const fetchStyleDetail = async () => {
    try {
      const response = await axios.post(
        `/api/work-orders/wash-detail-by-work-orders`,
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
                    <span>Wash Detail & Color Detail</span>

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
                <td className="label_style">Wash</td>
                <td className="value_style">
                  {styleDetail?.wash || "N/A"}
                </td>
                <td className="label_style">Dry Process</td>
                <td className="value_style"> {styleDetail?.dryProcess || "N/A"}</td>
              </tr>
              <tr>
                <td className="label_style">Color</td>
                <td className="value_style">
                  {styleDetail?.color || "N/A"}
                </td>
                <td className="label_style">Comments</td>
                <td className="value_style"> {styleDetail?.comments || "N/A"}</td>
              </tr>
            
              <tr>
                <td className="label_style">Wash Pictures</td>
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
        <WashDetailModal
          isOpen={modalIsOpenEdit}
          closeModal={closeModalEdit}
          onSubmit={handlePostSubmitEdit}
          techPackData={styleDetail}
          techPackId={techPackId}
        /> 
      </div>
<WashImage techPackId={techPackId} styleDetail={styleDetail} />
    </>
  );
}

export default WashDetail;
