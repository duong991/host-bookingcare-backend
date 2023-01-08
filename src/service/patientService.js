import db from "../models/index";
import _ from "lodash";
import emailService from "./emailService";
require("dotenv").config();
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
};

let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.doctorId ||
                !data.date ||
                !data.timeType ||
                !data.fullName ||
                !data.selectedGender
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                let token = uuidv4();
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
                });

                // create a booking record
                let { id } = user;
                if (user) {
                    await db.Booking.findOrCreate({
                        where: { patientId: id },
                        defaults: {
                            statusId: "S1",
                            doctorId: data.doctorId,
                            patientId: id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                        },
                    });
                }

                resolve({ errCode: 0, message: "Save info patient success" });
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

                resolve({
                    errCode: 0,
                    errMessage: "Update appointment success!",
                });
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

module.exports = {
    postBookAppointmentService,
    postVerifyBookAppointmentService,
};
