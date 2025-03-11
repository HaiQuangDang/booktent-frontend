import Logo from "../../assets/logofit.svg";
import { Link } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

export default function Header({ user, myStore }) {
  return (
    <header className="shadow-md py-4 px-6 flex items-center justify-between bg-white">
      <div className="flex items-center">
        <img src={Logo} alt="BookTent Logo" className="w-50" />
      </div>
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search books..."
          className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute right-3 top-2.5 text-gray-500">🔍</div>
      </div>
      <div className="flex items-center gap-6">
        <div className="font-medium flex gap-4">
          {myStore ? (
            <Link to={`/store/${myStore.id}`} className="text-blue-500 hover:text-blue-700">
              My Store
            </Link>
          ) : (
            <Link to="/store/create" className="text-blue-500 hover:text-blue-700">
              Create Store
            </Link>
          )}
        </div>
        <div className="relative"></div>
        {user ? (
          <div className="relative">
            <button className="text-blue-500 hover:text-blue-700">
              My Profile
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <Link to="/logout" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Logout
              </Link>
            </div>
          </div>
        ) : (
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}