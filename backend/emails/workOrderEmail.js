const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const WorkOrder = require('../models/workOrderModel'); // Adjust the path to your workOrder model
require('dotenv').config(); // Load environment variables

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,       // SMTP host
    port: parseInt(process.env.EMAIL_PORT, 10), // SMTP port
    secure: process.env.EMAIL_PORT === '465', // Use SSL if port is 465
    auth: {
        user: process.env.EMAIL_USER,  // Email username
        pass: process.env.EMAIL_PASS,  // Email password
    },
});

// Function to fetch work order details and send email
const sendWorkOrderEmail = async (workOrderId, recipientEmail) => {
    try {
        // Fetch the work order with populated references
        const workOrder = await WorkOrder.findById(workOrderId)
            .populate('vendor category itemType subCategory trim_id')
            .populate('pictures buttonImages.image rivetImages.image trimImages.image');

        if (!workOrder) {
            throw new Error('Work order not found');
        }

        // Prepare the email content
        const emailContent = `
            <h1>Work Order Details</h1>
            <p><strong>Vendor:</strong> ${workOrder.vendor.name}</p>
            <p><strong>Category:</strong> ${workOrder.category.name}</p>
            <p><strong>Item Type:</strong> ${workOrder.itemType.name}</p>
            <p><strong>Sub-Category:</strong> ${workOrder.subCategory.name}</p>
            <p><strong>ETD:</strong> ${new Date(workOrder.etd).toLocaleDateString()}</p>
            <h2>Images</h2>
            ${workOrder.pictures.map(pic => `<img src="${pic.url}" alt="Picture" style="width:100px;">`).join('')}
            <h2>Button Images</h2>
            ${workOrder.buttonImages.map(button => `
                <div>
                    <p><strong>Color:</strong> ${button.color}</p>
                    <p><strong>Size:</strong> ${button.size}</p>
                    <p><strong>Quantity:</strong> ${button.quantity}</p>
                    <p><strong>Comment:</strong> ${button.comment || 'N/A'}</p>
                    <img src="${button.image.url}" alt="Button Image" style="width:100px;">
                </div>
            `).join('')}
        `;

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_FROM, // Sender address
            to: recipientEmail,          // Recipient address
            subject: 'Work Order Details', // Email subject
            html: emailContent,          // Email content
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

module.exports = sendWorkOrderEmail;
