"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // logic for transforming into the new state

        await queryInterface.removeColumn("Histories", "files");
    },

    down: async (queryInterface, Sequelize) => {
        // logic for reverting the changes
        await queryInterface.addColumn("Histories", "files", Sequelize.TEXT);
    },
};
