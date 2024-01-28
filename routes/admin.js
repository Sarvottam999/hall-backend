const express = require("express");
const admin = require("../middleware/admin");
const Product = require("../models/product");
const adminRouter = express.Router();


// add product
adminRouter.post("/admin/add-product",admin, async (req, res) => {
    try {
        const { name,  description,images,   quantity, price,category } = req.body;

       

        let product = new Product({ name, price, description, quantity, category });

        product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// get all products
adminRouter.get("/admin/get-products",admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//dleete product
adminRouter.delete("/admin/delete-product",admin, async (req, res) => {
    try {
        const {id} = req.body;
        const product = await Product.findByIdAndDelete(id);
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = adminRouter;