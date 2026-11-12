import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("client");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    const handleRegister = async(e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        console.log("Registration button clicked");

        try{
            const response = await axios.post("https://artconnect-backend-87br.onrender.com/api/auth/register",{
                name,
                email,
                password,
                role,
            });

            if(response.data.success){
                setSuccessMessage(response.data.message);
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }

        }catch(error){
            console.log(error.response?.data || error);

            setErrorMessage(error.response?.data?.message || "user already exists or Registration failed");
        }
    };

    return(
        <div className="register-page">
            <div className="register-container">
                <div className="register-intro">
                    <p>JOIN ARTCONNECT</p>
                    <h1>Start your creative journey.</h1>
                    <span>Create an account and connect through art.</span>
                </div>

                <div className="register-card">
                    <div className="register-card-header">
                        <h2>Create Account</h2>
                        <p>Fill in your details to get started.</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        {errorMessage && (
                            <div className="form-error">{errorMessage}</div>
                        )}
                        {successMessage && (
                            <div className="form-success">{successMessage}</div>
                        )}
                        <div className="register-field">
                            <label>Name</label>
                            <input type="text" placeholder="Enter your name" value={name} onChange={(e)=> setName(e.target.value)}></input>
                        </div>

                        <div className="register-field">
                            <label>Email</label>
                            <input type="email" placeholder="Enter your email" value={email} onChange={(e)=> setEmail(e.target.value)}></input>
                        </div>

                        <div className="register-field">
                            <label>Password</label>
                            <input type="password" placeholder="Create a password" value={password} onChange={(e)=> setPassword(e.target.value)}></input>
                        </div>

                        <div className="register-field">
                            <label>Choose your role</label>
                            <div className="role-options">
                                <label className={`role-option ${role === "client" ? "selected" : ""}`}>
                                <input type="radio" name="role" value="client" checked={role === "client"} onChange={(e)=> setRole(e.target.value)}></input>
                                <span>
                                    <strong>Client</strong>
                                    <small>Discover and commission artwork</small>
                                </span>
                                </label>

                                <label className={`role-option ${role === "artist" ? "selected" : ""}`}>
                                    <input type="radio" name="role" value="artist" checked={role === "artist"} onChange={(e)=> setRole(e.target.value)}></input>
                                    <span>
                                        <strong>Artist</strong>
                                        <small>Showcase your work and receive commissions</small>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="register-btn">Create Account</button>
                    </form>

                    <p className="register-login-text">Already have an account?{" "} <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register;