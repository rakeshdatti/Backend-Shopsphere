import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Product = sequelize.define('Product', {
  title:       { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price:       { type: DataTypes.FLOAT, allowNull: false },
  category:    { type: DataTypes.STRING },
  image:       { type: DataTypes.STRING },
}, { timestamps: true });

export default Product;