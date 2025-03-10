"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../config"
import { format } from "date-fns"
import toast from "react-hot-toast"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/orders`)
      setOrders(res.data)
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`${API_URL}/api/admin/orders/${orderId}`, { status })
      toast.success("Order status updated successfully")
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order status")
    }
  }

  const filteredOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter)

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full ${
              filter === "all" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("all")}
          >
            All Orders
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              filter === "pending" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              filter === "processing" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("processing")}
          >
            Processing
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              filter === "shipped" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("shipped")}
          >
            Shipped
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              filter === "delivered" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("delivered")}
          >
            Delivered
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              filter === "cancelled" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">Placed on: {format(new Date(order.createdAt), "PPP")}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-gray-600 font-semibold mb-2">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name: {order.shippingAddress.name}</p>
                      <p className="text-sm text-gray-600">Email: {order.shippingAddress.email}</p>
                      <p className="text-sm text-gray-600">Phone: {order.shippingAddress.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address: {order.shippingAddress.address}</p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <tr key={item._id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <img
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                className="h-12 w-12 object-cover rounded mr-3"
                              />
                              <span className="text-gray-600 ">{item.product.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">₹{item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-3 text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-6 border-t flex flex-wrap justify-between items-center">
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold ">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders

