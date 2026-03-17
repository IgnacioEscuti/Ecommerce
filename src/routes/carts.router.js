import { Router } from "express"
import Cart from "../models/cart.model.js";

const router = Router()

router.post("/", async (req,res)=>{
 const cart = await Cart.create({products:[]})
 res.json(cart)
})

router.get("/:cid", async(req,res)=>{
 const cart = await Cart.findById(req.params.cid)
 .populate("products.product")
 res.json(cart)
})

router.post("/:cid/products/:pid", async(req,res)=>{

 const {cid,pid} = req.params

 const cart = await Cart.findById(cid)

 const existing = cart.products.find(
  p=>p.product.toString()===pid
 )

 if(existing){
  existing.quantity++
 }else{
  cart.products.push({product:pid,quantity:1})
 }

 await cart.save()

 res.json(cart)

})

router.delete("/:cid/products/:pid", async(req,res)=>{

 const cart = await Cart.findById(req.params.cid)

 cart.products = cart.products.filter(
  p => p.product.toString() !== req.params.pid
 )

 await cart.save()

 res.json({status:"producto eliminado"})

})

router.put("/:cid", async(req,res)=>{

 const {products} = req.body

 const cart = await Cart.findByIdAndUpdate(
  req.params.cid,
  {products},
  {new:true}
 )

 res.json(cart)

})

router.put("/:cid/products/:pid", async(req,res)=>{

 const {quantity} = req.body

 const cart = await Cart.findById(req.params.cid)

 const product = cart.products.find(
  p=>p.product.toString()===req.params.pid
 )

 product.quantity=quantity

 await cart.save()

 res.json(cart)

})


router.delete("/:cid", async(req,res)=>{

 const cart = await Cart.findById(req.params.cid)

 cart.products=[]

 await cart.save()

 res.json({status:"carrito vaciado"})

})

export default router