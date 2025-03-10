"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { ShoppingCart, Menu, X } from "lucide-react"

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-orange-600 font-bold text-xl">Indian Catering</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-orange-600">
              Home
            </Link>

            {user ? (
              <>
                <Link to="/orders" className="px-3 py-2 text-gray-700 hover:text-orange-600">
                  My Orders
                </Link>
                <Link to="/profile" className="px-3 py-2 text-gray-700 hover:text-orange-600">
                  Profile
                </Link>

                {isAdmin && (
                  <Link to="/admin" className="px-3 py-2 text-gray-700 hover:text-orange-600">
                    Admin
                  </Link>
                )}

                <button onClick={handleLogout} className="px-3 py-2 text-gray-700 hover:text-orange-600">
                  Logout
                </button>

                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-orange-600" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-gray-700 hover:text-orange-600">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 text-gray-700 hover:text-orange-600">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <Link to="/cart" className="relative mr-4">
                <ShoppingCart className="h-6 w-6 text-gray-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-orange-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to="/orders"
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-orange-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

