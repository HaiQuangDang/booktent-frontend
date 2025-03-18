import { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logofit.svg";

export default function Header({ user, myStore, cartItemCount }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setDropdownOpen(false);
  }, [])


  return (
    <header className="shadow-md py-4 px-6 flex items-center justify-between bg-white">
      {/* Logo */}
      <div className="flex items-center">
        <Link to={"/"}><img src={Logo} alt="BookTent Logo" className="w-50" /></Link>
      </div>

      {/* Search Bar */}
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search books..."
          className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute right-3 top-2.5 text-gray-500">🔍</div>
      </div>

      {/* Navbar Links */}
      <div className="flex items-center gap-6">
        <div className="font-medium flex gap-4">
          {myStore ? (
            <Link to={`/store/${myStore.id}`} className="text-blue-500 hover:text-blue-700">
              My Store
            </Link>
          ) : (
            <Link to="/store/create" className="text-blue-500 hover:text-blue-700">
              Create Store?
            </Link>
          )}
        </div>

        {/* Profile Dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-blue-500 hover:text-blue-700"
            >
              My Profile
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <Link to="/orders/list" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  My Orders
                </Link>
                <Link to="/logout" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Logout
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </Link>
        )}

        {/* Cart Icon with Badge */}
        <Link to="/cart" className="relative text-gray-600 hover:text-gray-800">
          🛒
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
              {cartItemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}