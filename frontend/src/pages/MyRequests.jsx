import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyRequests.css";

function MyRequests() {

    const [dashboard, setDashboard] = useState({});
    const [requests, setRequests] = useState([]);
    const [reviewedArtists, setReviewedArtists] = useState([]);

    const navigate = useNavigate();

    const fetchDashboard = async () => {

        try {
            const token = localStorage.getItem("token");

            const response = await axios.get("https://artconnect-backend-87br.onrender.com/api/dashboard/client",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDashboard(response.data.dashboard);
            const commissions =
                response.data.dashboard.recentCommissions || [];
            setRequests(commissions);

            // Check which artists have already been reviewed
            const completedRequests = commissions.filter(
                (request) =>
                    request.status === "Completed" &&
                    request.artist?._id
            );

            const reviewChecks = await Promise.all(
                completedRequests.map(async (request) => {
                    try {
                        const reviewResponse = await axios.get(
                            `https://artconnect-backend-87br.onrender.com/api/reviews/${request.artist._id}`
                        );

                        const reviews =
                            reviewResponse.data.reviews || [];

                        const user = JSON.parse(
                            localStorage.getItem("user")
                        );

                        const alreadyReviewed = reviews.some(
                            (review) =>
                                review.client?._id === user?.id
                        );

                        return alreadyReviewed
                            ? request.artist._id
                            : null;

                    } catch (error) {
                        console.log(error);
                        return null;
                    }
                })
            );

            setReviewedArtists(
                reviewChecks.filter((artistId) => artistId !== null)
            );
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const hasReviewedArtist = (artistId) => {
        return reviewedArtists.includes(artistId);
    };

    return (
        <div className="my-requests-page">
            <div className="requests-container">
                <div className="requests-header">
                    <p>YOUR COMMISSION JOURNEY</p>
                    <h1>My Requests</h1>
                    <span>Keep track of your artwork commissions and their progress.</span>
                </div>

                <div className="request-stats">
                    <div className="request-stat-card">
                        <span className="stat-number">
                            {dashboard.totalCommissions || 0}
                        </span>

                        <span className="stat-label">Total</span>
                    </div>

                    <div className="request-stat-card pending">
                        <span className="stat-number">
                            {dashboard.pendingCommissions || 0}
                        </span>

                        <span className="stat-label">Pending</span>
                    </div>

                    <div className="request-stat-card accepted">
                        <span className="stat-number">
                            {dashboard.acceptedCommissions || 0}
                        </span>

                        <span className="stat-label">Accepted</span>
                    </div>

                    <div className="request-stat-card rejected">
                        <span className="stat-number">
                            {dashboard.rejectedCommissions || 0}
                        </span>

                        <span className="stat-label">Rejected</span>
                    </div>

                    <div className="request-stat-card completed">
                        <span className="stat-number">
                            {dashboard.completedCommissions || 0}
                        </span>

                        <span className="stat-label">Completed</span>
                    </div>
                </div>

                <div className="requests-section">
                    <h2>Your Commission Requests</h2>

                    {requests.length === 0 ? (
                        <div className="no-requests">
                            <div className="no-requests-icon"></div>
                            <h3>No requests yet</h3>
                            <p>Explore artists and send your first commission request.</p>
                        </div>
                    ) : (
                        <div className="requests-list">
                            {requests.map((request) => (
                                <div key={request._id} className="request-card">
                                    <div className="request-card-top">
                                        <div>
                                            <h3>{request.title}</h3>
                                            <p className="request-artist">
                                                Artist:{" "}
                                                <strong>
                                                    {request.artist?.artistName ||
                                                        "Unknown"}
                                                </strong>
                                            </p>
                                        </div>

                                        <span className={`request-status status-${request.status?.toLowerCase()}`}>
                                            {request.status}
                                        </span>
                                    </div>

                                    <p className="request-description">{request.description}</p>

                                    <div className="request-details">
                                        <div>
                                            <span>Budget</span>
                                            <strong>{request.budget}</strong>
                                        </div>

                                        <div>
                                            <span>Deadline</span>
                                            <strong>
                                                {new Date(
                                                    request.deadline
                                                ).toLocaleDateString("en-IN")}
                                            </strong>
                                        </div>
                                    </div>

                                    {request.status === "Completed" &&
                                        request.artist?._id &&
                                        !hasReviewedArtist(request.artist._id) && (

                                            <button className="review-request-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/review/${request.artist._id}`
                                                    )
                                                }
                                            >
                                                Give Review
                                            </button>
                                        )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyRequests;