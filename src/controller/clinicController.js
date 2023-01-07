import clinicService from "../service/clinicService";

let createNewClinic = async (req, res) => {
    try {
        let result = await clinicService.createNewClinicService(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let getAllClinic = async (req, res) => {
    try {
        let result = await clinicService.getAllClinicService(req.query.type);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let getDetailClinicById = async (req, res) => {
    try {
        let result = await clinicService.getDetailClinicByIdService(
            req.query.id
        );
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let updateDetailClinicById = async (req, res) => {
    try {
        let result = await clinicService.updateDetailClinicByIdService(
            req.body
        );
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};
let deleteDetailClinicById = async (req, res) => {
    try {
        console.log(req.body.id);
        let result = await clinicService.deleteDetailClinicByIdService(
            req.body.id
        );
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

module.exports = {
    createNewClinic,
    getAllClinic,
    getDetailClinicById,
    updateDetailClinicById,
    deleteDetailClinicById,
};
