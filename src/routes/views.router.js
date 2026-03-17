import { Router } from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const router = Router();

router.get("/products", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await Product.paginate({}, { page, limit, lean: true });

  res.render("index", {
    products: result.docs,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage
  });
});


router.get("/products/:pid", async (req, res) => {
  const product = await Product.findById(req.params.pid).lean();

  res.render("product", { product });
});


router.get("/carts/:cid", async (req, res) => {
  const cart = await Cart.findById(req.params.cid)
    .populate("products.product")
    .lean();

  res.render("cart", { cart });
});

export default router;