import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

export const senMail = (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "hanhngao3010@gmail.com",
      pass: "nzvfrxcwnpeitvpn",
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  const options = {
    from: "hanhngao3010@gmail.com",
    to: to,
    subject: subject,
    html: htmlContent,
  };
  return transporter.sendMail(options);
};