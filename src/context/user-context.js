import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
  } from "react";

  import { toast } from "react-hot-toast";

  import { useAuth } from "./auth-context";

  import { usersReducer,initialUsersState } from "../reducer/userReducer";

  import { getAllUsersService,getAllBookmarksService,addBookmarkService,removeBookmarkService , followUserService, unfollowUserService, editUserProfileService } from "../services/userService";

  export const UsersContext = createContext();


  export const UsersProvider = ({ children }) => {
    const { token, setCurrentUser } = useAuth();

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
          toast.success("Added to bookmarks!");
        }
      } catch (error) {
        const {
          response: { status },
        } = error;
        if (status === 400) {
          toast.error("Post is already bookmarked.");
        } else {
          toast.error("Something went wrong!");
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
          toast.success("Removed from bookmarks!");
        }
      } catch (error) {
        const {
          response: { status },
        } = error;
        if (status === 400) {
          toast.error("Post not bookmarked yet.");
        } else {
          toast.error("Something went wrong!");
        }
      }
    };

    const followUserHandler = async (followUserId) => {
      setIsLoading(true);
      try {
        const {
          status,
          data: { user, followUser },
        } = await followUserService(followUserId, token);
        if (status === 200) {
          usersDispatch({
            type: "UPDATE_FOLLOW_USER",
            payload: [followUser, user],
          });
          setCurrentUser(user);
          toast.success("Followed user");
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    };
  
    const unfollowUserHandler = async (followUserId) => {
      setIsLoading(true);
      try {
        const {
          status,
          data: { user, followUser },
        } = await unfollowUserService(followUserId, token);
        if (status === 200) {
          usersDispatch({
            type: "UPDATE_FOLLOW_USER",
            payload: [followUser, user],
          });
          setCurrentUser(user);
          toast.success("Unfollowed user");
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    };

    const editUserProfileHandler = async (editInput) => {
      setIsLoading(true);
      try {
        const {
          status,
          data: { user },
        } = await editUserProfileService(editInput, token);
        if (status === 201) {
          usersDispatch({ type: "EDIT_USER_PROFILE", payload: user });
          setCurrentUser(user);
          toast.success("Updated profile successfully!");
        }
      } catch (error) {
        toast.error("Something went wrong!")
      } finally {
        setIsLoading(false);
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
      <UsersContext.Provider value={{ usersState, usersDispatch, isLoading,addBookmarkHandler,removeBookmarkHandler,postAlreadyInBookmarks, followUserHandler, unfollowUserHandler, editUserProfileHandler }}>
        {children}
      </UsersContext.Provider>
    );
  };
  
  export const useUsers = () => useContext(UsersContext);