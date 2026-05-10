import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Order = sequelize.define('Order', {
  userId:          { type: DataTypes.INTEGER, allowNull: false },
  total:           { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod:   { type: DataTypes.STRING, allowNull: false },
  status:          { type: DataTypes.STRING, defaultValue: 'Processing' },
  shippingName:    { type: DataTypes.STRING },
  shippingAddress: { type: DataTypes.STRING },
  shippingCity:    { type: DataTypes.STRING },
}, { timestamps: true });

export default Order;