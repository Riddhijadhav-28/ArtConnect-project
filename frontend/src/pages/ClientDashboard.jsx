import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ClientDashboard.css";

function ClientDashboard(){
    const [commissions, setCommissions] = useState([]);
    const [dashboard, setDashboard] = useState({});

    useEffect(() => {
        const fetchDashboard = async() => {
            try{
                const token = localStorage.getItem("token");

                const response= await axios.get("http://localhost:3000/api/dashboard/client",
                    {
                        headers:{
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setDashboard(response.data.dashboard)
                setCommissions(response.data.dashboard.recentCommissions)
            }catch(error){
                console.log(error);
            }
        };

        fetchDashboard();
    }, []);

    return(
        <div className="client-dashboard-page">
            <div className="client-dashboard-container">
                <div className="client-dashboard-header">
    <div>
        <p><i className="bi bi-palette me-2"></i>YOUR CREATIVE JOURNEY</p>
        <h1><i className="bi bi-grid-1x2 me-2"></i>Client Dashboard</h1>
        <span>Track your commission requests and follow your creative projects.</span>
    </div><Link to="/client-invoices" className="client-invoices-button">
    <i className="bi bi-receipt me-2"></i>
    My Invoices
</Link>

</div>

                <div className="client-stats">
                    <div className="client-stat-card total-stat">
                        <i className="bi bi-clipboard-check client-stat-icon"></i>
                        <span className="client-stat-number">
                            {dashboard.totalCommissions || 0}
                        </span>

                        <span className="client-stat-label">
                            Total Commissions
                        </span>
                    </div>

                    <div className="client-stat-card pending-stat">
                        <i className="bi bi-hourglass-split client-stat-icon"></i>
                        <span className="client-stat-number">
                            {dashboard.pendingCommissions || 0}
                        </span>

                        <span className="client-stat-label">Pending</span>
                    </div>

                    <div className="client-stat-card accepted-stat">
                        <i className="bi bi-check-circle client-stat-icon"></i>
                        <span className="client-stat-number">
                            {dashboard.acceptedCommissions || 0}
                        </span>

                        <span className="client-stat-label">Accepted</span>
                    </div>

                    <div className="client-stat-card completed-stat">
                        <i className="bi bi-check-circle-fill client-stat-icon"></i>
                        <span className="client-stat-number">
                            {dashboard.completedCommissions || 0}
                        </span>

                        <span className="client-stat-label">Completed</span>
                    </div>

                    <div className="client-stat-card rejected-stat">
                        <i className="bi bi-x-circle client-stat-icon"></i>
                        <span className="client-stat-number">
                            {dashboard.rejectedCommissions || 0}
                        </span>

                        <span className="client-stat-label">Rejected</span>
                    </div>
                </div>

                <div className="client-commissions-section">
                    <div className="client-commissions-heading">
                        <div>
                            <p><i className="bi bi-folder2-open me-2"></i>YOUR PROJECTS</p>
                            <h2><i className="bi bi-clipboard-check me-2"></i>Commission Requests</h2>
                        </div>

                        <span>
                            <i className="bi bi-inbox me-1"></i>
                            {commissions.length} request{commissions.length !==1 ? "s":""}
                        </span>
                    </div>

                    {commissions.length === 0 ? (
                        <div className="no-client-commissions">
                            <div className="client-empty-icon"><i className="bi bi-palette"></i></div>
                            <h3>No Commission requests yet</h3>
                            <p>Explore artists and send a commission request to start your creative project.</p>
                        </div>
                    ):(
                        <div className="client-commission-list">
                            {commissions.map((commission) => (
                                <div key={commission._id} className="client-commission-card">
                                    <div className="client-commission-header">
                                        <div>
                                            <h3><i className="bi bi-brush me-2"></i>{commission.title}</h3>
                                            <p className="client-artist-name">
                                                <i className="bi bi-person me-1"></i>
                                                Artist:{" "}
                                                <strong>{commission.artist?.artistName || "Unknown"}</strong>
                                            </p>
                                        </div>
                                        <span className={`client-commission-status status-${commission.status?.toLowerCase()}`}>
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
                                    <p className="client-commission-description">{commission.description}</p>
                                    <div className="client-commission-info">
                                        <div>
                                            <span><i className="bi bi-currency-rupee me-1"></i>Budget</span>
                                            <strong><i className="bi bi-currency-rupee me-1"></i>{commission.budget}</strong>
                                        </div>

                                        <div>
                                            <span><i className="bi bi-calender-event me-1"></i>Deadline</span>
                                            <strong>{new Date(commission.deadline).toLocaleDateString("en-IN")}</strong>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ClientDashboard;