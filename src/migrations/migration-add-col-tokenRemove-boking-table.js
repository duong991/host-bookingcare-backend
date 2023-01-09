"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // logic for transforming into the new state

        await queryInterface.addColumn(
            "Bookings",
            "tokenRemove",
            Sequelize.STRING
        );
    },

    down: async (queryInterface, Sequelize) => {
        // logic for reverting the changes
        await queryInterface.removeColumn("Bookings", "tokenRemove");
    },
};
