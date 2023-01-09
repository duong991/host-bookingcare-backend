import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import Sequelize from "sequelize";

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email); //  check email exist
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: [
                        "id",
                        "email",
                        "password",
                        "roleId",
                        "fullName",
                    ],
                    where: { email: email },
                    raw: true,
                });
                if (user) {
                    let check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.message = "Oke";
                        delete user.password;
                        userData.userInfo = user;
                    } else {
                        userData.errCode = 3;
                        userData.message = "Password mismatch";
                    }
                } else {
                    userData.errCode = 2;
                    userData.message = `User not found`;
                }
            } else {
                userData.errCode = 1;
                userData.message = `Your Email isn't exist in system. Plz try again`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email },
            });
            user ? resolve(true) : resolve(false);
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let type = data.type;
            if (!type) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                let users = "";
                let clinic = "";
                if (type === "All") {
                    users = await db.User.findAll({
                        attributes: { exclude: ["password"] },
                        where: { roleId: { [Sequelize.Op.not]: "R3" } },
                    });
                } else {
                    users = await db.User.findAll({
                        attributes: { exclude: ["password"] },
                        where: { roleId: type },
                    });
                }

                // Lấy ra id Clinic
                const data = await Promise.all(
                    users.map(async (user) => {
                        if (user.roleId === "R4") {
                            clinic = await db.User_Clinic.findOne({
                                attributes: ["clinicId"],
                                where: { userId: user.id },
                            });
                            return { ...user, clinic: clinic.clinicId };
                        }
                        return { ...user };
                    })
                );

                resolve({ errCode: 0, message: "Ok", users: data });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let CreateNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //let check email exists
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage:
                        "Your email address already exists. Please try again!",
                });
            } else {
                // let hash password
                let hashPassword = bcrypt.hashSync(data.password, salt);
                let role = data.role;

                let userDb = {
                    email: data.email,
                    password: hashPassword,
                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    positionId: data.position,
                    gender: data.gender,
                    roleId: role,
                    image: data.image,
                };

                // create user with sequelize
                const account = await db.User.create(userDb);

                if (role === "R4" && data.clinic) {
                    await db.User_Clinic.create({
                        userId: account.id,
                        clinicId: data.clinic,
                    });
                }
                //return message
                resolve({ errCode: 0, message: "Ok" });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let DeleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false,
            });
            if (!user) {
                resolve({ errCode: 1, errMessage: "User not found" });
            } else {
                await user.destroy();
                resolve({ errCode: 0, errMessage: "Ok" });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let UpdateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (user) {
                user.fullName = data.fullName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.gender = data.gender;
                user.roleId = data.role;
                if (data.image) {
                    user.image = data.image;
                }
                await user.save();

                if (data.role === "R4" && data.clinic) {
                    const [userClinic, created] =
                        await db.User_Clinic.findOrCreate({
                            where: {
                                userId: data.id,
                            },
                            defaults: {
                                userId: data.id,
                                clinicId: data.clinic,
                            },
                            raw: false,
                        });
                    if (!created) {
                        userClinic.clinicId = data.clinic;
                    }
                    await userClinic.save();
                }

                resolve({ errCode: 0, message: "Ok" });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "User not found",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let GetAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errorCode: 1,
                    errMessage: "Missing required parameters !",
                });
            } else {
                let response = {};
                let allCode = await db.Allcode.findAll({
                    where: { type: typeInput },
                });
                response.errCode = 0;
                response.data = allCode;
                resolve(response);
            }
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    handleUserLogin,
    getAllUser,
    CreateNewUser,
    DeleteUser,
    UpdateUser,
    GetAllCodeService,
};
