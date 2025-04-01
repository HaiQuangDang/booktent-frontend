import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logofit.svg";
import cart from "../../assets/cart.svg"

export default function Header({ user, myStore, cartItemCount }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setDropdownOpen(false);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-beige shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/">
          <img src={Logo} alt="BookTent Logo" className="w-40" />
        </Link>
      </div>

      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search books..."
          className="w-full p-2 pl-4 pr-10 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest font-inter text-soft-gray"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-soft-gray">🔍</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="font-medium font-inter text-forest">
          {myStore ? (
            <Link to="/dashboard" className="hover:text-burnt-orange transition-colors">
              My Store
            </Link>
          ) : (
            <Link to="/store/create" className="hover:text-burnt-orange transition-colors">
              Create Store?
            </Link>
          )}
        </div>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="font-inter text-forest hover:text-burnt-orange transition-colors"
            >
              My Profile
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-soft-gray rounded-md shadow-lg">
                <Link to="/profile" className="block px-4 py-2 text-soft-gray hover:bg-beige font-inter">
                  Profile
                </Link>
                <Link to="/orders/list" className="block px-4 py-2 text-soft-gray hover:bg-beige font-inter">
                  My Orders
                </Link>
                <Link to="/logout" className="block px-4 py-2 text-soft-gray hover:bg-beige font-inter">
                  Logout
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="font-inter text-forest hover:text-burnt-orange transition-colors">
            Login
          </Link>
        )}

        <Link to="/cart" className="relative text-forest hover:text-burnt-orange transition-colors">
          <img src={cart} alt="Cart Icon"/>
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-burnt-orange text-white text-xs font-bold rounded-full px-1.5 py-0.5">
              {cartItemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}