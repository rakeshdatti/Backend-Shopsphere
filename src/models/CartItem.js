import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const CartItem = sequelize.define('CartItem', {
  cartId:    { type: DataTypes.INTEGER },
  productId: { type: DataTypes.INTEGER },   
  title:     { type: DataTypes.STRING },
  price:     { type: DataTypes.FLOAT },
  image:     { type: DataTypes.STRING },
  quantity:  { type: DataTypes.INTEGER, defaultValue: 1 },
});

export default CartItem;