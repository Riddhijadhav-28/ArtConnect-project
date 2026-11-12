import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ArtistProfile.css";

function ArtistProfile() {
    const {id} = useParams();
    const [artist, setArtist]= useState(null);
    const [artworks, setArtworks ]= useState([]);
    const [reviews, setReviews] = useState([]);
    const navigate= useNavigate();

    useEffect(() => {
        const fetechArtist = async() => {
            try{
                const response = await axios.get(`https://artconnect-backend-87br.onrender.com/api/artists/${id}`);
                setArtist(response.data.artist);

                const artworkResponse = await axios.get(`https://artconnect-backend-87br.onrender.com/api/artworks/artist/${id}`);
                setArtworks(artworkResponse.data.artworks);

                const reviewResponse = await axios.get(`https://artconnect-backend-87br.onrender.com/api/reviews/${id}`);
                setReviews(reviewResponse.data.reviews);

            }catch(error){
                console.log(error);
            }
        };

        fetechArtist();
    }, [id]);

    if(!artist){
        return <h2 className="text-center mt-5">Loading....</h2>;
    }


    return(
        <div className="artist-profile-page">
            <section className="artist-profile-header">
                <div className="artist-profile-avatar">
                    {artist.artistName?.charAt(0).toUpperCase()}
                </div>

                <div className="artist-profile-info">
                    <p className="profile-small-title">ARTIST PROFILE</p>
                    <h1>{artist.artistName}</h1>
                    <p className="profile-genres">{artist.genres?.join(", ")}</p>
                    <p className="profile-bio">{artist.bio}</p>
                    <button className="commission-button" onClick={() => navigate(`/commission/${artist._id}`)}>Request Commission</button>
                </div>
            </section>

            <section className="profile-section">
                <div className="profile-section-heading">
                    <p>PORTFOLIO</p>
                    <h2>Featured Artworks</h2>
                </div>


            {artworks.length ===0 ? (
                <div className="empty-profile-section">
                <p>No artworks uploaded yet</p>
                </div>
            ): (
                <div className="artworks-grid">
                {artworks.map((artwork) => (
                    <div key={artwork._id} className="artwork-card">
                        <img src={artwork.image} alt={artwork.title} className="artwork-image"></img>
                        {/* <div className="artwork-placeholder"></div> */}
                        <div className="artwork-content">
                            <h3>{artwork.title}</h3>
                            <p>{artwork.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            )}
            </section>

            <section className="profile-section reviews-section">
                <div className="profile-section-heading">
                    <p>CLIENT FEEDBACK</p>
                    <h2>Reviews</h2>
                </div>

            {reviews.length === 0 ? (
                <div className="empty-profile-section">
                <p>No reviews yet.</p>
                </div>
            ):(
                <div className="reviews-list">
                {reviews.map((review) => (
                    <div key={review._id} className="review-card">
                        <div className="review-top">
                            <div className="review-avatar">
                                {review.client?.name?.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <h4>{review.client?.name}</h4>
                                <span>{"*".repeat(review.rating)}{"*".repeat(5 - review.rating)}</span>
                            </div>
                            </div>
                            <p className="review-comment">"{review.comment}"</p>
                        </div>
                ))}
                    </div>
                )}
            </section>
        </div>

        
    );
}

export default ArtistProfile;