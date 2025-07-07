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
  const { name, email, number, service, message, zip, coupon } = req.body;
  const couponMessage =
    coupon && coupon.trim() !== "" ? coupon : "No coupon code";
  try {
    // Send email with inquiry details to falolatosin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: "contact@thebetterhomepros.com, amiscott27@gmail.com",
      subject: "New Inquiry Received",
      text: `
        Hello, you just received an inquiry form from ${name}.
        Here are the details:
        
        Email: ${email}
        Phone-Number: ${number}
           Zip Code: ${zip}
        Service: ${service}
        Coupon: ${couponMessage}
        Message: ${message}
     
      `,
      html: `
        <p>Hello, you just received an inquiry form from <strong>${name}</strong>.</p>
        <p>Here are the details:</p>
        <ul>
          <li>Email: ${email}</li>
          <li>Phone-Number: ${number}</li>
                 <li>Zip Code: ${zip}</li>
          <li>Service: ${service}</li>
          <li>Coupon: ${couponMessage}</li>
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
exports.createBooking = async (req, res) => {
  const { fullName, phone, email, date, time, comment, service } = req.body;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(time).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  try {
    // Email to Admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: "Tsgcode201@gmail.com",
      subject: `New Booking for ${service}`,
      html: `
        <h3>New Booking Received</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formattedTime}</p>
        <p><strong>Comment:</strong> ${comment || "None"}</p>
      `,
    });

    // Confirmation to Customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Booking Confirmation - Better Home Pros",
      html: `
        <h3>Thank you for your booking!</h3>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formattedTime}</p>
        <p>We will contact you soon!</p>
      `,
    });
    res.status(200).json({ message: "Booking successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed. Please try again." });
  }
};
