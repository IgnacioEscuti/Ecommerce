
import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const router = Router();


router.get("/", async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render("home", {
            title: "Productos",
            products
        });
    } catch (error) {
        console.error("Error cargando home:", error);
        res.status(500).send("Error al cargar productos");
    }
});


router.get("/products", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        const filter = {};
        if (query) {
            const [key, value] = query.split(":");
            if (key && value) filter[key] = isNaN(value) ? value : Number(value);
        }

        const sortOption = {};
        if (sort === "asc") sortOption.price = 1;
        if (sort === "desc") sortOption.price = -1;

        const result = await Product.paginate(filter, {
            page,
            limit,
            sort: sortOption,
            lean: true
        });

        res.render("products", {
            title: "Productos",
            products: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}` : null
        });
    } catch (error) {
        console.error("Error cargando productos:", error);
        res.status(500).send("Error al cargar productos");
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) return res.status(404).send("Producto no encontrado");
        res.render("product", { product });
    } catch (error) {
        console.error("Error cargando detalle:", error);
        res.status(500).send("Error al cargar producto");
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).send("CartId inválido");
        }

        const cart = await Cart.findById(cid).populate("products.product").lean();
        if (!cart) return res.status(404).send("Carrito no encontrado");

        cart.products = cart.products.filter(p => p.product !== null);

        res.render("cart", { cart });
    } catch (error) {
        console.error("Error cargando carrito:", error);
        res.status(500).send("Error al cargar carrito");
    }
});

export default router;