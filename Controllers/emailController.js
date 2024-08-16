const nodemailer = require("nodemailer");
const express = require("express");
require("dotenv").config();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Handle form submissions
exports.formSubmission = async (req, res) => {
  const { name, email, service, message } = req.body;

  try {
    // Send email with inquiry details to falolatosin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "falolatosin8@gmail.com",
      subject: "New Inquiry Received",
      text: `
        Hello, you just received an inquiry form from ${name}.
        Here are the details:
        
        Email: ${email}
        Service: ${service}
        Message: ${message}
      `,
      html: `
        <p>Hello, you just received an inquiry form from <strong>${name}</strong>.</p>
        <p>Here are the details:</p>
        <ul>
          <li>Email: ${email}</li>
          <li>Service: ${service}</li>
          <li>Message: ${message}</li>
        </ul>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
    });
  } catch (error) {
    console.error("Error sending inquiry email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send inquiry email",
    });
  }
};

// Handle email subscription
exports.emailSubscriber = async (req, res) => {
  const { email } = req.body;

  try {
    // Send confirmation email to the subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Subscribing",
      text: `
        Hello,
        Thank you for subscribing to our mailing list.
        We will keep you updated with our latest news and offers.
      `,
      html: `
        <p>Hello,</p>
        <p>Thank you for subscribing to our mailing list.</p>
        <p>We will keep you updated with our latest news and offers.</p>
      `,
    });

    // Notify falolatosin about the new subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "falolatosin8@gmail.com",
      subject: "New Subscriber Alert",
      text: `
        Hello,
        You have a new subscriber.
        Here is the email: ${email}
      `,
      html: `
        <p>Hello,</p>
        <p>You have a new subscriber.</p>
        <p>Here is the email: <strong>${email}</strong></p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Subscription and notification emails sent successfully",
    });
  } catch (error) {
    console.error("Error sending subscription email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send subscription email" });
  }
};
