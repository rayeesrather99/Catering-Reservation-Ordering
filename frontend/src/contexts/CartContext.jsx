"use client"

import { createContext, useState, useContext, useEffect } from "react"
import toast from "react-hot-toast"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  const [total, setTotal] = useState(0)

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))

    const newTotal = cart.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)

    setTotal(newTotal)
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id)

      if (existingItem) {
        toast.success("Item quantity updated in cart")
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        toast.success("Item added to cart")
        return [...prevCart, { ...product, quantity }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId))
    toast.success("Item removed from cart")
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return

    setCart((prevCart) => prevCart.map((item) => (item._id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const value = {
    cart,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount: cart.reduce((count, item) => count + item.quantity, 0),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

