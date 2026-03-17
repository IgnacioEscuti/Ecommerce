import { Router } from "express";
import Cart from "../models/cart.model.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.json({ status: "success", cartId: newCart._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error creando carrito" });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        const existingProduct = cart.products.find(p => p.product.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.json({ status: "success", message: "Producto agregado al carrito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error agregando producto" });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
        res.json({ status: "success", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al obtener carrito" });
    }
});

export default router;