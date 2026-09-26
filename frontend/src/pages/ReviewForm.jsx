import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ReviewForm.css";

function Review(){
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage]= useState("");
    const [loading, setLoading]= useState(false);

    const { artistId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        if(!comment.trim()){
            setErrorMessage("Please enter a review comment.");
            return;
        }

        try{
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.post("http://localhost:3000/api/reviews",
                {
                    artistId,
                    rating,
                    comment:comment.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccessMessage(response.data.message);
            setTimeout(() => {
                navigate("/myrequests");
            }, 1500);
            
        }catch(error){
            console.log(error);

            setErrorMessage(error.response?.data?.message || "something went wrong. Please try again.");
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="review-page">
            <div className="review-container">
                <div className="review-header">
                    <p>SHARE YOUR EXPERIENCE</p>
                    <h1>Give a Review</h1>
                    <span>Your feedback helps artists grow and inspires future clients.</span>
                </div>

                {successMessage && (
                    <div className="review-success-message">{successMessage}</div>
                )}

                {errorMessage && (
                    <div className="review-error-message">{errorMessage}</div>
                )}
                    
                    <div className="review-card">
                    <form onSubmit={handleSubmit}>
                        <div className="review-field">
                            <label>Rating</label>
                            <select value={rating} onChange={(e)=> setRating(Number(e.target.value))}>
                                <option value={1}>-Poor</option>
                                <option value={2}>-Fair</option>
                                <option value={3}>-Good</option>
                                <option value={4}>-Very Good</option>
                                <option value={5}>-Excellent</option>
                            </select>
                        </div>

                        <div className="review-field">
                            <label>Comment</label>
                            <textarea rows="5" value={comment} onChange={(e)=> setComment(e.target.value)} placeholder="Tell us about your experience..."></textarea>
                        </div>

                        <button type="submit" className="submit-review-btn" disabled={loading}>{loading ? "Submitting..." : "Submit Review"}</button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Review;