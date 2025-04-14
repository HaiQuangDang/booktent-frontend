import React, { useState, useEffect } from "react";
import api from "../../api";
import { USER } from "../../constants";
import LoadingIndicator from "../../components/LoadingIndicator";

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock_quantity: "",
    published_year: "",
    store: "",
    cover_image: null, // New field for file
  });
  const [editingBookId, setEditingBookId] = useState(null);
  const [isStoreOwner, setIsStoreOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch books and check store ownership on mount
  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem(USER);
      if (!storedUser) {
        setError("Please log in to manage books.");
        setLoading(false);
        return;
      }

      try {
        const storeRes = await api.get("/stores/mine/");
        if (storeRes.data && !storeRes.data.detail) {
          setIsStoreOwner(true);
          setFormData((prev) => ({ ...prev, store: storeRes.data.id }));
          const booksRes = await api.get("/books/book/");
          setBooks(booksRes.data);
        } else {
          setError("You need to own a store to manage books.");
        }
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, cover_image: e.target.files[0] });
  };

  // Create or Update a book
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.title || !formData.description || !formData.price || !formData.stock_quantity || !formData.published_year) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!editingBookId && !formData.cover_image) {
      setError("Please upload a cover image for a new book.");
      return;
    }

    // Prepare FormData for multipart upload
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock_quantity", formData.stock_quantity);
    data.append("published_year", formData.published_year);
    data.append("store", formData.store);
    if (formData.cover_image) {
      data.append("cover_image", formData.cover_image);
    }

    try {
      if (editingBookId) {
        await api.put(`/books/book/${editingBookId}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditingBookId(null);
      } else {
        await api.post("/books/book/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setFormData({
        title: "",
        description: "",
        price: "",
        stock_quantity: "",
        published_year: "",
        store: formData.store,
        cover_image: null,
      });
      fetchBooks(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save book.");
    }
  };

  // Fetch books
  const fetchBooks = async () => {
    try {
      const response = await api.get("/books/book/");
      setBooks(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to refresh books.");
    }
  };

  // Edit a book
  const handleEdit = (book) => {
    setEditingBookId(book.id);
    setFormData({
      title: book.title,
      description: book.description,
      price: book.price,
      stock_quantity: book.stock_quantity,
      published_year: book.published_year,
      store: book.store,
      cover_image: null, // Reset file input, we'll keep the existing image unless replaced
    });
    setError("");
  };

  // Delete a book
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await api.delete(`/books/${id}/`);
        fetchBooks();
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to delete book.");
      }
    }
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="error-message">{error}</div>;

  if (!isStoreOwner) return <div className="error-message">{error}</div>;

  return (
    <div className="book-manager-container">
      <h1>{editingBookId ? "Edit Book" : "Add New Book"}</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="form-container" encType="multipart/form-data">
        <label htmlFor="title" className="visually-hidden">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="form-input"
        />
        <label htmlFor="description" className="visually-hidden">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="form-input"
        />
        <label htmlFor="price" className="visually-hidden">Price</label>
        <input
          id="price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          step="0.01"
          required
          className="form-input"
        />
        <label htmlFor="stock_quantity" className="visually-hidden">Stock Quantity</label>
        <input
          id="stock_quantity"
          type="number"
          name="stock_quantity"
          value={formData.stock_quantity}
          onChange={handleChange}
          placeholder="Stock Quantity"
          required
          className="form-input"
        />
        <label htmlFor="published_year" className="visually-hidden">Published Year</label>
        <input
          id="published_year"
          type="number"
          name="published_year"
          value={formData.published_year}
          onChange={handleChange}
          placeholder="Published Year"
          required
          className="form-input"
        />
        <label htmlFor="cover_image" className="visually-hidden">Cover Image</label>
        <input
          id="cover_image"
          type="file"
          name="cover_image"
          onChange={handleFileChange}
          accept="image/*"
          className="form-input"
          required={!editingBookId} // Required only for new books
        />
        {editingBookId && books.find((b) => b.id === editingBookId)?.cover_image && (
          <p>Current image: <a href={books.find((b) => b.id === editingBookId).cover_image} target="_blank">View</a></p>
        )}
        <button type="submit" className="form-button">
          {editingBookId ? "Update Book" : "Add Book"}
        </button>
        {editingBookId && (
          <button
            type="button"
            className="form-button cancel"
            onClick={() => {
              setEditingBookId(null);
              setFormData({
                title: "",
                description: "",
                price: "",
                stock_quantity: "",
                published_year: "",
                store: formData.store,
                cover_image: null,
              });
              setError("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Your Books</h2>
      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} className="book-item">
            <div>
              {book.title} - ${book.price} (Stock: {book.stock_quantity})
              {book.cover_image && (
                <img
                  src={book.cover_image}
                  alt={`${book.title} cover`}
                  className="book-cover-preview"
                  style={{ maxWidth: "50px", marginLeft: "10px" }}
                />
              )}
            </div>
            {book.store === formData.store && (
              <>
                <button onClick={() => handleEdit(book)} className="action-button">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="action-button delete"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookManager;