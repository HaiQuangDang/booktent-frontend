import React, { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { USER } from '../../constants';

const EditBookPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [genres, setGenres] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock_quantity: "",
    published_year: "",
    store: "",
    authors: "",
    genres: [],
    cover_image: null,
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
        const genresRes = await api.get("/books/genres/");

        if (bookRes.data.store !== storeRes.data.id) {
          setError("You can only edit books from your store.");
          setLoading(false);
          return;
        }

        setGenres(Array.isArray(genresRes.data) ? genresRes.data : []);

        const book = bookRes.data;
        console.log("author_details:", book.author_details);
        setFormData({
          title: book.title || "",
          description: book.description || "",
          price: book.price || "",
          stock_quantity: book.stock_quantity || "",
          published_year: book.published_year || "",
          store: book.store || "",
          cover_image: null,
          authors: Array.isArray(book.author_details)
            ? book.author_details.map(author => author.name).join(", ")
            : "",
          genres: Array.isArray(book.genres) ? book.genres.map(genre => genre.id || genre) : [],
        });

        setPreviewImage(book.cover_image || null);
      } else {
        setError("You need to own a store to manage books.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.");
    if (confirmCancel) {
      navigate(`/store/books`);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, cover_image: file });
      setPreviewImage(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData({ ...formData, [name]: selectedValues });
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData({ ...formData, cover_image: null });
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");

    const authorsArray = formData.authors.split(",").map(a => a.trim()).filter(a => a.length > 0);
    if (!formData.title || !formData.description || !formData.price ||
      !formData.stock_quantity || !formData.published_year || !authorsArray.length ||
      !formData.genres.length) {
      setError("Please fill in all required fields.");
      return;
    }

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
    if (removeImage) {
      data.append("cover_image", ""); // Signal to remove image if backend supports
    }
    authorsArray.forEach(author => data.append("authors", author));
    formData.genres.forEach(genre => data.append("genres", genre));

    try {
      await api.put(`/books/book/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Book updated successfully.");
      navigate('/store/books');
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save book.");
      console.log(err);
    }
  };

  if (loading) return <div className="text-center text-soft-gray font-inter">Loading...</div>;
  if (error) return <div className="text-red-500 text-center font-inter">{error}</div>;

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-8 min-h-screen">
        <h1 className="text-4xl text-forest mb-8 text-center font-playfair">Edit Book</h1>
        <form onSubmit={handleEdit} className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6" encType="multipart/form-data">
          <div>
            <label htmlFor="title" className="block text-forest font-inter mb-1">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-forest font-inter mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the book"
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter h-32 resize-y"
            />
          </div>
          <div>
            <label htmlFor="authors" className="block text-forest font-inter mb-1">Authors (comma-separated)</label>
            <input
              id="authors"
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              placeholder="e.g., Jane Doe, John Smith"
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
            />
          </div>
          <div>
            <label htmlFor="genres" className="block text-forest font-inter mb-1">Genres</label>
            <select
              id="genres"
              name="genres"
              multiple
              value={formData.genres || []}
              onChange={handleMultiSelectChange}
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
            >
              {genres.length > 0 ? (
                genres.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))
              ) : (
                <option disabled>No genres available</option>
              )}
            </select>
            <p className="text-sm text-soft-gray mt-1 font-inter">Hold Ctrl/Cmd to select multiple</p>
          </div>
          <div>
            <label htmlFor="price" className="block text-forest font-inter mb-1">Price ($)</label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 19.99"
              step="0.01"
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
            />
          </div>
          <div>
            <label htmlFor="stock_quantity" className="block text-forest font-inter mb-1">Stock Quantity</label>
            <input
              id="stock_quantity"
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              placeholder="e.g., 10"
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
            />
          </div>
          <div>
            <label htmlFor="published_year" className="block text-forest font-inter mb-1">Published Year</label>
            <input
              id="published_year"
              type="number"
              name="published_year"
              value={formData.published_year}
              onChange={handleChange}
              placeholder="e.g., 2023"
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
            />
          </div>
          <div>
            <label htmlFor="cover_image" className="block text-forest font-inter mb-1">Cover Image</label>
            <input
              ref={fileInputRef}
              id="cover_image"
              type="file"
              name="cover_image"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-2 border border-soft-gray rounded-md text-soft-gray font-inter file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:bg-forest file:text-white file:hover:bg-burnt-orange"
            />
            {previewImage && (
              <div className="mt-4 flex items-center gap-4">
                <img src={previewImage} alt="Cover Preview" className="w-24 h-36 object-cover rounded-md shadow-sm" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors font-inter"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          {error && <p className="text-red-500 text-center font-inter">{error}</p>}
          <div className="flex gap-4 justify-center">
            <button type="submit" className="btn-primary flex-1">
              Update Book
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-soft-gray text-forest px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-inter"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default EditBookPage;