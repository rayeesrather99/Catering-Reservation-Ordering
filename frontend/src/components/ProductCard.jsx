import { Link } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { ShoppingCart } from "lucide-react"

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  return (
    <div className="card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-gray-700 text-lg font-semibold mb-1">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2">{product.description.substring(0, 60)}...</p>
        <div className="flex justify-between items-center">
          <span className="text-orange-600 font-bold">₹{product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            className="p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

