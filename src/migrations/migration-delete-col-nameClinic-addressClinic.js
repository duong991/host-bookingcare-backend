"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // logic for transforming into the new state

        await queryInterface.removeColumn("Doctor_Infos", "nameClinic");
        await queryInterface.removeColumn("Doctor_Infos", "addressClinic");
    },

    down: async (queryInterface, Sequelize) => {
        // logic for reverting the changes
        await queryInterface.addColumn(
            "Doctor_Infos",
            "nameClinic",
            Sequelize.STRING
        );
        await queryInterface.addColumn(
            "Doctor_Infos",
            "addressClinic",
            Sequelize.STRING
        );
    },
};
