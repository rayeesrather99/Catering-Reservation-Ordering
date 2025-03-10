const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Define schemas and models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
})

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: [String],
  createdAt: { type: Date, default: Date.now },
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  paymentMethod: { type: String, enum: ["cod", "online"], required: true },
  status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model("User", userSchema)
const Product = mongoose.model("Product", productSchema)
const Order = mongoose.model("Order", orderSchema)

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    const user = await User.findById(decoded.id)

    if (!user) {
      throw new Error()
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" })
  }
}

// Admin middleware
const admin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." })
  }
  next()
}

// Routes

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: "user", // Default role
    })

    await user.save()

    // Create and send token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create and send token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// User routes
app.get("/api/users/me", auth, async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address,
      role: req.user.role,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

app.put("/api/users/profile", auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body

    const user = await User.findById(req.user._id)

    if (name) user.name = name
    if (phone) user.phone = phone
    if (address) user.address = address

    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Product routes
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/products", auth, admin, async (req, res) => {
  try {
    const { name, description, price, category, image, ingredients } = req.body

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      ingredients,
    })

    await product.save()
    res.status(201).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

app.put("/api/products/:id", auth, admin, async (req, res) => {
  try {
    const { name, description, price, category, image, ingredients } = req.body

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    product.name = name
    product.description = description
    product.price = price
    product.category = category
    product.image = image
    product.ingredients = ingredients

    await product.save()
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

app.delete("/api/products/:id", auth, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    await product.remove()
    res.json({ message: "Product removed" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Order routes
app.post("/api/orders", auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: "pending",
    })

    await order.save()

    // Populate product details
    await order.populate("items.product")

    res.status(201).json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/orders/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product").sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin routes
app.get("/api/admin/orders", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product").populate("user", "name email").sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

app.put("/api/admin/orders/:id", auth, admin, async (req, res) => {
  try {
    const { status } = req.body

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.status = status
    await order.save()

    res.json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/admin/stats", auth, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const totalUsers = await User.countDocuments({ role: "user" })
    const totalProducts = await Product.countDocuments()

    const orders = await Order.find()
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/admin/recent-orders", auth, admin, async (req, res) => {
  try {
    const recentOrders = await Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(5)

    res.json(recentOrders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

