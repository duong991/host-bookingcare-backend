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

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = "";
    result = `
        <h3>Xin chào ${dataSend.fullName}</h3>
        <p>Bạn nhận email này vì đã đặt lịch online trên BookingCare</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm: </p>

        <div>Xin chân thành cảm ơn</div>
    `;
    return result;
};

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
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
                to: dataSend.email, // list of receivers
                subject: "Kết quả khám bệnh", // Subject line
                // text: "Hello world?", // plain text body
                html: getBodyHTMLEmailRemedy(dataSend), // html body

                attachments: [
                    {
                        filename: `remedy-${
                            dataSend.patientId
                        }-${new Date().getTime()}.png`,
                        content: dataSend.imageBase64.split("base64,")[1],
                        encoding: "base64",
                    },
                ],
            });

            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

let getBodyHTMLEmailRemoveBooking = (dataSend) => {
    let result = "";
    result = `
        <h3>Xin chào ${dataSend.fullName}</h3>
        <p>Có vẻ bạn đặt lại lịch hẹn</p>
        <p>Thông tin đặt lịch khám bệnh trước đó: </p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Để xác nhận hủy lịch hẹn trước đó, vui lòng click vào đường link phía dưới để xác nhận và hoàn tất</p>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        <p>Xin chân thành cảm ơn</p>
    `;
    return result;
};

let sendRemoveBooking = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
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
                subject: "Xác nhận hủy lịch khám", // Subject line
                // text: "Hello world?", // plain text body
                html: getBodyHTMLEmailRemoveBooking(dataSend), // html body
            });

            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

let verificationEmail = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
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
                subject: "Xác nhận yêu cầu đổi mật khẩu", // Subject line
                // text: "Hello world?", // plain text body
                html: getBodyHTMLVerificationEmail(dataSend), // html body
            });

            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

let getBodyHTMLVerificationEmail = (dataSend) => {
    let result = "";
    result = `
        <h3>Xin chào ${dataSend.fullName}, </h3>
        <p>Cảm ơn bạn đã yêu cầu đổi mật khẩu. Chúng tôi cần xác nhận rằng bạn đã thực hiện yêu cầu này và muốn thay đổi mật khẩu của bạn.</p>
        <p>Vui lòng nhấp vào liên kết bên dưới để hoàn tất quá trình xác nhận: </p>
       
        <a href=${dataSend.redirectLink} target="_blank" style="background-color:#000000;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:16px;line-height:28px;padding:13px 27px;text-align:center;text-decoration:none;border:1px solid #000000">Click here</a>
        <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi để được hỗ trợ.</p>
        <br/>
        <b>Trân trọng</b>
        <p>Hệ thống đặt lịch khám bệnh BookingCare</p>

    `;
    return result;
};

let sendPasswordEmail = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
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
                subject: "Reset mật khẩu thành công", // Subject line
                // text: "Hello world?", // plain text body
                html: getBodyHTMLSendPasswordEmail(dataSend), // html body
            });

            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

let getBodyHTMLSendPasswordEmail = (dataSend) => {
    let result = "";
    result = `
        <h3>Xin chào ${dataSend.fullName}, </h3>
        <p>Yêu cầu đổi mật khẩu đã được thực hiện thành công</p>
        <p>Mật khẩu mới: ${dataSend.newPassword}</p>
        <br/>
        <b>Trân trọng</b>
        <p>Hệ thống đặt lịch khám bệnh BookingCare</p>

    `;
    return result;
};
module.exports = {
    sendSimpleEmail,
    sendAttachment,
    sendRemoveBooking,
    verificationEmail,
    sendPasswordEmail,
};
