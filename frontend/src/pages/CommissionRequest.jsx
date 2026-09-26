import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CommissionRequest.css";

function RequestCommission(){

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [deadline, setDeadline] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { artistId} = useParams();
    const navigate= useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true);

        try{
            const token = localStorage.getItem("token");

            const response = await axios.post("http://localhost:3000/api/commissions",
                {
                    artistId,
                    title,
                    description,
                    budget,
                    deadline
                },
                {
                    headers:{
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccessMessage(response.data.message || "Commission request sent successfully.");

            setTitle("");
            setDescription("");
            setBudget("");
            setDeadline("");
            
            setTimeout(() => {
                navigate("/myrequests");
            }, 1500);
            
        }catch(error){
            console.log(error);
            console.log(error.response?.data);
            setErrorMessage(error.response?.data?.message || "Unable to send commission request. Please try again.");
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="commission-page">
            <div className="commission-container">
                <div className="commission-heading">
                    <p>BRING YOUR IDEA TO LIFE</p>
                    <h1>Request a Commission</h1>
                    <span>Tell the artist what you have in mind and turn your creative idea into something special.</span>
                </div>

            <form className="commission-form" onSubmit={handleSubmit}>
                {errorMessage && (
                    <div className="form-error">{errorMessage}</div>
                )}

                {successMessage && (
                    <div className="form-success">{successMessage}</div>
                )}

                <div className="form-group">
                    <label>Commission Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Portrait of my pet" required />
                </div>

                <div className="form-group">
                    <label>Describe your Idea</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you would like the artist to create..." rows="6" required />
                </div>

                <div className="commission-row">
                <div className="form-group">
                    <label>Budget</label>
                    <div className="budget-input">
                    <span></span>
                    <input type="number"  value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Your budget" min="1" required/>
                </div>
                </div>

                <div className="form-group">
                    <label>Deadline</label>
                    <input type="date"  value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                </div>
                </div>

                <div className="commission-note">
                    <strong>Tip</strong>
                    <p>Give artist as much detail as possible about your idea, style and expectations.</p>
                </div>

                <button type="submit" className="send-request-btn" disabled={loading}>{loading ? "Sending Request..." : "Send Request"}</button>
            </form>
            </div>
        </div>
    );
}

export default RequestCommission;