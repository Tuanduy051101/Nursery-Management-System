const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

exports.sendMail = async (req, res, next) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'trantuanduy.20011105@gmail.com',
            pass: 'yiavsqlfngxnxeod'
        }
    })

    const { from, to, subject, text } = req.body;

    const mailOptions = {
        from: from || 'your_email@gmail.com', // Sử dụng địa chỉ email của bạn hoặc nếu không có thì mặc định
        to: to || 'recipient_email@example.com', // Sử dụng địa chỉ email người nhận của bạn hoặc nếu không có thì mặc định
        subject: subject || 'Subject of the email', // Sử dụng tiêu đề email của bạn hoặc nếu không có thì mặc định
        text: text || 'Content of the email', // Sử dụng nội dung email dạng text của bạn hoặc nếu không có thì mặc định
        // html: html || null, // Sử dụng nội dung email dạng HTML của bạn hoặc nếu không có thì mặc định (null)
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.send({
            error: false,
            message: 'Email sent successfully',
        });
    } catch (error) {
        console.log(error);
        return res.send({
            error: true,
            message: 'Error sending email',
        });
    }
};
