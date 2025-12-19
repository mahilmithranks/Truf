import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.default?.createTransport
  ? nodemailer.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
  : nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email service error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

// Send booking confirmation email
export const sendBookingConfirmation = async (userEmail, bookingDetails) => {
  const { bookingId, turfName, date, startTime, endTime, totalAmount, userName } = bookingDetails;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: '✅ Booking Confirmed - ' + turfName,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Booking Confirmed!</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333;">Hi ${userName},</p>
          <p style="font-size: 16px; color: #333;">Your turf booking has been confirmed! Get ready for an amazing game.</p>
          
          <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">📋 Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Booking ID:</td>
                <td style="padding: 10px 0; color: #333; text-align: right;">#${bookingId.substring(0, 8).toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Turf:</td>
                <td style="padding: 10px 0; color: #333; text-align: right;">${turfName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Date:</td>
                <td style="padding: 10px 0; color: #333; text-align: right;">${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Time:</td>
                <td style="padding: 10px 0; color: #333; text-align: right;">${startTime} - ${endTime}</td>
              </tr>
              <tr style="border-top: 2px solid #667eea;">
                <td style="padding: 15px 0 0 0; color: #667eea; font-weight: 700; font-size: 18px;">Total Amount:</td>
                <td style="padding: 15px 0 0 0; color: #667eea; font-weight: 700; font-size: 18px; text-align: right;">₹${totalAmount}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #155724; font-weight: 600;">✅ Payment Status: Completed</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <h3 style="color: #333; font-size: 18px;">📝 Important Notes:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Please arrive 10 minutes before your slot time</li>
              <li>Bring valid ID proof for verification</li>
              <li>Cancellations must be made at least 2 hours in advance</li>
              <li>Keep this email for reference</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; margin-bottom: 10px;">Need help?</p>
            <p style="color: #667eea; font-weight: 600; margin: 0;">Contact us at ${process.env.EMAIL_USER}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 20px;">
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            This is an automated email. Please do not reply to this message.
          </p>
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            © ${new Date().getFullYear()} ${turfName}. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};

// Send booking cancellation email
export const sendBookingCancellation = async (userEmail, bookingDetails) => {
  const { bookingId, turfName, date, startTime, endTime, userName, cancelledBy } = bookingDetails;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: '❌ Booking Cancelled - ' + turfName,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Booking Cancelled</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333;">Hi ${userName},</p>
          <p style="font-size: 16px; color: #333;">Your turf booking has been cancelled${cancelledBy === 'Admin' ? ' by the admin' : ''}.</p>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #856404; font-weight: 600;">Cancelled by: ${cancelledBy}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #f5576c; margin-top: 0; font-size: 20px;">📋 Cancelled Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Booking ID:</td>
                <td style="padding: 10px 0; color: #333; text-align: right;">#${bookingId.substring(0, 8).toUpperCase()}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Turf:</td>
                <td style="padding: 10px 0; color: #333; text-align: right;">${turfName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Date:</td>
                <td style="padding: 10px 0; color: #333; text-align: right;">${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-weight: 600;">Time:</td>
                <td style="padding: 10px 0; color: #333; text-align: right;">${startTime} - ${endTime}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #0c5460; font-weight: 600;">💰 Refund will be processed within 5-7 business days</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; margin-bottom: 10px;">Have questions?</p>
            <p style="color: #f5576c; font-weight: 600; margin: 0;">Contact us at ${process.env.EMAIL_USER}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 20px;">
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            This is an automated email. Please do not reply to this message.
          </p>
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            © ${new Date().getFullYear()} ${turfName}. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Cancellation email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};
