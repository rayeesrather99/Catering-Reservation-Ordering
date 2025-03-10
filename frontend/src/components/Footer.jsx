import { Link } from "react-router-dom"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Indian Catering</h3>
            <p className="text-gray-300">
              Bringing authentic Indian cuisine to your special events. We offer a wide range of traditional dishes
              prepared with love and care.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-white">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300">
              <p>123 Catering Street</p>
              <p>Food City, FC 12345</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: info@indiancatering.com</p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {currentYear} Indian Catering. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

