import {Navigate} from "react-router-dom";
import ArtistDashboard from "./ArtistDashboard";
import ClientDashboard from "./ClientDashboard";

function Dashboard(){
    const user= JSON.parse(localStorage.getItem("user"));

    if(!user){
        return <Navigate to="/login" />
    }

    if(user.role === "artist"){
        return <ArtistDashboard />
    }

    if(user.role === "client"){
        return <ClientDashboard />
    }

    return <h3>Invalid user role</h3>
}

export default Dashboard;