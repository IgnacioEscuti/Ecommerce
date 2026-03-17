import express from "express"
import mongoose from "mongoose"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"
import { engine } from "express-handlebars"
import path from "path"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")

app.engine("handlebars", engine())
app.set("view engine","handlebars")
app.set("views", path.join(process.cwd(),"src/views"))

app.use("/api/products",productsRouter)
app.use("/api/carts",cartsRouter)
app.use("/",viewsRouter)

app.listen(8080,()=>console.log("Servidor corriendo"))