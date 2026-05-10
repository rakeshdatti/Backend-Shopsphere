import express from 'express';
import Order from '../models/Orders.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { sendInvoiceMail } from '../utils/sendInvoiceMail.js';
import User from '../models/User.js';
import OrderItem from '../models/OrderItem.js';
const router = express.Router();

// placeholder orders routes


router.post("/",authMiddleware,async(req,res)=>{
    try{

        console.log("orders request",req.body)
        const {items,total,paymentMethod,shippingAddress}=req.body;

        if(!items || items.length===0){
            return res.status(400).json({message: "No order items"})
        }
        
        console.log("order creating")
        const order=await Order.create({
            userId: req.user.id,
            total,
            paymentMethod,
            shippingName:    shippingAddress.name,
            shippingAddress: shippingAddress.address,
            shippingCity:    shippingAddress.city,
        })


        await OrderItem.bulkCreate(
            items.map(i => ({
                orderId:   order.id,
                productId: i.productId,
                title:     i.title,
                price:     i.price,
                quantity:  i.quantity,
            }))
        )

        console.log("startt find user name email")
        const user = await User.findByPk(req.user.id);
        console.log("✅ User found:", user);  
        
        
        const fullOrder = { ...order.toJSON(), items };  // attach items for invoice

        if (user?.email) {
            sendInvoiceMail(order, user).catch((err) =>
                console.error("❌ Invoice mail failed:", err.message)
            );
        }
        console.log("order sucess",order)
        res.status(201).json(order)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})


router.get("/my-orders", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.findAll({              // ← FIXED: was OrderSchema.find()
            where:   { userId: req.user.id },             // ← FIXED: was req.user._id
            include: [{ model: OrderItem }],
            order:   [['createdAt', 'DESC']],
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
export default router;
