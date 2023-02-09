import db from "../models/index";
import _ from "lodash";
const sequelize = require("sequelize");

let getAllDoctorByClinicIdService = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                let data = [];
                data = await db.Doctor_Info.findAll({
                    where: { clinicId: clinicId },
                    attributes: ["doctorId"],
                    include: [
                        {
                            model: db.User,
                            attributes: ["fullName"],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                resolve({ errCode: 0, errMessage: "Ok", data: data });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let getClinicIdForAdminHospitalService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                let data = [];
                data = await db.User_Clinic.findOne({
                    where: { userId: id },
                    attributes: ["clinicId"],
                });
                resolve({ errCode: 0, errMessage: "Ok", data: data });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let checkDoctorService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctors || !data.currentDate || !data.clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                let date = "" + data.currentDate;
                let doctors = data.doctors;
                let dataFromDB = [];

                dataFromDB = [
                    ...(await db.Schedule.findAll({
                        where: {
                            date: date,
                            clinicId: data.clinicId,
                        },
                        attributes: [
                            [
                                sequelize.fn(
                                    "DISTINCT",
                                    sequelize.col("doctorId")
                                ),
                                "doctorId",
                            ],
                        ],
                    })),
                ].map((doctor) => doctor.doctorId);

                let result = checkDoctors(doctors, dataFromDB);

                resolve({ errCode: 0, errMessage: "Ok", data: result });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

function binarySearch(arr, x) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === x) {
            return true;
        } else if (arr[mid] < x) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return false;
}

function checkDoctors(doctors, dataFromDB) {
    let checkResult = [];
    // Sắp xếp mảng các ID bác sĩ trước khi sử dụng binary search

    let sortedDataFromDB = dataFromDB.sort((a, b) => a - b);
    let sumOfValueTrue = 0;
    for (let i = 0; i < doctors.length; i++) {
        if (binarySearch(sortedDataFromDB, doctors[i])) {
            checkResult.push({ id: doctors[i], value: true });
            sumOfValueTrue++;
        } else {
            checkResult.push({ id: doctors[i], value: false });
        }
    }
    return checkResult;
}

let getAllBookingService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.currentDate || !data.clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                let date = "" + data.currentDate;
                let clinicId = data.clinicId;

                let result = await db.Booking.findAll({
                    where: { date: date, clinicId: clinicId, statusId: "S2" },
                    attributes: ["id", "doctorId", "patientId"],
                    include: [
                        {
                            model: db.User,
                            as: "patientData",
                            attributes: ["email", "fullName", "phoneNumber"],
                        },
                        {
                            model: db.User,
                            as: "doctorData",
                            attributes: ["email", "fullName"],
                        },
                        {
                            model: db.Allcode,
                            as: "timeTypeDataPatient",
                            attributes: ["valueEn", "valueVi"],
                        },
                    ],

                    raw: false,
                    nest: true,
                });
                resolve({ errCode: 0, errMessage: "Ok", data: result });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let deleteBookingService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                let result = await db.Booking.findOne({
                    where: { id: data.id },

                    raw: false,
                });
                result.statusId = "S4";
                await result.save();
                resolve({ errCode: 0, errMessage: "Ok" });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

module.exports = {
    getAllDoctorByClinicIdService,
    getClinicIdForAdminHospitalService,
    checkDoctorService,
    getAllBookingService,
    deleteBookingService,
};
