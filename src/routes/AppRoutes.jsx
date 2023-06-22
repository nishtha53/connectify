import { Routes, Route } from "react-router-dom";
import Login from "../pages/authentication/Login";
import Signup from "../pages/authentication/Signup";
import {Home} from "../pages/Home/Home";
import { Explore } from "../pages/Explore/Explore";
import { Bookmarks } from "../pages/Bookmarks/Bookmarks";
import Profile from "../pages/Profile/Profile";
const AppRoutes = () => {
    return (
      <div>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    );
  };
  
  export { AppRoutes };