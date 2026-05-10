import sequelize from './db.js';
import User from "../src/models/User.js";
import Product from "../src/models/Product.js";
import Order from "../src/models/Orders.js";
import OrderItem from "../src/models/OrderItem.js";
import Cart from "../src/models/Cart.js";
import CartItem from "../src/models/CartItem.js";

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });


Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });


const ConnectDB= async () =>{
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connection has been established successfully.');
    }catch(error){
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}


export default ConnectDB;