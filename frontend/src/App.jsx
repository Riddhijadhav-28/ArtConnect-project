
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ExploreArtists from "./pages/ExploreArtists";
import ArtistProfile from "./pages/ArtistProfile";
import UploadArtwork from "./pages/UploadArtwork";
import RequestCommission from "./pages/CommissionRequest";
import MyRequests from "./pages/MyRequests";
import Review from "./pages/ReviewForm";
import Profile from "./pages/Profile";
import CreateArtistProfile from "./pages/CreateArtist";
import EditArtistProfile from "./pages/EditArtistProfile";

function App(){
  return(
    <>
    <Navbar />

    <Routes>
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/artists" element={<ExploreArtists />} />
      <Route path="/artist/:id" element={<ArtistProfile />} />
      <Route path="/upload-artwork" element={<ProtectedRoute allowedRoles={["artist"]}><UploadArtwork /></ProtectedRoute>} />
      <Route path="/commission/:artistId" element={<ProtectedRoute allowedRoles={["client"]}><RequestCommission /></ProtectedRoute>} />
      <Route path="/myrequests" element={<ProtectedRoute allowedRoles={["client"]}><MyRequests /></ProtectedRoute>} />
      <Route path="/review/:artistId" element={<ProtectedRoute allowedRoles={["client"]}><Review /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/create-artist-profile" element={ <ProtectedRoute><CreateArtistProfile></CreateArtistProfile></ProtectedRoute>}/>
      <Route path="/edit-artist-profile" element={<ProtectedRoute allowedRoles={["artist"]}><EditArtistProfile></EditArtistProfile></ProtectedRoute>}></Route>
    </Routes>
    </>
  );
}

export default App;
