"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../config"
import toast from "react-hot-toast"

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    ingredients: "",
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/${id}`)
        const product = res.data

        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          image: product.image,
          ingredients: product.ingredients ? product.ingredients.join(", ") : "",
        })
      } catch (err) {
        setError("Failed to fetch product details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Format the data
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        ingredients: formData.ingredients
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      }

      await axios.put(`${API_URL}/api/products/${id}`, productData)
      toast.success("Product updated successfully!")
      navigate("/admin/products")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

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
        <button onClick={() => navigate("/admin/products")} className="mt-4 btn-primary">
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="price" className="block text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select a category</option>
                <option value="Appetizers">Appetizers</option>
                <option value="Main Course">Main Course</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
                <option value="Breads">Breads</option>
                <option value="Rice">Rice</option>
                <option value="Thali">Thali</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="input-field"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Enter a valid image URL</p>
          </div>

          <div className="mb-6">
            <label htmlFor="ingredients" className="block text-gray-700 mb-2">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Enter ingredients separated by commas"
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Updating..." : "Update Product"}
            </button>

            <button type="button" onClick={() => navigate("/admin/products")} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct

