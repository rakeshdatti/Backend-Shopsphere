import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Cart = sequelize.define('Cart', {
  userId: { type: DataTypes.INTEGER },
});

export default Cart;