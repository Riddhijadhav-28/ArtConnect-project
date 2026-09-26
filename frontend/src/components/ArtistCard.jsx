import { Link } from "react-router-dom";
import "./ArtistCard.css";

const ArtistCard = ({ artist }) =>{
    return(
        <Link to={`/artist/${artist._id}`} className="artist-card-link" >
        <div className="artist-card">
            <div className="artist-card-body">
                <div className="artist-avatar">{artist.artistName?.charAt(0).toUpperCase()}</div>
                <h3>{artist.artistName}</h3>
                <p className="artist-genres">{artist.genres?.join(", ")}</p>
                <p className="artist-bio">{artist.bio}</p>
                <span className="view-profile">View Profile</span>
            </div>
        </div>
        </Link>
    );
}

export default ArtistCard;