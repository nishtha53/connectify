import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
  } from "react";

  import { useAuth } from "./auth-context";

  import { usersReducer,initialUsersState } from "../reducer/userReducer";

  import { getAllUsersService,getAllBookmarksService,addBookmarkService,removeBookmarkService } from "../services/userService";

  export const UsersContext = createContext();


  export const UsersProvider = ({ children }) => {
    const { token } = useAuth();

    const [usersState, usersDispatch] = useReducer(
      usersReducer,
      initialUsersState
    );
    const [isLoading, setIsLoading] = useState(false);
  
  
    const getAllUsers = async () => {
      setIsLoading(true);
      try {
        const {
          status,
          data: { users },
        } = await getAllUsersService();
        if (status === 200) {
          usersDispatch({ type: "GET_ALL_USERS", payload: users });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const getAllBookMarks = async () => {
      setIsLoading(true);
      try {
        const {
          status,
          data: { bookmarks },
        } = await getAllBookmarksService(token);
        if (status === 200) {
          usersDispatch({ type: "GET_ALL_BOOKMARKS", payload: bookmarks });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const addBookmarkHandler = async (postId) => {
      try {
        const {
          status,
          data: { bookmarks },
        } = await addBookmarkService(postId, token);
        if (status === 200) {
          usersDispatch({ type: "ADD_BOOKMARK", payload: bookmarks });
        }
      } catch (error) {
        const {
          response: { status },
        } = error;
        if (status === 400) {
          //console.log("Post is already bookmarked.");
        } else {
          console.error(error);
        }
      }
    };
  
    const removeBookmarkHandler = async (postId) => {
      try {
        const {
          status,
          data: { bookmarks },
        } = await removeBookmarkService(postId, token);
        if (status === 200) {
          usersDispatch({ type: "REMOVE_BOOKMARK", payload: bookmarks });
        }
      } catch (error) {
        const {
          response: { status },
        } = error;
        if (status === 400) {
          //console.log("Post not bookmarked yet.");
        } else {
          console.error(error);
        }
      }
    };
  
    const postAlreadyInBookmarks = (postId) =>
      usersState?.bookmarks?.find((id) => id === postId);
  
    useEffect(() => {
      getAllUsers();
      if (token) {
        getAllBookMarks();
      }
    }, [token]);
  
  

  
    return (
      <UsersContext.Provider value={{ usersState, usersDispatch, isLoading,addBookmarkHandler,removeBookmarkHandler,postAlreadyInBookmarks }}>
        {children}
      </UsersContext.Provider>
    );
  };
  
  export const useUsers = () => useContext(UsersContext);