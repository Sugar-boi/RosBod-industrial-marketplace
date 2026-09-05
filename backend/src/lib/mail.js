const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
  return info;
}

async function sendVerificationCode(email, code, name) {
  return sendMail({
    to: email,
    subject: "Verify your Rosebod account",
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>Welcome${name ? `, ${name}` : ""}!</h2>
                <p>Your verification code is:</p>
                <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${code}</p>
                <p>This code expires when you verify or request a new one.</p>
                <p style="color: #666; font-size: 12px;">If you didn't create a Rosebod account, ignore this email.</p>
            </div>
        `,
  });
}

async function sendPasswordResetCode(email, code, name) {
  return sendMail({
    to: email,
    subject: "Reset your Rosebod password",
    html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
              <h2>Password reset${name ? `, ${name}` : ""}</h2>
              <p>We received a request to reset your password.</p>
              <p>Your reset code is:</p>
              <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${code}</p>
              <p>If you didn't request this, you can ignore this email.</p>
          </div>
      `,
  });
}

module.exports = {
  sendMail,
  sendVerificationCode,
  sendPasswordResetCode,
};
