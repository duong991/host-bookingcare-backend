"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Booking.belongsTo(models.User, {
                foreignKey: "patientId",
                targetId: "id",
                as: "patientData",
            });

            Booking.belongsTo(models.User, {
                foreignKey: "doctorId",
                targetId: "id",
                as: "doctorData",
            });

            Booking.belongsTo(models.Allcode, {
                foreignKey: "timeType",
                targetKey: "keyMap",
                as: "timeTypeDataPatient",
            });
        }
    }
    Booking.init(
        {
            statusId: DataTypes.STRING,
            clinicId: DataTypes.INTEGER,
            doctorId: DataTypes.INTEGER,
            patientId: DataTypes.INTEGER,
            date: DataTypes.STRING,
            timeType: DataTypes.STRING,
            token: DataTypes.STRING,
            tokenRemove: DataTypes.STRING,
            reason: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Booking",
        }
    );
    return Booking;
};
