import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import ArtistProfileDetails from "../components/ArtistProfileDetails";

function Profile() {
    const [profile, setProfile] = useState({});
    const [artistProfile, setArtistProfile] = useState(null);

    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://artconnect-backend-87br.onrender.com/api/auth/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProfile(response.data.user);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchArtistProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://artconnect-backend-87br.onrender.com/api/artists/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setArtistProfile(response.data.artist);
        } catch (error) {
            if (error.response?.status !== 404) {
                console.log(error);
            }
            setArtistProfile(null);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile.role === "artist") {
            fetchArtistProfile();
        }
    }, [profile.role]);

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <p>YOUR ARTCONNECT SPACE</p>
                    <h1>Profile</h1>
                    <span>View your account information and ArtConnect details.</span>
                </div>

                <div className="profile-card">
                    <div className="profile-avatar">
                        {profile.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="profile-info">
                        <div className="profile-info-item">
                            <span>Name</span>
                            <strong>
                                {profile.name || "Not available"}
                            </strong>
                        </div>

                        <div className="profile-info-item">
                            <span>Email</span>
                            <strong>
                                {profile.email || "Not available"}
                            </strong>
                        </div>

                        <div className="profile-info-item">
                            <span>Role</span>
                            <strong className="profile-role">
                                {profile.role || "Not available"}
                            </strong>
                        </div>
                    </div>
                </div>

                {profile.role === "artist" && (
                    <div className="profile-artist-section">
                        <ArtistProfileDetails artistProfile={artistProfile} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;