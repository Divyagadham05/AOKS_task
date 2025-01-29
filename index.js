

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/shop", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define Product Schema & Model
const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    inStock: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

// User Registration Route
app.post("/api/users/register", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    console.log(`User Registered: ${name}, ${email}`);
    res.status(201).json({ message: "Registration successful" });
});

// Add Product Route
app.post("/api/products", async (req, res) => {
    try {
        const { title, price, category, inStock } = req.body;
        const product = new Product({ title, price, category, inStock });
        await product.save();
        res.status(201).json({ message: "Product added", product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch Electronics > $500 Sorted Descending
app.get("/api/products/electronics/high-price", async (req, res) => {
    try {
        const products = await Product.find({ category: "Electronics", price: { $gt: 500 } }).sort({ price: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
