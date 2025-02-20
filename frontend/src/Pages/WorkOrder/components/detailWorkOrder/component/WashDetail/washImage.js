import React, { useEffect, useState } from "react";
import axios from "axios";
import "./washImage.css";
import NewWashModal from "../../../../../TechPack/Modals/WorkOrder/WashDetail/NewWashModal";

const WashImage = ({ techPackId, styleDetail }) => {
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
    openModal(cardData); // Pass full cardData to modal
  };

  // Handle the delete operation with confirmation
  const handleDelete = (id) => {
    // Confirm delete
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (isConfirmed) {
      deleteCard(id); // Call delete function
    }
  };

  // Delete the card from the backend
  const deleteCard = async (id) => {
    try {
      const response = await axios.delete(`/api/work-orders/new-detail/${id}`);
      if (response.status === 200) {
        console.log("Card deleted successfully");
        // Remove the card from the UI by filtering it out
        setCards((prevCards) => prevCards.filter((card) => card.id !== id));
      } else {
        console.error("Failed to delete card:", response);
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      alert("An error occurred while deleting the card.");
    }
  };

  const handleNewDetailClick = () => {
    setSelectedCard(null);
    openModal();
  };

  const handleSubmit = async (payload, selectedCard) => {
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

      if (response) {
        console.log("Data submitted successfully:", response.data);
        if (techPackId && style_id) {
          const updatedCards = await fetchStyleDetail(techPackId, style_id);
          setCards(updatedCards);
        }
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
          washDetailId: style_Id,
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
      {/* {cards.length > 0 ? ( */}
      {cards.map((card, index) => (
        <div
          key={index}
          className={`card_styleImg ${selectedCard ? "button-only-card" : ""}`}
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
            <button
              className="btn_style delete_style"
              onClick={() => handleDelete(card.id)} // Trigger delete on click
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <div className="card_styleImg button-container">
        <button
          className="btn_style action_style"
          onClick={handleNewDetailClick}
        >
          New Detail
        </button>
      </div>
      <NewWashModal
        show={isModalOpen}
        closeModal={closeModal}
        onSubmit={(payload) => handleSubmit(payload, selectedCard)}
        techPackId={techPackId}
        styleDetail={styleDetail}
        selectedCard={selectedCard}
      />
    </div>
  );
};

export default WashImage;
