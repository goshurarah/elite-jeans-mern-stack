import React, { useEffect } from "react";
import "./TopSection.css";
import axios from "axios";
function TopSection({workOrderId}) {
  const styleInfo = {
    orderNumber: "5092",
    createdOn: "01/27/2025",
    styleNumbers: ["KT33479X-01", "KT33479X-04"],
    fabricContent: "",
    customerBrand: "",
    size: "",
    descriptionImage:
      "https://elite-jeans.s3.amazonaws.com/9d56069808b75f8974458dacc4d0d113.jpg",
  };
  useEffect(() => {
    if (workOrderId) {
      fetchStyleInfo();
    }
  }, [workOrderId]); // Fetch info when workOrderId changes

  const fetchStyleInfo = async () => {
    try {
      const response = await axios.get(`/api/work-orders/fit-comments/${workOrderId}`);
      console.log("API response:", response.data); 
    //   setStyleInfo(response.data); 
    } catch (error) {
      console.error("Error fetching style info:", error);
      
    }
  };
    
  return (
    <div className="main_top_fit">
      {styleInfo && (
        <div className="col_top_fit">
          <div className="well well-sm">
            <div className="flex-row_fit">
              <div>
                <div className="form-group-inline">
                  <label>Order #</label>
                  <span>{styleInfo.orderNumber}</span>
                </div>
                <div className="form-group-inline">
                  <label>Created on</label>
                  <span>{styleInfo.createdOn}</span>
                </div>
                <div className="form-group-inline">
                  <label>Style #</label>
                  <span>{styleInfo.styleNumbers.join(", ")}</span>
                </div>
                <div className="form-group-inline">
                  <label>Fabric Content</label>
                  <span>{styleInfo.fabricContent || "N/A"}</span>
                </div>
                <div className="form-group-inline">
                  <label>Customer / Brand</label>
                  <span>{styleInfo.customerBrand || "N/A"}</span>
                </div>
                <div className="form-group-inline">
                  <label>Size</label>
                  <span>{styleInfo.size || "N/A"}</span>
                </div>
              </div>
              <div>
                {styleInfo.descriptionImage && (
                  <div className="thumbnail img-cont-medium">
                    <div
                      className="img_fit"
                      style={{
                        backgroundImage: `url(${styleInfo.descriptionImage})`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopSection;
