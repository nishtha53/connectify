import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
  } from "react";

  import { toast } from "react-hot-toast";

import { initialPostsState,postsReducer } from "../reducer/postReducer";


import { getAllPostsService, dislikePostService,likePostService, createPostService, editPostService, deletePostService } from "../services/postService";

import { useAuth } from "./auth-context";
export const PostsContext = createContext();


export const PostsProvider = ({ children }) => {
  const {token} = useAuth();

    const [postsState, postsDispatch] = useReducer(
      postsReducer,
      initialPostsState
    );
    const [isLoading, setIsLoading] = useState(false);
  
  
    const getAllPosts = async () => {
      setIsLoading(true);
      try {
        const {
          status,
          data: { posts },
        } = await getAllPostsService();
        if (status === 200) {
          postsDispatch({ type: "GET_ALL_POSTS", payload: posts });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const createPostHandler = async ({ content, media, mediaAlt }) => {
      setIsLoading(true);
      try {
        const {
          status,
          data: { posts },
        } = await createPostService(content, media, mediaAlt, token);
        if (status === 201) {
          postsDispatch({ type: "CREATE_NEW_POST", payload: posts });
        }
      } catch (error) {
        toast.error("Something went wrong, try again!");
      } finally {
        setIsLoading(false);
      }
    };
  
    const deletePostHandler = async (postId) => {
      try {
        const {
          status,
          data: { posts },
        } = await deletePostService(postId, token);
        if (status === 201) {
          postsDispatch({ type: "DELETE_POST", payload: posts });
          toast.success("Post deleted successfully!");
        }
      } catch (error) {
        toast.error("Something went wrong, try again");
      }
    };
  
    const editPostHandler = async (postId, { content, media, mediaAlt }) => {
      try {
        const {
          status,
          data: { posts },
        } = await editPostService(postId, content, media, mediaAlt, token);
        if (status === 201) {
          postsDispatch({ type: "EDIT_POST", payload: posts });
        }
      } catch (error) {
        toast.error("Something went wrong, try again");
      }
    };

    const likePostHandler = async (postId) => {
      try {
        const {
          status,
          data: { posts },
        } = await likePostService(postId, token);
        if (status === 201) {
          postsDispatch({ type: "LIKE_POST", payload: posts });
          toast.success("Liked a post");
        }
      } catch (error) {
        const {
          response: { status },
        } = error;
        if (status === 400) {
          toast.error("post already liked")
        } else {
          toast.error("Something went wrong");
        }
      }
    };
  
    const dislikePostHandler = async (postId) => {
      try {
        const {
          status,
          data: { posts },
        } = await dislikePostService(postId, token);
        if (status === 201) {
          postsDispatch({ type: "DISLIKE_POST", payload: posts });
          toast.success("Unliked the post");
        }
      } catch (error) {
        const {
          response: { status },
        } = error;
        if (status === 400) {
          toast.error("Cannot like a post that is already liked.");
        } else {
          toast.error("Something went wrong");
        }
      }
    };
  
    const likedByLoggedUser = (post, user) =>
      post?.likes.likedBy.find((likeUser) => likeUser.username === user.username);
  
      const filteredPosts = (posts) => {
        if (postsState.filterType) {
          if (postsState.filterType === "Trending") {
            return posts.sort((a, b) => b.likes.likeCount - a.likes.likeCount);
          } else if (postsState.filterType === "Latest") {
            return posts.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
          } else if (postsState.filterType === "Oldest") {
            return posts.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
          }
        } else {
          return posts;
        }
      };

    useEffect(() => {
        getAllPosts();
      }, []);
    
      return (
        <PostsContext.Provider value={{ postsState, postsDispatch, isLoading,likePostHandler,dislikePostHandler,likedByLoggedUser, filteredPosts, createPostHandler, editPostHandler, deletePostHandler }}>
          {children}
        </PostsContext.Provider>
      );
    };
    
    export const usePosts = () => useContext(PostsContext);