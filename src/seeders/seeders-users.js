"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Users", [
            {
                email: "gnoud9901@gmail.com",
                password: "Hello!@#", //plant text
                fullName: "Đồng Minh Dương",
                address: "HCM",
                gender: "1",
                phoneNumber: "12314123",
                positionId: "doctor",
                image: null,
                gender: 1,
                roleId: "R1",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Users", null, {});
    },
};
