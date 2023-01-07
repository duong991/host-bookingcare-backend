import db from "../models/index";
import _ from "lodash";

let createNewClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.address ||
                !data.descriptionMarkdown ||
                !data.descriptionHTML ||
                !data.imageBase64 ||
                !data.selectedSpecialties
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters parameters",
                });
            } else {
                let clinic = await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionMarkDown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                });
                let specialtyOfClinic = data.selectedSpecialties;
                specialtyOfClinic.map(async (item) => {
                    await db.Clinic_Specialty.create({
                        clinicId: clinic.id,
                        specialtyId: item,
                    });
                });

                resolve({ errCode: 0, errMessage: "Ok" });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let getAllClinicService = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (type === "ALL") {
                data = await db.Clinic.findAll();
                if (data && data.length > 0) {
                    data.map((item) => {
                        item.image = Buffer.from(item.image, "base64").toString(
                            "binary"
                        );
                        return item;
                    });
                }
            } else if (type === "Name") {
                data = await db.Clinic.findAll({
                    attributes: ["id", "name"],
                });
            }
            resolve({ errCode: 0, errMessage: "ok", data: data });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let getDetailClinicByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({ errCode: 1, errMessage: "Missing parameter" });
            } else {
                let data = await db.Clinic.findOne({
                    where: { id: id },
                });

                if (data) {
                    // chuyển hình ảnh từ dạng Buffer sang string
                    data.image = Buffer.from(data.image, "base64").toString(
                        "binary"
                    );
                    // lấy ra danh sach id chuyên khoa thuộc bệnh viện
                    let specialtyOfClinic = [];
                    specialtyOfClinic = await db.Clinic_Specialty.findAll({
                        where: { clinicId: id },
                        attributes: ["specialtyId"],
                    });
                    // chuyển dữ liệu lấy được thành mảng các id
                    if (specialtyOfClinic && specialtyOfClinic.length > 0) {
                        specialtyOfClinic = specialtyOfClinic.map(
                            (item) => item.specialtyId
                        );
                    }

                    data = { ...data, specialtyOfClinic };
                }
                resolve({ errCode: 0, errMessage: "ok", data: data });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let updateDetailClinicByIdService = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({ errCode: 1, errMessage: "Missing parameter" });
            } else {
                let dataUpdate = {
                    name: data.name,
                    address: data.address,
                    descriptionMarkDown: data.descriptionMarkdown,
                };
                if (data.imageBase64) {
                    dataUpdate.image = data.imageBase64;
                }
                if (data.descriptionHTML) {
                    dataUpdate.descriptionHTML = data.descriptionHTML;
                }

                await db.Clinic.update(
                    dataUpdate,

                    { where: { id: data.id } }
                );
                await db.Clinic_Specialty.destroy({
                    where: { clinicId: data.id },
                });
                let specialtyOfClinic = data.selectedSpecialties;
                specialtyOfClinic.map(async (item) => {
                    await db.Clinic_Specialty.create({
                        clinicId: data.id,
                        specialtyId: item,
                    });
                });
                if (data) {
                    resolve({ errCode: 0, errMessage: "ok", data: data });
                } else {
                    resolve({ errCode: 2, errMessage: "Id clinic not found" });
                }
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let deleteDetailClinicByIdService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({ errCode: 1, errMessage: "Missing parameter" });
            } else {
                await db.Clinic_Specialty.destroy({
                    where: { clinicId: id },
                });
                await db.Clinic.destroy({
                    where: { id: id },
                });
                resolve({ errCode: 0, errMessage: "ok" });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

module.exports = {
    createNewClinicService,
    getAllClinicService,
    getDetailClinicByIdService,
    updateDetailClinicByIdService,
    deleteDetailClinicByIdService,
};
