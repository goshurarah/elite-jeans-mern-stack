const { generatePDF } = require("./common-pdf.service");

const generateWorkOrderPDF = async (workOrder) => {
    const filePath = `./pdfs/workOrder-${workOrder._id}.pdf`;

    const data = {
        Vendor: workOrder.vendor.name,
        Category: workOrder.category.name,
        ItemType: workOrder.itemType.name,
        SubCategory: workOrder.subCategory.name,
        ETD: workOrder.etd.toDateString(),
        CreatedAt: workOrder.createdAt.toDateString(),
    };

    return generatePDF(data, filePath);
};

module.exports = { generateWorkOrderPDF };
