import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"

function Navbar(){
    const navigate= useNavigate();
    const token = localStorage.getItem("token");
    const user= JSON.parse(localStorage.getItem("user"));

    const handleLogout =() =>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return(
        <nav className="navbar navbar-expand-lg art-navbar">
            <div className="container">
                <Link className="navbar-brand" to="/">ArtConnect</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/"><i className="bi bi-house-door me-1"></i>Home</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/artists"><i className="bi bi-palette me-1"></i>Artists</Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav align-items-lg-center">
                        {token ? (
                            <>
                            <li className="nav-item">
                                <Link className="nav-link art-dashboard-link" to="/dashboard"><i className="bi bi-grid-1x2 me-1"></i>Dashboard</Link>
                            </li>

                            {user?.role === "client" && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/myrequests"><i className="bi bi-clipboard-check me-1"></i>My Requests</Link>
                                </li>
                            )}

                            <li className="nav-item">
                                <Link className="nav-link art-profile-link" to="/profile"><i className="bi bi-person-circle me-1"></i>Profile</Link>
                            </li>

                            <li className="nav-item">
                                <button className="art-logout" onClick={handleLogout}><i className="bi bi-box-arrow-right me-1"></i>Logout</button>
                            </li>
                            </>
                        ): (<>
                        <li className="nav-item">
                            <Link className="nav-link art-login" to="/login"><i className="bi bi-box-arrow-in-right me-1"></i>Login</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="art-register" to="/register"><i className="bi bi-person-plus me-1"></i>Register</Link>
                        </li>
                        </>
                    )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
