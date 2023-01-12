import express from "express";
import userController from "../controller/userController";
import doctorController from "../controller/doctorController";
import patientController from "../controller/patientController";
import specialtyController from "../controller/specialtyController";
import clinicController from "../controller/clinicController";
import adminHospitalController from "../controller/adminHospitalController";

let router = express.Router();

let initAPIRouter = function (app) {
    router.post("/api/login", userController.handleLogin);
    router.get("/api/get-all-user", userController.handleGetAllUser);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.put("/api/update-user", userController.handleUpdateUser);
    router.get("/api/all-code", userController.getAllCode);
    router.get("/api/get-user-clinic-by-id", userController.getUserClinicById);

    router.get("/api/top-doctor-home", doctorController.getDoctorHome);
    router.get("/api/get-all-doctors", doctorController.getAllDoctor);
    router.post(
        "/api/update-detail-doctor",
        doctorController.updateDetailDoctor
    );
    router.get(
        "/api/get-detail-doctor-by-id",
        doctorController.getDetailDoctorById
    );

    router.get(
        "/api/get-markdown-by-id-doctor",
        doctorController.getMarkdownByIdDoctor
    );
    router.post(
        "/api/bulk-create-schedule",
        doctorController.bulkCreateSchedule
    );
    router.post("/api/delete-schedule", doctorController.deleteSchedule);
    router.get(
        "/api/get-schedule-doctor-by-date",
        doctorController.getScheduleDoctorByDate
    );

    router.get(
        "/api/get-extra-info-doctor-by-id",
        doctorController.getExtraInfoDoctorById
    );

    router.get(
        "/api/get-profile-doctor-by-id",
        doctorController.getProfileDoctorById
    );

    router.get(
        "/api/get-list-patient-for-doctor",
        doctorController.getListPatientsForDoctor
    );

    router.post("/api/send-remedy", doctorController.sendRemedy);

    router.post(
        "/api/patient-book-appointment",
        patientController.postBookAppointment
    );

    router.post(
        "/api/verify-book-appointment",
        patientController.postVerifyBookAppointment
    );

    router.post(
        "/api/cancel-book-appointment",
        patientController.postCancelBookAppointment
    );

    // xây dựng api quản lý chuyên khoa
    router.post(
        "/api/create-new-specialty",
        specialtyController.createNewSpecialty
    );
    router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
    router.get(
        "/api/get-detail-specialty-by-id",
        specialtyController.getDetailSpecialtyById
    );

    router.put(
        "/api/update-detail-specialty-by-id",
        specialtyController.updateDetailSpecialtyById
    );
    router.delete(
        "/api/delete-specialty-by-id",
        specialtyController.deleteDetailSpecialtyById
    );

    // xây dựng api quản lý phòng khám
    router.post("/api/create-new-clinic", clinicController.createNewClinic);
    router.get("/api/get-all-clinic", clinicController.getAllClinic);
    router.get(
        "/api/get-detail-clinic-by-id",
        clinicController.getDetailClinicById
    );
    router.put(
        "/api/update-detail-clinic-by-id",
        clinicController.updateDetailClinicById
    );
    router.delete(
        "/api/delete-clinic-by-id",
        clinicController.deleteDetailClinicById
    );

    // api quản lý lịch hẹn bác sĩ dành cho admin bệnh viện
    // router.post("/api/get-all-doctor-have-schedule-of-day", clinicController.createNewClinic);

    router.get(
        "/api/get-all-doctor-by-clinicId",
        adminHospitalController.getAllDoctorByClinicId
    );

    router.get(
        "/api/get-clinicId-for-admin-hospital",
        adminHospitalController.getClinicIdForAdminHospital
    );

    router.post("/api/check-doctors", adminHospitalController.checkDoctors);

    return app.use("/", router);
};

module.exports = initAPIRouter;
