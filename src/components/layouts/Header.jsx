import Logo from "../../assets/logofit.svg";
import { Link } from "react-router-dom";

export default function Header({ user, myStore }) {
  return (
    <header className="shadow-md py-4 px-6 flex items-center gap-4">
      <div className="flex items-center w-1/3">
        <img src={Logo} alt="BookTent Logo" className="w-fit" />
      </div>
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search books..."
          className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2"
        />
        <div className="absolute right-3 top-2.5">🔍</div>
      </div>
      <div className="flex items-center w-1/3 gap-3 ml-3">
        <div className="font-medium">
          {user ? (
            <Link to="/logout">Logout</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>

        <div className="font-medium flex gap-3">
          {myStore ? (
            <>
              <Link to={`/store/${myStore.id}`}>My Store</Link>
              <Link to="/books/manage">Manage Books</Link>
              <Link to="/wishlist">Wishlist</Link>
            </>
          ) : (
            <Link to="/stores/create">Create Store</Link>
          )}
        </div>
      </div>



    </header>


  );
}