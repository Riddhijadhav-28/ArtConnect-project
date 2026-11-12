import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateArtist.css";

function CreateArtistProfile() {

    const navigate = useNavigate();

    const [artistName, setArtistName] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [genres, setGenres] = useState("");

    const [instagram, setInstagram] = useState("");
    const [twitter, setTwitter] = useState("");
    const [website, setWebsite] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const genreArray = genres
                .split(",")
                .map((genre) => genre.trim())
                .filter((genre) => genre !== "");

            const response = await axios.post("https://artconnect-backend-87br.onrender.com/api/artists/create",
                {
                    artistName,
                    bio,
                    profileImage,
                    genres: genreArray,
                    socialLinks: {
                        instagram,
                        twitter,
                        website
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setSuccessMessage("Artist Profile created successfully!");

                setTimeout(() => {
                    navigate("/profile");
                }, 1000);
            }

        } catch (error) {
            console.log(error);
            setErrorMessage(error.response?.data?.message || "Unable to create artist profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-artist-page">
            <div className="create-artist-container">
                <div className="create-artist-header">
                    <p>ARTCONNECT</p>
                    <h1>Create Artist Profile</h1>
                    <span>Tell people about yourself and showcase your creativity.</span>
                </div>

                <div className="create-artist-card">
                    {successMessage && (
                        <div className="create-artist-success">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="create-artist-error">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="create-artist-field">
                            <label>Artist Name</label>
                            <input
                                type="text"
                                placeholder="Enter your artist name"
                                value={artistName}
                                onChange={(e) =>
                                    setArtistName(e.target.value)
                                } required />
                        </div>

                        <div className="create-artist-field">
                            <label>Bio</label>
                            <textarea
                                placeholder="Tell people about yourself and your art..."
                                value={bio}
                                onChange={(e) =>
                                    setBio(e.target.value)
                                } required />
                        </div>

                        <div className="create-artist-field">
                            <label>Profile Image URL</label>
                            <input
                                type="url"
                                placeholder="Enter profile image URL"
                                value={profileImage}
                                onChange={(e) =>
                                    setProfileImage(e.target.value)
                                }/>
                        </div>

                        <div className="create-artist-field">
                            <label>Genres</label>
                            <input
                                type="text"
                                placeholder="Painting, Sketching, Digital Art"
                                value={genres}
                                onChange={(e) =>
                                    setGenres(e.target.value)
                                }/>

                            <small>Separate multiple genres with commas.</small>
                        </div>

                        <div className="create-artist-field">
                            <label>Instagram</label>
                            <input
                                type="text"
                                placeholder="Instagram link"
                                value={instagram}
                                onChange={(e) =>
                                    setInstagram(e.target.value)
                                }/>
                        </div>

                        <div className="create-artist-field">
                            <label>Twitter</label>
                            <input
                                type="text"
                                placeholder="Twitter link"
                                value={twitter}
                                onChange={(e) =>
                                    setTwitter(e.target.value)
                                }/>
                        </div>

                        <div className="create-artist-field">
                            <label>Website</label>
                            <input
                                type="url"
                                placeholder="Your website"
                                value={website}
                                onChange={(e) =>
                                    setWebsite(e.target.value)
                                }/>
                        </div>

                        <div className="create-artist-buttons">
                            <button type="submit" className="create-artist-submit" disabled={loading}>
                                {loading
                                    ? "Creating..."
                                    : "Create Artist Profile"}
                            </button>

                            <button type="button" className="create-artist-cancel" onClick={() => navigate("/profile")}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateArtistProfile;