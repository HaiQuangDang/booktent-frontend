import React, { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import api from '../../api';
import { USER } from '../../constants';
import LoadingIndicator from '../../components/LoadingIndicator';

const EditBookPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
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
    authors: [],
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
        const [bookRes, genresRes, authorsRes] = await Promise.all([
          api.get(`/books/book/${id}/`),
          api.get("/books/genres/"),
          api.get("/books/authors/"),
        ]);

        if (bookRes.data.store !== storeRes.data.id) {
          setError("You can only edit books from your store.");
          setLoading(false);
          return;
        }

        const book = bookRes.data;
        setGenres(genresRes.data || []);
        setAuthors(authorsRes.data || []);

        setFormData({
          title: book.title || "",
          description: book.description || "",
          price: book.price || "",
          stock_quantity: book.stock_quantity || "",
          published_year: book.published_year || "",
          store: book.store || "",
          cover_image: null,
          authors: Array.isArray(book.author_details)
            ? book.author_details.map(author => ({ label: author.name, value: author.id }))
            : [],
          genres: Array.isArray(book.genre_names) && Array.isArray(book.genres)
            ? book.genres.map((id, index) => ({
              label: book.genre_names[index],
              value: id
            }))
            : [],

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
    if (window.confirm("Are you sure you want to cancel? Unsaved changes will be lost.")) {
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

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData({ ...formData, cover_image: null });
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.description || !formData.price ||
      !formData.stock_quantity || !formData.published_year ||
      !formData.authors.length || !formData.genres.length) {
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
      data.append("cover_image", "");
    }


    formData.authors.forEach(author => data.append("authors", author.value));
    formData.genres.forEach(genre => data.append("genres", genre.value));

    try {
      await api.put(`/books/book/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Book updated successfully.");
      navigate('/store/books');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to save book.");
    }
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="text-red-500 text-center font-inter">{error}</div>;

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-8 min-h-screen">
        <h1 className="text-4xl text-forest mb-8 text-center font-playfair">Edit Book</h1>
        <form onSubmit={handleEdit} className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6" encType="multipart/form-data">
          {/* Title */}
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
              className="w-full p-2 border border-soft-gray rounded-md focus:ring-2 focus:ring-forest"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-forest font-inter mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the book"
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:ring-2 focus:ring-forest h-32 resize-y"
            />
          </div>

          {/* Authors */}
          <div>
            <label htmlFor="authors" className="block text-forest font-inter mb-1">Authors</label>
            <Select
              isMulti
              options={authors.map(a => ({ value: a.id, label: a.name }))}
              value={formData.authors}
              onChange={(selected) => setFormData({ ...formData, authors: selected })}
              className="text-soft-gray"
            />
          </div>

          {/* Genres */}
          <div>
            <label htmlFor="genres" className="block text-forest font-inter mb-1">Genres</label>
            <Select
              isMulti
              options={genres.map(g => ({ value: g.id, label: g.name }))}
              value={formData.genres}
              onChange={(selected) => setFormData({ ...formData, genres: selected })}
              className="text-soft-gray"
            />
          </div>

          {/* Price */}
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
              className="w-full p-2 border border-soft-gray rounded-md focus:ring-2 focus:ring-forest"
            />
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock_quantity" className="block text-forest font-inter mb-1">Stock Quantity</label>
            <input
              id="stock_quantity"
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:ring-2 focus:ring-forest"
            />
          </div>

          {/* Published Year */}
          <div>
            <label htmlFor="published_year" className="block text-forest font-inter mb-1">Published Year</label>
            <input
              id="published_year"
              type="number"
              name="published_year"
              value={formData.published_year}
              onChange={handleChange}
              placeholder="e.g., 2024"
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:ring-2 focus:ring-forest"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label htmlFor="cover_image" className="block text-forest font-inter mb-1">Cover Image</label>
            <input
              ref={fileInputRef}
              id="cover_image"
              type="file"
              name="cover_image"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-2 border border-soft-gray rounded-md"
            />
            {previewImage && (
              <div className="mt-4 flex items-center gap-4">
                <img src={previewImage} alt="Cover Preview" className="w-24 h-36 object-cover rounded-md shadow-sm" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-center font-inter">{error}</p>}

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button type="submit" className="btn-primary flex-1">Update Book</button>
            <button type="button" onClick={handleCancel} className="flex-1 bg-soft-gray text-forest px-4 py-2 rounded-md">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default EditBookPage;
