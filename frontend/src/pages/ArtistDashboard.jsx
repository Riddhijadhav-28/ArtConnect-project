import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EditArtwork from "../components/EditArtwork";
import "./ArtistDashboard.css";
import DeleteArtworkModal from "../components/DeleteArtworkModal"; 

function ArtistDashboard() {

    const [commissions, setCommissions] = useState([]);
    const [dashboard, setDashboard] = useState({});
    const [artworks, setArtworks] = useState([]);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [updatingCommission, setUpdatingCommission] = useState(null);

    const [editingArtwork, setEditingArtwork] = useState(null);
    const [updatingArtwork, setUpdatingArtwork] = useState(null);
    const [deletingArtwork, setDeletingArtwork] = useState(null);
    const [deleteArtworkConfirm, setDeleteArtworkConfirm] = useState(null);

    // =========================
    // FETCH DASHBOARD
    // =========================
    const fetchDashboard = async (showLoading = true) => {

        try {
            if (showLoading) {
                setLoading(true);
            }

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:3000/api/dashboard/artist",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDashboard(response.data.dashboard);

            setCommissions(
                response.data.dashboard.recentCommissions || []
            );

            setErrorMessage("");
        } catch (error) {
            console.log(error);
            setErrorMessage(
                "Unable to load dashboard data. Please try again"
            );
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    // =========================
    // FETCH ARTWORKS
    // =========================

    const fetchArtworks = async () => {
        try {
            const token = localStorage.getItem("token");

            const artistResponse = await axios.get(
                "http://localhost:3000/api/artists/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const artistId = artistResponse.data.artist._id;

            const artworkResponse = await axios.get(
                `http://localhost:3000/api/artworks/artist/${artistId}`
            );

            setArtworks(
                artworkResponse.data.artworks || []
            );
        } catch (error) {
            console.log(error);
            setErrorMessage(
                error.response?.data?.message ||
                "Unable to load your artworks."
            );
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {
        const loadDashboard = async () => {
            await Promise.all([
                fetchDashboard(),
                fetchArtworks(),
            ]);
        };
        loadDashboard();
    }, []);

    // =========================
    // SUCCESS MESSAGE TIMER
    // =========================
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // =========================
    // UPDATE COMMISSION STATUS
    // =========================

    const updateStatus = async (commissionId, status) => {
        try {
            setUpdatingCommission(commissionId);
            setSuccessMessage("");
            setErrorMessage("");

            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:3000/api/commissions/${commissionId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchDashboard(false);

            if (status === "Accepted") {
                setSuccessMessage("Commission accepted successfully!");
            } else if (status === "Rejected") {
                setSuccessMessage("Commission rejected successfully!");
            } else if (status === "Completed") {
                setSuccessMessage("Commission marked as completed!");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(
                error.response?.data?.message ||
                "Unable to update commission. Please try again."
            );
        } finally {
            setUpdatingCommission(null);
        }
    };

    // =========================
    // EDIT ARTWORK
    // =========================

    const handleEditArtwork = (artwork) => {
        setEditingArtwork(artwork);
        setSuccessMessage("");
        setErrorMessage("");
    };
    // =========================
    // SAVE EDITED ARTWORK
    // =========================

    const saveArtwork = async (updatedData) => {
        try {
            setUpdatingArtwork(editingArtwork._id);
            setSuccessMessage("");
            setErrorMessage("");

            const token = localStorage.getItem("token");

            const response = await axios.put(
                `http://localhost:3000/api/artworks/${editingArtwork._id}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setArtworks((previousArtworks) =>
                previousArtworks.map((artwork) =>
                    artwork._id === editingArtwork._id ? response.data.artwork : artwork
                )
            );
            setEditingArtwork(null);
            setSuccessMessage("Artwork updated successfully!");
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response?.data?.message || "Unable to update artwork. Please try again.");
        } finally {
            setUpdatingArtwork(null);
        }
    };

    // =========================
    // DELETE ARTWORK
    // =========================

    const deleteArtwork = async (artworkId) => {
    try {
        setDeletingArtwork(artworkId);
        setSuccessMessage("");
        setErrorMessage("");

        const token = localStorage.getItem("token");

        await axios.delete(
            `http://localhost:3000/api/artworks/${artworkId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setArtworks((previousArtworks) =>
            previousArtworks.filter((artwork) => artwork._id !== artworkId)
        );

        setDeleteArtworkConfirm(null);
        setSuccessMessage("Artwork deleted successfully!");
        await fetchDashboard(false);
    } catch (error) {
        console.log(error);
        setErrorMessage(error.response?.data?.message || "Unable to delete artwork. Please try again.");
    } finally {
        setDeletingArtwork(null);
    }
};

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="artist-dashboard-page">
                <div className="artist-dashboard-container">
                    <div className="artist-loading-message">
                        Loading your dashboard...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="artist-dashboard-page">
            <div className="artist-dashboard-container">
                <div className="artist-dashboard-header">
                    <div>
                        <p>YOUR CREATIVE SPACE</p>
                        <h1><i className="bi bi-grid-1x2 me-2"></i>Artist Dashboard</h1>
                        <span>
                            Manage your commissions, artwork and creative journey.
                        </span>
                    </div>

                    <Link to="/upload-artwork" className="upload-artwork-btn"><i className="bi bi-cloud-arrow-up me-1"></i>Upload Artwork</Link>
                </div>

                {successMessage && (
                    <div className="artist-success-message"><i className="bi bi-check-circle-fill me-2"></i>{successMessage}</div>
                )}

                {errorMessage && (
                    <div className="artist-error-message"><i className="bi bi-exclamation-circle-fill me-2"></i>{errorMessage}</div>
                )}

                {!errorMessage && 
                    <>
                        {/* =========================
                            STATISTICS
                        ========================= */}
                        <div className="artist-stats">
                            <div className="artist-stat-card artwork-stat">
                                <i className="bi bi-images artist-stat-icon"></i>
                                <span className="artist-stat-number">
                                    {dashboard.totalArtworks || 0}
                                </span>

                                <span className="artist-stat-label">
                                    Total Artworks
                                </span>

                            </div>

                            <div className="artist-stat-card pending-stat">
                                <i className="bi bi-hourglass-split artist-stat-icon"></i>
                                <span className="artist-stat-number">
                                    {dashboard.pendingCommissions || 0}
                                </span>

                                <span className="artist-stat-label">Pending</span>
                            </div>

                            <div className="artist-stat-card accepted-stat">
                                <i className="bi bi-check-circle artist-stat-icon"></i>
                                <span className="artist-stat-number">
                                    {dashboard.acceptedCommissions || 0}
                                </span>

                                <span className="artist-stat-label">Accepted</span>
                            </div>


                            <div className="artist-stat-card completed-stat">
                                <i className="bi bi-check-circle-fill artist-stat-icon"></i>
                                <span className="artist-stat-number">
                                    {dashboard.completedCommissions || 0}
                                </span>

                                <span className="artist-stat-label">Completed</span>
                            </div>

                            <div className="artist-stat-card rejected-stat">
                                <i className="bi bi-x-circle artist-stat-icon"></i>
                                <span className="artist-stat-number">
                                    {dashboard.rejectedCommissions || 0}
                                </span>

                                <span className="artist-stat-label">Rejected</span>
                            </div>

                            <div className="artist-stat-card rating-stat">
                                <i className="bi bi-star-fill artist-stat-icon"></i>
                                <span className="artist-stat-number">
                                    {dashboard.averageRating || 0}
                                </span>

                                <span className="artist-stat-label">Average Rating</span>
                            </div>

                            <div className="artist-stat-card reviews-stat">
                                <i className="bi bi-chat-left-text artist-stat-icon"></i>
                                <span className="artist-stat-number">
                                    {dashboard.totalReviews || 0}
                                </span>

                                <span className="artist-stat-label">Reviews</span>
                            </div>
                        </div>
                        {/* =========================
                            ARTWORKS
                        ========================= */}

                        <div className="artist-artworks-section">
                            <div className="artworks-heading">
                                <div>
                                    <p>YOUR CREATIVE WORK</p>
                                    <h2><i className="bi bi-palette me-2"></i>Your Artworks</h2>
                                </div>

                                <span>
                                    <i className="bi bi-images me-1"></i>
                                    {artworks.length} artwork
                                    {artworks.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            {artworks.length === 0 ? (
                                <div className="no-artworks">
                                    <div className="no-artwork-icon"><i className="bi bi-palette"></i></div>
                                    <h3>No artworks uploaded yet</h3>
                                    <p>Upload your first artwork and start building your portfolio.</p>
                                    <Link to="/upload-artwork" className="upload-artwork-small-btn"><i className="bi bi-cloud-arrow-up me-1"></i>Upload Artwork</Link>
                                </div>
                            ) : (
                                <div className="artist-artworks-grid">
                                    {artworks.map((artwork) => (
                                        <div key={artwork._id} className="artist-artwork-card">
                                            <img src={artwork.image} alt={artwork.title} className="artist-artwork-image" />
                                            {editingArtwork?._id === artwork._id ? (
                                                <EditArtwork
                                                    artwork={artwork}
                                                    onSave={saveArtwork}
                                                    onCancel={() =>
                                                        setEditingArtwork(null)
                                                    }
                                                    loading={
                                                        updatingArtwork ===
                                                        artwork._id
                                                    }
                                                />
                                            ) : (
                                                <div className="artist-artwork-content">
                                                    <div>
                                                        <h3>{artwork.title}</h3>
                                                        <span className="artwork-category">
                                                            <i className="bi bi-tag me-1"></i>
                                                            {artwork.category}
                                                        </span>
                                                        <p>{artwork.description}</p>
                                                    </div>

                                                    <div className="artwork-management-actions">
                                                        <button className="edit-artwork-btn" onClick={() =>
                                                                handleEditArtwork(
                                                                    artwork
                                                                )
                                                            }>
                                                            <i className="bi bi-pencil me-1"></i> Edit
                                                        </button>

                                                        <button className="delete-artwork-btn"
                                                            onClick={() =>
                                                                setDeleteArtworkConfirm(
                                                                    artwork
                                                                )
                                                            }
                                                            disabled={deletingArtwork === artwork._id}
                                                        >
                                                            {deletingArtwork ===
                                                            artwork._id
                                                                ?(
                                                                    <>
                                                                    <i className="bi bi-hourglass-split me-1"></i>
                                                                Deleting...
                                                                </>
                                                                ):(
                                                                    <>
                                                                    <i className="bi bi-trash3 me-1"></i>
                                                                Delete
                                                                </>
                                                                )}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* =========================
                            COMMISSIONS
                        ========================= */}

                        <div className="artist-commissions-section">
                            <div className="commissions-heading">
                                <div>
                                    <p>INCOMING WORK</p>
                                    <h2><i className="bi bi-clipboard-check me-2"></i>Commission Requests</h2>
                                </div>

                                <span>
                                    <i className="bi bi-inbox me-1"></i>
                                    {commissions.length} request
                                    {commissions.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            {commissions.length === 0 ? (
                                <div className="no-commissions">
                                    <div className="no-commission-icon"><i className="bi bi-inbox"></i></div>
                                    <h3>No commission requests</h3>
                                    <p>New commission requests from clients will appear here.</p>
                                </div>
                            ) : (
                                <div className="commission-list">
                                    {commissions.map((commission) => (
                                        <div
                                            key={commission._id}
                                            className="artist-commission-card"
                                        >

                                            <div className="commission-card-header">
                                                <div>
                                                    <h3>{commission.title}</h3>
                                                    <p className="client-name"><i className="bi bi-person me-1"></i>{commission.client?.name || "Client name unavailable"}</p>
                                                    <p className="client-email"><i className="bi bi-envelope me-1"></i>{commission.client?.email || "Client email unavailable"}</p>
                                                </div>

                                                <span className={`commission-status status-${commission.status?.toLowerCase()}`}>
                                                    {commission.status === "Pending" && (
                                                        <i className="bi bi-hourglass-split me-1"></i>
                                                    )}

                                                    {commission.status === "Accepted" && (
                                                        <i className="bi bi-check-circle-full me-1"></i>
                                                    )}

                                                    {commission.status === "Rejected" && (
                                                        <i className="bi bi-x-circle me-1"></i>
                                                    )}
                                                    {commission.status}
                                                </span>
                                            </div>

                                            <p className="commission-description">{commission.description}</p>
                                            <div className="commission-info">
                                                <div>
                                                    <span><i className="bi bi-currency-rupee me-1"></i>Budget</span>
                                                    <strong><i className="bi bi-currency-rupee me-1"></i>{commission.budget}</strong>
                                                </div>

                                                <div>
                                                    <span><i className="bi bi-calender-event me-1"></i>Deadline</span>
                                                    <strong>
                                                        {new Date(
                                                            commission.deadline
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div className="commission-actions">
                                                {commission.status === "Pending" && (
                                                    <>
                                                        <button
                                                            className="accept-btn"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    commission._id,
                                                                    "Accepted"
                                                                )
                                                            }
                                                            disabled={updatingCommission ===commission._id}>
                                                            {updatingCommission ===
                                                            commission._id ? (
                                                                <>
                                                                <i className="bi bi-hourglass-split me-1"></i>
                                                                Accepting...
                                                                </>
                                                            )
                                                            :(
                                                                <>
                                                            <i className="bi bi-check-lg me-1"></i>
                                                            Accept Request
                                                            </>)}
                                                        </button>

                                                        <button
                                                            className="reject-btn"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    commission._id,
                                                                    "Rejected"
                                                                )
                                                            }
                                                            disabled={updatingCommission ===commission._id}>
                                                            {updatingCommission ===
                                                            commission._id ? (
                                                                <>
                                                                <i className="bi bi-hourglass-split me-1"></i>
                                                                Rejecting...
                                                                </>
                                                            ):( 
                                                                <>
                                                                <i className="bi bi-x-lg me-1"></i>
                                                                Reject Request
                                                            </>)}
                                                        </button>
                                                    </>
                                                )}

                                                {commission.status === "Accepted" && (
                                                    <button
                                                        className="complete-btn"
                                                        onClick={() =>
                                                            updateStatus(
                                                                commission._id,
                                                                "Completed"
                                                            )
                                                        }
                                                        disabled={updatingCommission ===commission._id}>
                                                        {updatingCommission ===
                                                        commission._id ? (
                                                            <>
                                                            <i className="bi bi-hourglass-split me-1"></i>
                                                        Completing...
                                                        </>
                                                        ):(
                                                            <>
                                                            <i className="bi bi-check 2-circle me-1"></i>
                                                            Mark as completed
                                                            </>)}
                                                    </button>
                                                )}

                                                {commission.status === "Completed" && (
                                                    <p className="completed-message"><i className="bi bi-check-circle-fill me-1"></i>Commission Completed</p>
                                                )}

                                                {commission.status === "Rejected" && (
                                                    <p className="rejected-message"><i className="bi bi-x-circle-fill me-1"></i>Commission Rejected</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                }
            </div>
            <DeleteArtworkModal
                artwork={deleteArtworkConfirm}
                onCancel={() => setDeleteArtworkConfirm(null)}
                onConfirm={() =>
                    deleteArtwork(deleteArtworkConfirm._id)
                }
                loading={
                    deletingArtwork === deleteArtworkConfirm?._id
                }
            />
        </div>
    );
}

export default ArtistDashboard;