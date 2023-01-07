import db from "../models/index";
import _ from "lodash";

let createNewSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.descriptionMarkdown ||
                !data.descriptionHTML ||
                !data.imageBase64
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters parameters",
                });
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionMarkDown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                });

                resolve({ errCode: 0, errMessage: "Ok" });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let getAllSpecialtyService = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (type === "ALL") {
                data = await db.Specialty.findAll();
                if (data && data.length > 0) {
                    data.map((item) => {
                        item.image = Buffer.from(item.image, "base64").toString(
                            "binary"
                        );
                        return item;
                    });
                }
            } else if (type === "Name") {
                data = await db.Specialty.findAll({
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

let getDetailSpecialtyByIdService = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({ errCode: 1, errMessage: "Missing parameter" });
            } else {
                let data = await db.Specialty.findOne({
                    where: { id: id },
                    attributes: ["descriptionHTML", "descriptionMarkDown"],
                });
                if (data) {
                    let doctorSpecialty = [];
                    if (location === "All") {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: { specialtyId: id },
                            attributes: ["doctorId", "provinceId"],
                        });
                    } else {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: { specialtyId: id, provinceId: location },
                            attributes: ["doctorId", "provinceId"],
                        });
                    }

                    data = { ...data, doctorSpecialty };
                }
                resolve({ errCode: 0, errMessage: "ok", data: data });
            }
        } catch (error) {
            console.log(error);
            reject(error);
            cc;
        }
    });
};

let updateDetailSpecialtyByIdService = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({ errCode: 1, errMessage: "Missing parameter" });
            } else {
                let dataUpdate = {
                    name: data.name,
                    descriptionMarkDown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                };
                if (data.imageBase64) {
                    dataUpdate.image = data.imageBase64;
                }
                if (data.descriptionHTML) {
                    dataUpdate.descriptionHTML = data.descriptionHTML;
                }

                await db.Specialty.update(dataUpdate, {
                    where: { id: data.id },
                });

                if (data) {
                    resolve({ errCode: 0, errMessage: "ok", data: data });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Id specialty not found",
                    });
                }
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

let deleteDetailSpecialtyByIdService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({ errCode: 1, errMessage: "Missing parameter" });
            } else {
                await db.Specialty.destroy({
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
    createNewSpecialtyService,
    getAllSpecialtyService,
    getDetailSpecialtyByIdService,
    updateDetailSpecialtyByIdService,
    deleteDetailSpecialtyByIdService,
};
