// Import all dependencies ======================================================================================================================================================================================================>
import cote from 'cote';
import nodemailer from 'nodemailer';

// Module =======================================================================================================================================================================================================================>
const sal = new cote.Responder({ name: 'send-activate-link-service', namespace: 'send-activate-link' });

sal.on('sendActivateLink', async (req, cb) => {
  try {
    const date = new Date();
    const data = { "username": req.params.body.username, "created": date.toString() };
    const mailToken = authJwt.createMailToken(data);

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_DOMAIN,
      to: req.body.email,
      subject: "Verify Email",
      text: `Click on the link below to veriy your account: http://localhost:5000/api/auth/activate/${mailToken}`,
    });

    console.log("email sent successfully");
    
    cb('next');
  } catch (e) { cb({ error: e.message }) };
});