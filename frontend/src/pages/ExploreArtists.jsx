import { useEffect,useState } from "react";
import axios from "axios";
import ArtistCard from "../components/ArtistCard";
import "./ExploreArtists.css";

function ExploreArtists(){

    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const fetchArtists = async() =>{
            try{
                const response = await axios.get("https://artconnect-backend-87br.onrender.com/api/artists");

                console.log(response.data.artists);
                setArtists(response.data.artists);
            }catch(error){
                console.log(error);
            }
        };

        fetchArtists();
    },[]);

    return (
        <div className="explore-artists-page">
            <section className="artists-header">
                <p className="section-small-title">FIND THE ARTISTS</p>
                <h1>Explore Artists</h1>
                <p>Discover talented artists, explore their styles and find the perfect artist for your creative ideas.</p>
            </section>

            <section className="artists-container">
            {artists.length >0 ? (artists.map((artist) =>(
                <ArtistCard key={artist._id} artist={artist} />
            ))):(
                <p className="no-artists">No artist found</p>
            )}
            </section>
        </div>
    );
}

export default ExploreArtists;