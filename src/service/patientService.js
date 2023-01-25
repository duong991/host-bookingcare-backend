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
                let schedule = await db.Schedule.findOne({
                    where: {
                        doctorId: data.doctorId,
                        clinicId: data.clinicId,
                        timeType: data.timeType,
                        date: data.date,
                    },
                    raw: false,
                });

                if (schedule.currentNumber >= 5) {
                    resolve({
                        errCode: 2,
                        errMessage: "Lịch hẹn đã vượt quá số lượng cho phép!",
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
                            where: {
                                patientId: id,
                                date: data.date,
                                doctorId: data.doctorId,
                                [Op.or]: [
                                    { statusId: "S1" },
                                    { statusId: "S2" },
                                ],
                            },
                            defaults: {
                                statusId: "S1",
                                doctorId: data.doctorId,
                                patientId: id,
                                date: data.date,
                                timeType: data.timeType,
                                token: token,
                                tokenRemove: tokenRemove,
                                clinicId: data.clinicId,
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
                console.log(data);
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: +data.doctorId,
                        token: data.token,
                        statusId: "S1",
                    },
                    raw: false,
                });
                let timeType = appointment.timeType;
                let date = appointment.date;
                let clinicId = appointment.clinicId;
                if (appointment) {
                    let schedule = await db.Schedule.findOne({
                        where: {
                            timeType: timeType,
                            date: date,
                            clinicId: clinicId,
                            doctorId: data.doctorId,
                        },
                        raw: false,
                    });
                    if (schedule.currentNumber < schedule.maxNumber) {
                        // tăng số lượng lịch hẹn trong 1 khoảng thời gian lên 1
                        schedule.currentNumber++;
                        await schedule.save();
                        // Xác nhận lịch hẹn thành công
                        appointment.statusId = "S2";
                        await appointment.save();
                        resolve({
                            errCode: 0,
                            errMessage: "Xác nhận lịch hẹn thành công!",
                        });
                    } else {
                        resolve({
                            errCode: 0,
                            errMessage:
                                "Số lượng lịch hẹn có thể đặt trong khoảng thời gian này đã vượt quá giới hạn!",
                        });
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage:
                            "Lịch hẹn đã được xác nhận hoặc không tồn tại!",
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

                if (appointment) {
                    if (appointment.statusId === "S2") {
                        // nếu lịch hẹn đã được xác nhận, tiến hành giảm số lịch hẹn trong khoảng thời gian đó
                        let timeType = appointment.timeType;
                        let date = appointment.date;
                        let clinicId = appointment.clinicId;

                        let schedule = await db.Schedule.findOne({
                            where: {
                                timeType: timeType,
                                date: date,
                                clinicId: clinicId,
                                doctorId: data.doctorId,
                            },
                            raw: false,
                        });

                        schedule.currentNumber--;
                        schedule.save();
                    }
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
