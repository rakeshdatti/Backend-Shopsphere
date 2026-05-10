import express from "express";
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ADD TO CART
router.post("/add", authMiddleware, async (req, res) => {
    try {
        console.log("Cart request body:", req.body);
        const { productId, title, price, image } = req.body;

        // Find or create cart for this user
        let [cart] = await Cart.findOrCreate({ where: { userId: req.user.id } });
        console.log("cart", cart);

        // Check if item already exists in cart
        const existingItem = await CartItem.findOne({
            where: { cartId: cart.id, productId }
        });
        console.log(existingItem);

        if (existingItem) {
            console.log("Product found, increasing quantity");
            existingItem.quantity += 1;
            await existingItem.save();
        } else {
            console.log("Product not found, adding to cart");
            await CartItem.create({ cartId: cart.id, productId, title, price, image, quantity: 1 });
        }

        const items = await CartItem.findAll({ where: { cartId: cart.id } });
        console.log("cart after saving", items);
        res.json({ ...cart.toJSON(), items });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


// GET CART
router.get("/", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            where: { userId: req.user.id },
            include: [{ model: CartItem }],
        });
        res.json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// REMOVE ITEM
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
    try {
        console.log("request came to delete the cart");
        const cart = await Cart.findOne({ where: { userId: req.user.id } });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        console.log("Request", req.params.productId);
        await CartItem.destroy({
            where: { cartId: cart.id, productId: req.params.productId }
        });

        const items = await CartItem.findAll({ where: { cartId: cart.id } });
        console.log("cart after removing", items);
        res.json({ ...cart.toJSON(), items });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// INCREASE QUANTITY
router.put("/increase/:productId", authMiddleware, async (req, res) => {
    try {
        console.log("enter increase functionality");
        const cart = await Cart.findOne({ where: { userId: req.user.id } });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = await CartItem.findOne({
            where: { cartId: cart.id, productId: req.params.productId }
        });
        if (!item) return res.status(404).json({ message: "Item not found in cart" });

        item.quantity += 1;
        await item.save();

        const items = await CartItem.findAll({ where: { cartId: cart.id } });
        res.json({ ...cart.toJSON(), items });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// DECREASE QUANTITY
router.put("/decrease/:productId", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ where: { userId: req.user.id } });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = await CartItem.findOne({
            where: { cartId: cart.id, productId: req.params.productId }
        });
        if (!item) return res.status(404).json({ message: "Item not found in cart" });

        if (item.quantity === 1) {
            await item.destroy();  // remove row completely
        } else {
            item.quantity -= 1;
            await item.save();
        }

        const items = await CartItem.findAll({ where: { cartId: cart.id } });
        res.json({ ...cart.toJSON(), items });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;