const PDFDocument = require("pdfkit");

const generatePDF = (data, filePath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = doc.pipe(require("fs").createWriteStream(filePath));

        doc.fontSize(16).text("Common PDF Report", { align: "center" });
        doc.moveDown();

        for (const [key, value] of Object.entries(data)) {
            doc.fontSize(12).text(`${key}: ${value}`);
        }

        doc.end();
        stream.on("finish", () => resolve(filePath));
        stream.on("error", (err) => reject(err));
    });
};

module.exports = { generatePDF };
