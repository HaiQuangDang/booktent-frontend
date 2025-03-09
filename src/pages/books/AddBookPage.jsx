import React, { useEffect, useState, useRef } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import api from "../../api";
import { Link, useNavigate } from "react-router-dom";

const AddBookPage = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isStoreOwner, setIsStoreOwner] = useState(false);
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const fileInputRef = useRef(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        authors: [],
        genres: [],
        stock_quantity: "",
        published_year: "",
        store: "",
        cover_image: null, // New field for file
    });

    const fetchData = async () => {
        try {
            const storeRes = await api.get(`/stores/mine/`);
            if (!storeRes.data || storeRes.data.detail) {
                setError("You need to own a store to add books.");
                return;
            }
            setIsStoreOwner(true);
            setFormData((prev) => ({ ...prev, store: storeRes.data.id }));
            const authorsRes = await api.get(`/books/authors/`);
            setAuthors(authorsRes.data);
            const genresRes = await api.get(`/books/genres/`);
            setGenres(genresRes.data);

        } catch (err) {
            setError("Store not found");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Handle text input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverPreview(URL.createObjectURL(file));
            setFormData({ ...formData, cover_image: file });
        }
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, cover_image: null });
        setCoverPreview(null);

        // Reset the file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = "";  // <-- Reset input
        }
    };

    // Handle authors and genres changes
    const handleMultiSelectChange = (e) => {
        const { name, options } = e.target;
        const selectedValues = Array.from(options)
            .filter((option) => option.selected)
            .map((option) => option.value);  // Ensure values are strings

        setFormData((prevData) => ({
            ...prevData,
            [name]: selectedValues,  // Ensure it's an array
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.title || !formData.description ||
            !formData.price || !formData.stock_quantity ||
            !formData.published_year || !formData.cover_image ||
            !formData.authors.length || !formData.genres.length) {
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
        data.append("cover_image", formData.cover_image);

        // Append authors and genres as IDs
        formData.authors.forEach((authorId) => data.append("authors", authorId));
        formData.genres.forEach((genreId) => data.append("genres", genreId));


        console.log(data);

        try {

            await api.post("/books/book/", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Book added successfully!");
            // handleRemoveImage();
            // setFormData({
            //     title: "",
            //     description: "",
            //     price: "",
            //     stock_quantity: "",
            //     published_year: "",
            //     store: formData.store,
            //     cover_image: null,
            //     authors: [],
            //     genres: [],
            // });
            // fetchData();
            navigate(`/store/${formData.store}`)
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.detail || "Failed to save book.");
        }
    };

    if (loading) return <div>Loading...</div>;

    if (!isStoreOwner) return (
        <div>
            <p className="error-message">{error}</p>
            <Link to={"/stores/create"}>
                <button className="form-button">
                    Create a store?
                </button>
            </Link>
        </div>
    );

    if (error) return <div className="error-message">{error}</div>;

    return (
        <ProtectedRoute>
            <h1>Add Book</h1>
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
                <label htmlFor="authors">Authors</label>
                <select
                    id="authors"
                    name="authors"
                    multiple
                    value={formData.authors || []}
                    onChange={handleMultiSelectChange}
                    className="form-input"
                >
                    {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                            {author.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="genres">Genres</label>
                <select
                    id="genres"
                    name="genres"
                    multiple
                    value={formData.genres || []}
                    onChange={handleMultiSelectChange}
                    className="form-input"
                >
                    {genres.map((genre) => (
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
                    ref={fileInputRef}
                    id="cover_image"
                    type="file"
                    name="cover_image"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="form-input"
                    required
                />
                {coverPreview && (
                    <div>
                        <img
                            src={coverPreview}
                            alt="Cover Preview"
                            className="mt-2 w-32 h-32 object-cover border rounded"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                        >
                            Remove
                        </button>
                    </div>
                )}

                <button type="submit" className="form-button">
                    Add Book
                </button>

                <button type="button" className="form-button cancel"
                    onClick={() => {
                        setError("");
                        setFormData({
                            title: "",
                            description: "",
                            price: "",
                            stock_quantity: "",
                            published_year: "",
                            store: formData.store,
                            cover_image: null,
                            authors: [],
                            genres: [],
                        });
                        navigate(`/store/${formData.store}`)
                    }}
                >
                    Cancel
                </button>
            </form>
        </ProtectedRoute>
    );
}

export default AddBookPage;