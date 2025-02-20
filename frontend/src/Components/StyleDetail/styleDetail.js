import React, { useEffect, useState } from "react";
import "./styleDetail.css";
import axios from "axios";
import StyleImage from "./styleImage";
// import StyleDetailModal from "../../../../TechPack/Modals/WorkOrder/StyleDetail/StyleDetail";
// import StyleImage from "./styleImage";

function StyleDetail({ techPackId }) {
  const [styleDetail, setStyleDetail] = useState("");
  const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
  const openModalEdit = () => setModalIsOpenEdit(true);
  const closeModalEdit = () => setModalIsOpenEdit(false);
  const handlePostSubmitEdit = (newTechPack) => {};
  const techPackIdP = techPackId;
  const fetchStyleDetail = async () => {
    try {
      const response = await axios.get(`/api/style-details/${techPackIdP}`, {
        workOrder_Id: techPackIdP,
      });
      setStyleDetail(response.data);
    } catch (err) {
      console.error("Error fetching style details:", err);
    }
  };

  useEffect(() => {
    fetchStyleDetail();
  }, [techPackId]);
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

                    <span onClick={openModalEdit} className="add_edit_arrow">Edit</span>
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
                  {styleDetail?.description || "N/A"}
                </td>
                <td className="label_style">Stitching Thickness</td>
                <td className="value_style"> {styleDetail?.fabric || "N/A"}</td>
              </tr>
              <tr>
                <td className="label_style">Sewing Thread Color</td>
                <td className="value_style">
                  {styleDetail?.sewingThreadColor || "N/A"}
                </td>
                <td className="label_style">Stitching Coments</td>
                <td className="value_style">
                  {" "}
                  {styleDetail?.stitchingThickness || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="label_style">Bar Tacks</td>
                <td className="value_style">{styleDetail?.zipper || "N/A"}</td>
                <td className="label_style">Hardware</td>
                <td className="value_style"> {styleDetail?.inseam || "N/A"}</td>
              </tr>
              <tr>
                <td className="label_style">Comments:</td>
                <td className="value_style">
                  {" "}
                  {styleDetail?.legOpening || "N/A"}
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
        {/* <StyleDetailModal
          isOpen={modalIsOpenEdit}
          closeModal={closeModalEdit}
          onSubmit={handlePostSubmitEdit}
          techPackData={styleDetail}
          techPackId={techPackId}
        /> */}
      </div>
      <StyleImage techPackId={techPackId} styleDetail={styleDetail} />
    </>
  );
}

export default StyleDetail;
