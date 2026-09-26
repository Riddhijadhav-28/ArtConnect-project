import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login(){

    const [email, setEmail ]= useState("");
    const [password, setPassword ] = useState("");
    const [errorMessage, setErrorMessage]= useState("");
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        setErrorMessage("");

        try{
            const response = await axios.post(
                "http://localhost:3000/api/auth/login",{
                    email,
                    password,
                }
            );

            if(response.data.success){
                console.log("Login Successful.");
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                navigate("/");
            }

        }catch(error){
            console.log(error.response?.data || error);

            setErrorMessage(error.response?.data?.message || "Invalid email or password")
        }
    };

    return(
        <div className="login-page">
            <div className="login-container">
                <div className="login-intro">
                    <p>WELCOME TO ARTCONNECT</p>
                    <h1>Welcome back.</h1>
                    <span>Sign in to continue your creative journey.</span>
                </div>

                <div className="login-card">
                    <div className="login-card-header">
                        <h2>Login</h2>
                        <p>Enter your account details below.</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        {errorMessage && (
                            <div className="form-error">{errorMessage}</div>
                        )}
                        <div className="login-field">
                            <label>Email</label>
                            <input type="email" placeholder="Enter your email" value={email} onChange={(e)=> setEmail(e.target.value)}></input>
                        </div>

                        <div className="login-field">
                            <label>Password</label>
                            <input type="password" placeholder="Enter your password" value={password} onChange={(e)=> setPassword(e.target.value)}></input>
                        </div>

                        <button type="submit" className="login-btn">Login</button>
                    </form>
                    <p className="login-register-text">Don't have an account?{" "} <a href="/register">Create one</a></p>
                </div>
            </div>
        </div>
    )
}

export default Login;