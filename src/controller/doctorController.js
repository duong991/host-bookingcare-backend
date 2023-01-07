import doctorService from "../service/doctorService";

let getDoctorHome = async (req, res) => {
    let limit = req.query.limit ? req.query.limit : 10;
    try {
        let response = await doctorService.getTopDoctorHome(limit);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let getAllDoctor = async (req, res) => {
    try {
        let response = await doctorService.getAllDoctorsService();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let updateDetailDoctor = async (req, res) => {
    try {
        let response = await doctorService.updateDetailDoctorService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let getDetailDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDetailDoctorByIdService(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let getMarkdownByIdDoctor = async (req, res) => {
    try {
        let data = await doctorService.getMarkdownByIdDoctorService(
            req.query.id
        );
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let bulkCreateSchedule = async (req, res) => {
    try {
        let result = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let getScheduleDoctorByDate = async (req, res) => {
    try {
        let result = await doctorService.getScheduleDoctorByDateService(
            req.query.doctorId,
            req.query.date
        );
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let getExtraInfoDoctorById = async (req, res) => {
    try {
        let result = await doctorService.getExtraInfoDoctorByIdService(
            req.query.doctorId
        );
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let getProfileDoctorById = async (req, res) => {
    try {
        let result = await doctorService.getProfileDoctorByIdService(
            req.query.doctorId
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
    getDoctorHome,
    getAllDoctor,
    updateDetailDoctor,
    getDetailDoctorById,
    getMarkdownByIdDoctor,
    bulkCreateSchedule,
    getScheduleDoctorByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById,
};
