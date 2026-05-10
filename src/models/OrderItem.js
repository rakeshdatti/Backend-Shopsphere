import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const OrderItem = sequelize.define('OrderItem', {
  orderId:   { type: DataTypes.INTEGER },
  productId: { type: DataTypes.INTEGER },   
  title:     { type: DataTypes.STRING },
  price:     { type: DataTypes.FLOAT },
  quantity:  { type: DataTypes.INTEGER },
});

export default OrderItem;