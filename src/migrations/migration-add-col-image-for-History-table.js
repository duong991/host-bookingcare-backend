"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // logic for transforming into the new state

        await queryInterface.addColumn(
            "Histories",
            "image",
            Sequelize.BLOB("long")
        );
    },

    down: async (queryInterface, Sequelize) => {
        // logic for reverting the changes
        await queryInterface.removeColumn("Histories", "image");
    },
};
