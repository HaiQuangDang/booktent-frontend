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
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

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
        const bookRes = await api.get(`/books/book/${id}/`);
        const authorsRes = await api.get("/books/authors/");
        const genresRes = await api.get("/books/genres/");
        if (bookRes.data.store !== storeRes.data.id) {
          setError("You can only edit books from your store.");
          setLoading(false);
          return;
        }
        setAuthors(authorsRes.data);
        setGenres(genresRes.data);
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
          authors: book.authors.map((author) => author.id), // Pre-select authors
          genres: book.genres.map((genre) => genre.id), // Pre-select genres
        });
        setPreviewImage(book.cover_image);
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
    setPreviewImage(URL.createObjectURL(file));
  };

  // Handle multi-select change
  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => parseInt(option.value));
    setFormData({ ...formData, [name]: selectedValues });
  };



  // Create or Update a book
  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.title || !formData.description ||
      !formData.price || !formData.stock_quantity ||
      !formData.published_year || !formData.authors.length ||
      !formData.genres.length) {
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
    if (formData.authors.length > 0) {
      formData.authors.forEach(author => data.append("authors", author));
    }
    if (formData.genres.length > 0) {
      formData.genres.forEach(genre => data.append("genres", genre));
    }

    try {

      await api.put(`/books/book/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Book updated successfully.");
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

        {/* Authors Multi-Select (Auto-selected and visible) */}
        <label htmlFor="authors">Authors</label>
        <select
          id="authors"
          name="authors"
          multiple
          value={formData.authors}
          onChange={handleMultiSelectChange}
          className="form-input"
          required
        >
          {authors.map(author => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>

        {/* Genres Multi-Select (Auto-selected and visible) */}
        <label htmlFor="genres">Genres</label>
        <select
          id="genres"
          name="genres"
          multiple
          value={formData.genres}
          onChange={handleMultiSelectChange}
          className="form-input"
          required
        >
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

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
        {previewImage && (
          <div className="image-preview">
            <img src={previewImage} alt="Book Cover" style={{ maxWidth: "200px", marginBottom: "10px" }} />
          </div>
        )}
        <label htmlFor="cover_image">Change Cover Image</label>
        <input
          id="cover_image"
          type="file"
          name="cover_image"
          onChange={handleFileChange}
          accept="image/*"
          className="form-input"
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