import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { USER } from '../../constants';

const EditBookPage = () => {
  const { id } = useParams();
  // const [book, setBook] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock_quantity: "",
    published_year: "",
    store: "",
    cover_image: null, // New field for file
  });


  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const storedUser = localStorage.getItem(USER);
    if (!storedUser) {
      setError("Please log in to edit your book.");
      setLoading(false);
      return;
    }

    try {
      const storeRes = await api.get("/stores/mine/");
      if (storeRes.data && !storeRes.data.detail) {
        const bookRes = await api.get(`/books/book/${id}/`);
        if (bookRes.data.store !== storeRes.data.id) {
          setError("You can only edit books from your store.");
          setLoading(false);
          return;
        }
        // setBook(bookRes.data);
        const book = bookRes.data;
        setFormData({
          title: book.title,
          description: book.description,
          price: book.price,
          stock_quantity: book.stock_quantity,
          published_year: book.published_year,
          store: book.store,
          cover_image: null,
        });
      } else {
        setError("You need to own a store to manage books.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, cover_image: e.target.files[0] });
  };

  // Create or Update a book
  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.title || !formData.description || !formData.price || !formData.stock_quantity || !formData.published_year) {
      setError("Please fill in all required fields.");
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

      await api.put(`/books/book/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save book.");
      console.log(err);
    }
  };


  if (loading) return <div>Loading...</div>;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <ProtectedRoute>
      <h1>Edit Book</h1>
      <form onSubmit={handleEdit} className="form-container" encType="multipart/form-data">
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
        // Required only for new books
        />
        <button type="submit" className="form-button">
          Update Book
        </button>
        <button type="button" className="form-button cancel">
          Cancel
        </button>

      </form>
    </ProtectedRoute>
  );
}


export default EditBookPage;