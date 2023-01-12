import adminHospitalService from "../service/adminHospitalService";

let getAllDoctorByClinicId = async (req, res) => {
    try {
        let result = await adminHospitalService.getAllDoctorByClinicIdService(
            req.query.clinicId
        );
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let getClinicIdForAdminHospital = async (req, res) => {
    try {
        let result =
            await adminHospitalService.getClinicIdForAdminHospitalService(
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

let checkDoctors = async (req, res) => {
    try {
        let result = await adminHospitalService.checkDoctorService(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};
module.exports = {
    getAllDoctorByClinicId,
    getClinicIdForAdminHospital,
    checkDoctors,
};
