import db from "../models/index";
import { createNewUser, getAllUser } from "../service/CRUD_user";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log("--------------------------------------------------");
        console.log(data);
        console.log("--------------------------------------------------");
        return res.render("homepage.ejs", {
            data: JSON.stringify(data),
        });
    } catch (error) {
        console.log(error);
    }
};

let getSignupPage = async (req, res) => {
    return res.render("signUpPage.ejs");
};

let createUser = async (req, res) => {
    let data = await req.body;
    createNewUser(data);
    return res.redirect("/display_user");
};

let getDisplayUserPage = async (req, res) => {
    let data = await getAllUser();
    console.log(data);
    return res.render("displayUserPage.ejs", { data: data });
};

module.exports = {
    getHomePage,
    getSignupPage,
    createUser,
    getDisplayUserPage,
};
