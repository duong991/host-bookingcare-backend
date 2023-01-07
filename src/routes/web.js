import express from "express";
import homeController from "../controller/homeController";
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/signup", homeController.getSignupPage);
    router.post("/crud_test", homeController.createUser);
    router.get("/display_user", homeController.getDisplayUserPage);
    return app.use("/", router);
};

module.exports = initWebRoutes;
