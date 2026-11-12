import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditArtistProfile.css";

function EditArtistProfile() {

    const navigate = useNavigate();

    const [artistName, setArtistName] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [genres, setGenres] = useState("");

    const [instagram, setInstagram] = useState("");
    const [twitter, setTwitter] = useState("");
    const [website, setWebsite] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch existing artist profile
    const fetchArtistProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "https://artconnect-backend-87br.onrender.com/api/artists/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const artist = response.data.artist;

            setArtistName(artist.artistName || "");
            setBio(artist.bio || "");
            setProfileImage(artist.profileImage || "");

            setGenres(
                artist.genres
                    ? artist.genres.join(", ")
                    : ""
            );

            setInstagram(artist.socialLinks?.instagram || "");

            setTwitter(artist.socialLinks?.twitter || "");

            setWebsite(artist.socialLinks?.website || "");

        } catch (error) {
            console.log(error);
            setErrorMessage(error.response?.data?.message ||"Unable to load artist profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtistProfile();
    }, []);

    // Update artist profile
    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");
        setSaving(true);

        try {
            const token = localStorage.getItem("token");

            const genreArray = genres
                .split(",")
                .map((genre) => genre.trim())
                .filter((genre) => genre !== "");


            const response = await axios.put("https://artconnect-backend-87br.onrender.com/api/artists/me",
                {
                    artistName,
                    bio,
                    profileImage,
                    genres: genreArray,

                    socialLinks: {
                        instagram,
                        twitter,
                        website,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccessMessage(response.data.message ||"Artist profile updated successfully!");

            setTimeout(() => {
                navigate("/profile");
            }, 1000);

        } catch (error) {
            console.log(error);

            setErrorMessage(error.response?.data?.message ||"Unable to update artist profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="edit-artist-page">
                <div className="edit-artist-loading">
                    Loading artist profile...
                </div>
            </div>
        );
    }

    return (
        <div className="edit-artist-page">
            <div className="edit-artist-container">
                <div className="edit-artist-header">
                    <p>ARTCONNECT</p>
                    <h1>Edit Artist Profile</h1>
                    <span>Update your artist information and social links.</span>
                </div>

                <div className="edit-artist-card">
                    {errorMessage && (
                        <div className="edit-artist-error">
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="edit-artist-success">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="edit-artist-field">
                            <label>Artist Name</label>
                            <input
                                type="text"
                                value={artistName}
                                onChange={(e) =>
                                    setArtistName(e.target.value)
                                }
                                placeholder="Enter your artist name"
                                required
                            />
                        </div>

                        <div className="edit-artist-field">
                            <label>Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) =>
                                    setBio(e.target.value)
                                }
                                placeholder="Tell people about yourself and your art..."
                                required
                            />
                        </div>

                        <div className="edit-artist-field">
                            <label>Profile Image URL</label>
                            <input
                                type="url"
                                value={profileImage}
                                onChange={(e) =>
                                    setProfileImage(e.target.value)
                                }
                                placeholder="Enter profile image URL"
                            />
                        </div>

                        <div className="edit-artist-field">
                            <label>Genres</label>
                            <input
                                type="text"
                                value={genres}
                                onChange={(e) =>
                                    setGenres(e.target.value)
                                }
                                placeholder="Painting, Sketching, Digital Art"
                            />
                            <small>Separate multiple genres with commas.</small>
                        </div>

                        <div className="edit-artist-field">
                            <label>Instagram</label>
                            <input
                                type="text"
                                value={instagram}
                                onChange={(e) =>
                                    setInstagram(e.target.value)
                                }
                                placeholder="Instagram link"
                            />
                        </div>

                        <div className="edit-artist-field">
                            <label>Twitter</label>
                            <input
                                type="text"
                                value={twitter}
                                onChange={(e) =>
                                    setTwitter(e.target.value)
                                }
                                placeholder="Twitter link"
                            />
                        </div>

                        <div className="edit-artist-field">
                            <label>Website</label>
                            <input
                                type="url"
                                value={website}
                                onChange={(e) =>
                                    setWebsite(e.target.value)
                                }
                                placeholder="Your website"
                            />
                        </div>

                        <div className="edit-artist-buttons">
                            <button type="submit" className="edit-artist-save" disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </button>

                            <button type="button" className="edit-artist-cancel" onClick={() => navigate("/profile")}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditArtistProfile;