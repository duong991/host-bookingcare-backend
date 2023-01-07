require("dotenv").config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let language = dataSend.language;
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"BookingCare👻" <dongminhduong991@gmail.com>', // sender address
        to: dataSend.receiveEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        // text: "Hello world?", // plain text body
        html: getBodyHTMLEmail(language, dataSend), // html body
    });
};

let getBodyHTMLEmail = (language, dataSend) => {
    let result = "";
    if (language === "vi") {
        result = `
        <h3>Xin chào ${dataSend.fullName}</h3>
        <p>Bạn nhận email này vì đã đặt lịch online trên BookingCare</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link phía dưới để xác nhận và hoàn tất</p>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        <p>Xin chân thành cảm ơn</p>
    `;
    } else {
        result = `
        <h3>Dear ${dataSend.fullName}</h3>
        <p>You received this email because you booked an appointment online on BookingCare</p>
        <p>Information to schedule an appointment:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the above information is true, please click on the link below to confirm and complete</p>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        <p>Sincerely thank</p>
    `;
    }
    return result;
};

module.exports = {
    sendSimpleEmail,
};
