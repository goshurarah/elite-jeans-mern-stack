import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styleImage.css";
// import NewDetailModal from "../../../../TechPack/Modals/WorkOrder/StyleDetail/NewDetailModal";

const StyleImage = ({ techPackId, styleDetail }) => {
  const style_id = styleDetail && styleDetail?._id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const openModal = (cardData = null) => {
    setSelectedCard(cardData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleEditClick = (id, cardData) => {
    // console.log("card Data",cardData,"id",id);
    openModal(cardData); // Pass full cardData to modal
  };

  const handleNewDetailClick = () => {
    setSelectedCard(null);
    openModal();
  };

  const handleSubmit = async (payload, selectedCard) => {
    // console.log("check plzz", selectedCard.id, "check plzz", selectedCard.id);
    try {
      const apiUrl = selectedCard
        ? `/api/work-orders/new-detail/${selectedCard.id}`
        : "/api/work-orders/new-detail/create";

      const method = selectedCard ? "PUT" : "POST";

      const response = await axios({
        method,
        url: apiUrl,
        data: payload,
      });

      if (response.status === 200) {
        console.log("Data submitted successfully:", response.data);
      } else {
        console.error("Error during submission:", response);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while submitting the data.");
    }
  };

  const fetchStyleDetail = async (techPackId, styleId) => {
    const style_Id = styleId;
    try {
      const response = await axios.post(
        "/api/work-orders/new-detail-by-work-orders",
        {
          workOrderId: techPackId,
          styleDetailId: style_Id,
        }
      );

      const styleDetails = response.data.data;

      return styleDetails.map((detail) => ({
        title: detail.pic.category || "Unknown",
        comments: detail.pic.imageTitle || "N/A",
        imageUrl: detail.pic?.imageUrl || "https://via.placeholder.com/150",
        id: detail._id,
      }));
    } catch (error) {
      console.error("Error fetching style details:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadStyleDetails = async () => {
      if (techPackId && style_id) {
        const fetchedCards = await fetchStyleDetail(techPackId, style_id);
        setCards(fetchedCards);
      }
    };

    loadStyleDetails();
  }, [techPackId, style_id]);

  return (
    <div className="card-container_style container">
      {cards.length > 0 ? (
        cards.map((card, index) => (
          <div
            key={index}
            className={`card_styleImg ${
              selectedCard ? "button-only-card" : ""
            }`}
          >
            <div className="card-image_style">
              <img src={card.imageUrl} alt={card.title} />
            </div>
            <div className="card-content_style">
              <h4>{card.title}</h4>
              <p>Comments: {card.comments}</p>
            </div>
            <div className="card-actions_style">
              <button
                className="btn_style edit_style"
                onClick={() => handleEditClick(card.id, card)}
              >
                Edit
              </button>
              <button className="btn_style delete_style">Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>.</p>
      )}

      <div className="card_styleImg button-container">
        <button
          className="btn_style action_style"
          onClick={handleNewDetailClick}
        >
          New Detail
        </button>
      </div>

      {/* <NewDetailModal
        show={isModalOpen}
        closeModal={closeModal}
        onSubmit={(payload) => handleSubmit(payload, selectedCard)}
        techPackId={techPackId}
        styleDetail={styleDetail}
        selectedCard={selectedCard}
      /> */}
    </div>
  );
};

export default StyleImage;
