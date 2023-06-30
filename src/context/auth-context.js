import { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

import { loginService,signupService } from "../services/authService";

import { useLocation, useNavigate } from "react-router-dom";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const localStorageToken = JSON.parse(localStorage.getItem("logindetails"));
  const [token, setToken] = useState(localStorageToken?.token || "");
  const [currentUser, setCurrentUser] = useState(localStorageToken?.user);
  const [loading, setIsLoading] = useState(false);

  const loginHandler = async ({ username, password }) => {
    setIsLoading(true);
    try {
      const response = await loginService(username, password);
      const {
        status,
        data: { encodedToken, foundUser },
      } = response;
      if (status === 200) {
        localStorage.setItem(
          "logindetails",
          JSON.stringify({ token: encodedToken, user: foundUser })
        );
        setToken(encodedToken);
        setCurrentUser(foundUser);
        toast.success(`Welcome back, ${foundUser.firstName}!`, {icon: "👋"})
        navigate(location?.state?.from?.pathname || "/", { replace: true });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  const signupHandler = async ({ firstName, lastName, username, password }) => {
    setIsLoading(true);
    try {
      const response = await signupService(
        firstName,
        lastName,
        username,
        password
      );
      const {
        status,
        data: { createdUser, encodedToken },
      } = response;
      if (status === 201) {
        localStorage.setItem(
          "logindetails",
          JSON.stringify({ token: encodedToken, user: createdUser })
        );
        setToken(encodedToken);
        setCurrentUser(createdUser);
        toast.success(`Hi, ${createdUser.firstName}!`, {
          icon: "👋",
        });
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  
  const logoutHandler = () => {
    localStorage.removeItem("logindetails");
    setToken(null);
    setCurrentUser(null);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

    return (
        <AuthContext.Provider
          value={{
            token,
            currentUser,
            loginHandler,
            loading,
            signupHandler,
            logoutHandler
          }}
        >
          {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

