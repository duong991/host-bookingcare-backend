import userService from "../service/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res
            .status(500)
            .json({ message: "Missing input parameters!", errCode: 1 });
    }
    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        userInfo: userData.userInfo ? userData.userInfo : {},
    });
};

let handleGetAllUser = async (req, res) => {
    try {
        let users = await userService.getAllUser(req.query);
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errCode: -1, errMessage: "Error from server" });
    }
};

let handleCreateNewUser = async (req, res) => {
    let message = await userService.CreateNewUser(req.body);
    return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
    let userId = req.body.id;
    if (!userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing input parameters!",
        });
    }
    let message = await userService.DeleteUser(userId);
    return res.status(200).json(message);
};

let handleUpdateUser = async (req, res) => {
    let data = req.body;
    let userId = data.id;
    if (!userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing input parameters!",
        });
    }
    let message = await userService.UpdateUser(data);
    return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
    try {
        let data = await userService.GetAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log("Get all code err: ", error);
        return res
            .status(200)
            .json({ errCode: -1, errMessage: "Error from server" });
    }
};

let getUserClinicById = async (req, res) => {
    try {
        let data = await userService.getUserClinicByIdService(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log("Get all code err: ", error);
        return res
            .status(200)
            .json({ errCode: -1, errMessage: "Error from server" });
    }
};

let forgotPassword = async (req, res) => {
    try {
        let data = await userService.forgotPasswordService(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log("Get all code err: ", error);
        return res
            .status(200)
            .json({ errCode: -1, errMessage: "Error from server" });
    }
};

let postVerifyResetPassword = async (req, res) => {
    try {
        let result = await userService.postVerifyResetPasswordService(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let changePassword = async (req, res) => {
    try {
        let result = await userService.changePasswordService(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

module.exports = {
    handleLogin,
    handleGetAllUser,
    handleCreateNewUser,
    handleDeleteUser,
    handleUpdateUser,
    getAllCode,
    getUserClinicById,
    forgotPassword,
    postVerifyResetPassword,
    changePassword,
};
