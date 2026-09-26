import { useNavigate } from "react-router-dom";

function ArtistProfileDetails({ artistProfile }) {

    const navigate = useNavigate();

    if (!artistProfile) {
        return (
            <div className="profile-create-artist-box">

                <div>
                    <p>ARTIST PROFILE</p>

                    <h2>Showcase your creativity</h2>

                    <span>
                        Create your artist profile to start
                        uploading artwork and receiving
                        commission requests.
                    </span>
                </div>

                <button
                    className="profile-create-artist-btn"
                    onClick={() =>
                        navigate("/create-artist-profile")
                    }
                >
                    Create Artist Profile
                </button>

            </div>
        );
    }

    return (
        <div className="profile-artist-card">

            <div className="profile-artist-card-header">

                <div>
                    <p>ARTIST PROFILE</p>

                    <h2>{artistProfile.artistName}</h2>

                </div>

                <button
                    className="profile-edit-artist-btn"
                    onClick={() =>
                        navigate("/edit-artist-profile")
                    }
                >
                    Edit Artist Profile
                </button>

            </div>


            <div className="profile-artist-details">

                {/* ARTIST NAME */}

                <div className="profile-artist-detail-item">

                    <span>Artist Name</span>
                    <strong>
                        {artistProfile.artistName || "Not available"}
                    </strong>

                </div>

                <div className="profile-artist-detail-item">

                    <span>Bio</span>
                    <p>{artistProfile.bio || "No bio added."}</p>

                </div>

                <div className="profile-artist-detail-item">

                    <span>Genres</span>

                    {artistProfile.genres &&
                    artistProfile.genres.length > 0 ? (

                        <div className="profile-artist-genres">

                            {artistProfile.genres.map(
                                (genre, index) => (

                                    <span
                                        key={index}
                                        className="profile-artist-genre-tag"
                                    >
                                        {genre}
                                    </span>
                                )
                            )}
                        </div>

                    ) : (
                    <p>No genres added.</p>
                    )}
                </div>

                <div className="profile-artist-detail-item">
                    <span>Instagram</span>
                    <strong>
                        {artistProfile.socialLinks?.instagram || "Not added"}
                    </strong>
                </div>

                <div className="profile-artist-detail-item">
                    <span>Twitter</span>

                    <strong>
                        {artistProfile.socialLinks?.twitter ||"Not added"}
                    </strong>

                </div>

                <div className="profile-artist-detail-item">
                    <span>Website</span>
                    <strong>
                        {artistProfile.socialLinks?.website ||"Not added"}
                    </strong>
                </div>
            </div>
        </div>
    );
}

export default ArtistProfileDetails;