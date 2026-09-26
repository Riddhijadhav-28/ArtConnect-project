import { useState } from "react";
import axios from "axios";
import "./UploadArtwork.css";

function UploadArtwork() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState("");
    const [customCategory, setCustomCategory] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true);

        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("image", image);

        const finalCategory =
            category === "Other" ? customCategory.trim() : category;

        formData.append("category", finalCategory);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:3000/api/artworks",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setSuccessMessage(response.data.message ||"Artwork uploaded successfully");

            setTitle("");
            setDescription("");
            setCategory("");
            setCustomCategory("");
            setImage(null);
        } catch (error) {
            console.log("upload error:", error);
            console.log("server error:", error.response?.data);

            setErrorMessage(error.response?.data?.message ||"Unable to upload artwork. Please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-page">
            <div className="upload-container">
                <div className="upload-heading">
                    <p>SHARE YOUR CREATIVE WORK</p>
                    <h1>Upload Artwork</h1>
                    <span>Showcase your artwork and let others discover your creativity.</span>
                </div>

                <form className="upload-form" onSubmit={handleSubmit}>
                    {errorMessage && (
                        <div className="form-error">
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="form-success">
                            {successMessage}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Artwork Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your artwork a name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell people about your artwork..."
                            rows="5"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Artwork Image</label>
                        <div className="image-upload-box">
                            <span className="upload-icon"></span>
                            <p>
                                {image
                                    ? image.name
                                    : "Choose an image to showcase your artwork"
                                }
                            </p>

                            <small>JPG, PNG or JPEG</small>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={(e) =>
                                    setImage(e.target.files[0])
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={category}
                            onChange={(e) => {

                                const selectedCategory = e.target.value;

                                setCategory(selectedCategory);

                                if (selectedCategory !== "Other") {
                                    setCustomCategory("");
                                }

                            }}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Digital">Digital</option>
                            <option value="Sketch">Sketch</option>
                            <option value="Painting">Painting</option>
                            <option value="Watercolor">Watercolor</option>
                            <option value="Portrait">Portrait</option>
                            <option value="Illustration">Illustration</option>
                            <option value="Photography">Photography</option>
                            <option value="Sculpture">Sculpture</option>
                            <option value="Calligraphy">Calligraphy</option>
                            <option value="Abstract">Abstract</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {category === "Other" && (
                        <div className="form-group">
                            <label>Specify Category</label>
                            <input
                                type="text"
                                placeholder="Enter your category"
                                value={customCategory}
                                onChange={(e) =>
                                    setCustomCategory(e.target.value)
                                }
                                required
                            />
                        </div>
                    )}

                    <button className="upload-submit-btn" type="submit" disabled={loading}>
                        {loading ? "Uploading...": "Upload Artwork"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UploadArtwork;