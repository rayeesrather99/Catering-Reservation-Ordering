"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import axios from "axios"
import { API_URL } from "../config"
import { Minus, Plus } from "lucide-react"

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/${id}`)
        setProduct(res.data)
      } catch (err) {
        setError("Failed to fetch product details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error || "Product not found"}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-orange-600 text-2xl font-bold mb-4">₹{product.price.toFixed(2)}</p>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {product.ingredients && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
              <ul className="list-disc list-inside text-gray-700">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Quantity</h2>
            <div className="flex items-center">
              <button
                onClick={decrementQuantity}
                className="p-2 border border-gray-300 rounded-l-md"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 border-t border-b border-gray-300 text-center min-w-[50px]">{quantity}</span>
              <button onClick={incrementQuantity} className="p-2 border border-gray-300 rounded-r-md">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button onClick={handleAddToCart} className="btn-primary w-full py-3 text-lg">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

