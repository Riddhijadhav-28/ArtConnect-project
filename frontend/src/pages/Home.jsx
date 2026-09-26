import { Link } from "react-router-dom";
import "./Home.css";

function Home(){
    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <p className="hero-tagline">WHERE CREATIVITY MEETS OPPORTUNITY</p>
                    <h1>Discover Art.
                    <br />
                    <span>Connect with Artists.</span>
                    </h1>
                    <p className="hero-description">ArtConnect brings artists and art lovers together. Discover talented artists, explore their work and request unique artwork made just for you.</p>

                    <div className="hero-buttons">
                        <Link to="/artists" className="btn-primary-art">Explore Artists</Link>
                        <Link to="/register" className="btn-secondary-art">Join ArtConnect</Link>
                    </div>
                </div>

                <div className="art-circle circle-one"></div>
                <div className="art-circle circle-two"></div>
                <div className="art-circle circle-three"></div>
                <div className="hero-art">
                    <div className="art-card-large">
                        <span></span>
                        <h3>Art</h3>
                        <p>has no limits.</p>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <p className="section-small-title">WHAT YOU CAN DO</p>
                <h2>Everything you need to connect through art</h2>
                <div className="features-container">
                    <div className="feature-card">
                        <div className="feature-icon"></div>
                        <h3>Discover Artists</h3>
                        <p>Explore talented artists, their styles, portfolios and creative work</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon"></div>
                        <h3>Request Artwork</h3>
                        <p>Send a commission request and get personalized artwork created for you.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon"></div>
                        <h3>Showcase Your Art</h3>
                        <p>Artists can create profiles and showcase their artwork to potential clients.</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <h2>Have a creative idea?</h2>
                <p>Turn your idea into something beautiful with the help of a talented artist.</p>
                <Link to="/artists" className="btn-primary-art">Find an Artist</Link>
            </section>
            
        </div>
    );
}

export default Home;