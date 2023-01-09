import db from "../models/index";
import _ from "lodash";
import emailService from "./emailService";
require("dotenv").config();
import { v4 as uuidv4 } from "uuid";

const { Op } = require("sequelize");

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
};

let buildUrlEmailCancel = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/cancel-booking?tokenRemove=${token}&doctorId=${doctorId}`;
    return result;
};

let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data);
            if (
                !data.email ||
                !data.doctorId ||
                !data.date ||
                !data.timeType ||
                !data.fullName ||
                !data.selectedGender ||
                !data.clinicId
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                let token = uuidv4();
                let tokenRemove = uuidv4();
                await emailService.sendSimpleEmail({
                    receiveEmail: data.email,
                    fullName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                });

                let [user, result] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        fullName: data.fullName,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                        gender: data.selectedGender,
                        roleId: "R3",
                    },
                    raw: false,
                });
                // User đã tồn tại trong CSDL
                if (!result) {
                    user.fullName = data.fullName;
                    user.address = data.address;
                    user.phoneNumber = data.phoneNumber;
                    user.gender = data.selectedGender;

                    await user.save();
                }

                // create a booking record
                let { id } = user;
                if (user) {
                    let [booking, result] = await db.Booking.findOrCreate({
                        where: { patientId: id, date: data.date },
                        defaults: {
                            statusId: "S1",
                            doctorId: data.doctorId,
                            patientId: id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                            tokenRemove: tokenRemove,
                            ClinicId: data.clinicId,
                        },
                    });
                    // Lịch hẹn đã tồn tại trong CSDL
                    if (!result) {
                        await emailService.sendRemoveBooking({
                            receiveEmail: data.email,
                            fullName: data.fullName,
                            time: data.timeString,
                            doctorName: data.doctorName,
                            redirectLink: buildUrlEmailCancel(
                                data.doctorId,
                                booking.tokenRemove
                            ),
                        });
                        resolve({
                            errCode: 0,
                            message:
                                "Tài khoản đã tồn tại lịch hẹn. Để đặt lịch hẹn mới vui lòng truy cập email để hủy",
                        });
                    } else {
                        resolve({
                            errCode: 0,
                            message: "Khởi tạo lịch hẹn thành công",
                        });
                    }
                }
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let postVerifyBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                const fifteenMinutesInMs = 15 * 60 * 1000;

                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: "S1",
                    },
                    raw: false,
                });
                // console.log(appointment);
                // console.log(new Date().getTime());
                // console.log(appointment.createdAt.getTime());
                // console.log(
                //     appointment.createdAt.getTime() + fifteenMinutesInMs
                // );

                if (appointment) {
                    appointment.statusId = "S2";
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Update appointment success!",
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage:
                            "Appointment has been activated or does not exist",
                    });
                }
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let postCancelBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.tokenRemove || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                console.log(data.tokenRemove, data.doctorId);
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        tokenRemove: data.tokenRemove,
                        [Op.or]: [{ statusId: "S1" }, { statusId: "S2" }],
                    },
                    raw: false,
                });
                console.log(appointment);

                if (appointment) {
                    appointment.statusId = "S4";
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Hủy lịch hẹn!",
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Lịch hẹn đã được hủy hoặc không tồn tại!",
                    });
                }
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

module.exports = {
    postBookAppointmentService,
    postVerifyBookAppointmentService,
    postCancelBookAppointmentService,
};
