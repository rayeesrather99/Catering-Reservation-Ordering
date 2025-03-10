"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"
import ProductCard from "../components/ProductCard"

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`)
        setProducts(res.data)

        // Extract unique categories
        const uniqueCategories = [...new Set(res.data.map((product) => product.category))]
        setCategories(uniqueCategories)
      } catch (err) {
        setError("Failed to fetch products. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-8 mb-10 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Authentic Indian Catering for Your Special Events</h1>
          <p className="text-lg mb-6">
            Experience the rich flavors and traditions of Indian cuisine, prepared with love and care for your
            gatherings.
          </p>
          <button className="bg-white text-orange-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
            Explore Our Menu
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Menu</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full ${
              selectedCategory === "all" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home

