import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const User = sequelize.define('User', {
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
        otp: { type: DataTypes.STRING },
        otpExpiry: { type: DataTypes.DATE },
        resetPasswordToken: { type: DataTypes.STRING, defaultValue: null },
        resetPasswordExpiry: { type: DataTypes.DATE, defaultValue: null },
    },{timestamps: true});

export default User;