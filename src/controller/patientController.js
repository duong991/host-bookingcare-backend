import patientService from "../service/patientService";

let postBookAppointment = async (req, res) => {
    try {
        let result = await patientService.postBookAppointmentService(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .json({ errorCode: -1, message: "Error from server..." });
    }
};

let postVerifyBookAppointment = async (req, res) => {
    try {
        let result = await patientService.postVerifyBookAppointmentService(
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

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment,
};
