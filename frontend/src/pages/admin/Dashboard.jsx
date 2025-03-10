"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../config"
import { ShoppingBag, Users, DollarSign, Package } from "lucide-react"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalProducts: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/stats`),
          axios.get(`${API_URL}/api/admin/recent-orders`),
        ])

        setStats(statsRes.data)
        setRecentOrders(ordersRes.data)
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <h3 className="text-gray-700 text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-gray-700 text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-gray-700 text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <h3 className="text-gray-700 text-2xl font-bold">{stats.totalProducts}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Recent Orders</h2>
            <Link to="/admin/orders" className="text-orange-600 hover:underline text-sm">
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent orders</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-xs uppercase text-gray-700 bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-4 py-3 text-sm">
                        <Link to={`/admin/orders/${order._id}`} className="text-orange-600 hover:underline">
                          #{order._id.substring(0, 8)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.shippingAddress.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">₹{order.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-600">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/products/add"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium mb-1 text-gray-700">Add New Product</h3>
              <p className="text-sm text-gray-600">Create a new product listing</p>
            </Link>

            <Link
              to="/admin/products"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium mb-1 text-gray-700">Manage Products</h3>
              <p className="text-sm text-gray-600">Edit or delete existing products</p>
            </Link>

            <Link
              to="/admin/orders"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium mb-1 text-gray-700">Manage Orders</h3>
              <p className="text-sm text-gray-600">View and update order status</p>
            </Link>

            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-medium mb-1 text-gray-700">Generate Reports</h3>
              <p className="text-sm text-gray-600">View sales and inventory reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard



// "use client"

// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import axios from "axios"
// import { API_URL } from "../../config"
// import { ShoppingBag, Users, DollarSign, Package } from "lucide-react"

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     totalUsers: 0,
//     totalRevenue: 0,
//     totalProducts: 0,
//   })
//   const [recentOrders, setRecentOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const [statsRes, ordersRes] = await Promise.all([
//           axios.get(`${API_URL}/api/admin/stats`),
//           axios.get(`${API_URL}/api/admin/recent-orders`),
//         ])

//         setStats(statsRes.data)
//         setRecentOrders(ordersRes.data)
//       } catch (err) {
//         setError("Failed to fetch dashboard data. Please try again later.")
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchDashboardData()
//   }, [])

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="text-center py-10">
//         <p className="text-red-500">{error}</p>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
//               <ShoppingBag className="h-6 w-6" />
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm">Total Orders</p>
//               <h3 className="text-gray-700 text-2xl font-bold">{stats.totalOrders}</h3>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
//               <Users className="h-6 w-6" />
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm">Total Users</p>
//               <h3 className="text-gray-700 text-2xl font-bold">{stats.totalUsers}</h3>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
//               <DollarSign className="h-6 w-6" />
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm">Total Revenue</p>
//               <h3 className="text-gray-700 text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</h3>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
//               <Package className="h-6 w-6" />
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm">Total Products</p>
//               <h3 className="text-gray-700 text-2xl font-bold">{stats.totalProducts}</h3>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Link to="/admin/products/add" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//               <h3 className="font-medium text-gray-700 mb-1">Add New Product</h3>
//               <p className="text-sm text-gray-600">Create a new product listing</p>
//             </Link>

//             <Link to="/admin/products" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//               <h3 className="font-medium text-gray-700 mb-1">Manage Products</h3>
//               <p className="text-sm text-gray-600">Edit or delete existing products</p>
//             </Link>

//             <Link to="/admin/orders" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//               <h3 className="font-medium text-gray-700 mb-1">Manage Orders</h3>
//               <p className="text-sm text-gray-600">View and update order status</p>
//             </Link>

//             <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//               <h3 className="font-medium text-gray-700 mb-1">Generate Reports</h3>
//               <p className="text-sm text-gray-600">View sales and inventory reports</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard
