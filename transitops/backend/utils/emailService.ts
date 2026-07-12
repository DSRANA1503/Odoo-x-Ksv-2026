import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendLicenseExpiryReminder = async (email: string, driverName: string, licenseExpiry: Date) => {
  // If SMTP is not properly configured, just log to console
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Mock Email] Sending license expiry reminder to ${email} (${driverName})`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"TransitOps" <noreply@transitops.com>',
      to: email,
      subject: "Action Required: Driver License Expiring Soon",
      text: `Hello ${driverName},\n\nYour driver license is set to expire on ${licenseExpiry.toDateString()}. Please renew it as soon as possible to avoid any disruption in your duties.\n\nThank you,\nTransitOps Management`,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
