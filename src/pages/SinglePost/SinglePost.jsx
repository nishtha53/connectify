import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { SuggestedUsers } from "../../components/SuggestedUsers/SuggestedUsers";
import { SideBar } from "../../components/SideBar/SideBar";
import { UserAvatar } from "../../components/UserAvatar/UserAvatar";
import { UsersModal } from "../../components/UsersModal/UsersModal";
import { PostOptionsModal } from "../../components/PostOptionModal/PostOptionModal";
import { useAuth } from "../../context/auth-context";
import { usePosts } from "../../context/post-context";
import { useUsers } from "../../context/user-context";
import { getPostDate } from "../../utils/getPostDate";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import { sharePost } from "../../utils/sharePost";
import {
    FaArrowLeft,
    FaBookmark,
    FaHeart,
    FaRegBookmark,
    FaRegComments,
    FaRegHeart,
    HiDotsHorizontal,
    MdShare,
} from "../../utils/icons";

const SinglePost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();


    const { currentUser } = useAuth();
    const {
        postsState: { post: currentPost },
        getSinglePost,
        likePostHandler,
        dislikePostHandler,
        likedByLoggedUser,
    } = usePosts();
    const {
        usersState: { users },
        addBookmarkHandler,
        removeBookmarkHandler,
        postAlreadyInBookmarks,
        handleBtnsClick,
    } = useUsers();

    const [showOptions, setShowOptions] = useState(false);
    const [likesModal, setLikesModal] = useState({
        show: false,
        title: "",
        list: [],
    });


    const userWhoPosted = users?.find(
        (user) => user.username === currentPost?.username
    );


    useEffect(() => {
        getSinglePost(postId);
    }, [postId, currentPost]);

    return (
        <div className="grid sm:grid-cols-[5rem_1fr] lg:grid-cols-[12rem_1fr] xl:grid-cols-[13rem_1fr_20rem] w-[100%] lg:w-[80%] mb-16 sm:m-auto dark:bg-darkColor dark:text-lightGrey transition-all duration-500">
        <SideBar />
  
        <div className="sm:border-x border-darkGrey dark:border-lightGrey">
          <h1 className=" p-3 sticky top-0 backdrop-blur-md z-20 border-b border-darkGrey dark:border-lightGrey flex items-center">
            <FaArrowLeft
              className="mr-5 mx-1 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <span>
              <p>Post</p>
            </span>
          </h1>
  
          <div>
            {currentPost?.username ? (
              <div className="flex flex-col gap-2 text-sm border-b border-darkGrey px-4 py-3 break-words">
                <div className="grid grid-cols-[2.25rem_1fr] gap-2">
                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${currentPost?.username}`);
                    }}
                  >
                    <UserAvatar user={userWhoPosted} className="h-9 w-9" />
                  </div>
  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <div
                        className="flex gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/profile/${currentPost?.username}`);
                        }}
                      >
                        <div className="flex flex-col cursor-pointer">
                          <span className="font-bold tracking-wide">
                            {userWhoPosted?.firstName +
                              " " +
                              userWhoPosted?.lastName}
                          </span>
                          <span className="text-[grey] -mt-1">
                            @{userWhoPosted?.username}
                          </span>
                        </div>
                        <span className="text-[grey]">.</span>
                        <div className="text-[grey]">
                          {getPostDate(currentPost?.createdAt)}
                        </div>
                      </div>
  
                      <div className="relative">
                        <HiDotsHorizontal
                          className="cursor-pointer text-lg m-2 hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowOptions((prev) => !prev);
                          }}
                        />
                        {showOptions && (
                          <PostOptionsModal
                            post={currentPost}
                            setShowOptions={setShowOptions}
                          />
                        )}
                      </div>
                    </div>
  
                    <div>{currentPost?.content}</div>
  
                    {currentPost?.mediaURL &&
                      (currentPost?.mediaURL.split("/")[4] === "image" ? (
                        <img
                          src={currentPost?.mediaURL}
                          alt={currentPost?.mediaAlt}
                          className="w-full h-auto rounded-md"
                        />
                      ) : (
                        <video controls className="w-full h-auto rounded-md">
                          <source src={currentPost?.mediaURL} type="video/mp4" />
                        </video>
                      ))}
                  </div>
                </div>
  
                {currentPost?.likes?.likeCount > 0 && (
                  <button
                    className="border-t border-darkGrey text-left pt-2 mt-2 cursor-pointer hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLikesModal(() => ({
                        show: true,
                        title: "Liked By",
                        list: currentPost?.likes?.likedBy,
                      }));
                    }}
                  >
                    <span className="font-bold">
                      {currentPost?.likes?.likeCount}
                    </span>{" "}
                    <span className="text-[grey]">Likes</span>
                  </button>
                )}
  
                <div className="flex justify-evenly gap-6 mt-1 -mb-1 border-t border-darkGrey">
                  <div className="flex justify-center p-2 mr-4">
                    <button
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        likedByLoggedUser(currentPost, currentUser)
                          ? handleBtnsClick(
                              400,
                              dislikePostHandler,
                              currentPost?._id
                            )
                          : handleBtnsClick(
                              400,
                              likePostHandler,
                              currentPost?._id
                            );
                      }}
                    >
                      {likedByLoggedUser(currentPost, currentUser) ? (
                        <FaHeart className="text-lg text-red hover:scale-125" />
                      ) : (
                        <FaRegHeart className="text-lg hover:scale-125" />
                      )}
                    </button>
                    {currentPost?.likes?.likeCount > 0 && (
                      <span className="ml-2">
                        {currentPost?.likes?.likeCount}
                      </span>
                    )}
                  </div>
  
                  <div className="flex justify-center p-2 mr-4">
                    <button
                      className="cursor-pointer"
                    >
                      <FaRegComments className="text-lg hover:scale-125" />
                    </button>
                  </div>
  
                  <button
                    className="cursor-pointer p-2 mr-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      postAlreadyInBookmarks(currentPost?._id)
                        ? handleBtnsClick(
                            400,
                            removeBookmarkHandler,
                            currentPost?._id
                          )
                        : handleBtnsClick(
                            400,
                            addBookmarkHandler,
                            currentPost?._id
                          );
                    }}
                  >
                    {postAlreadyInBookmarks(currentPost?._id) ? (
                      <FaBookmark className="text-lg hover:scale-125" />
                    ) : (
                      <FaRegBookmark className="text-lg hover:scale-125" />
                    )}
                  </button>
  
                  <button
                    className="cursor-pointer p-2 mr-4"
                    onClick={(e) => {
                        e.stopPropagation();
                        sharePost(currentPost?._id);
                      }}
                  >
                    <MdShare className="text-lg hover:scale-125" />
                  </button>
                </div>
  
                <div className="grid grid-cols-[2.25rem_1fr] gap-2 pt-3 border-t border-darkGrey">
                  <UserAvatar user={currentUser} className="h-9 w-9" />
  
                  
                </div>  
              </div>
            ) : (
              "loader"
            )}
          </div>
        </div>
  
        {likesModal.show && (
          <Modal isOpen={likesModal.show} onClose={() => setLikesModal(() => ({ show: false, title: "", list: [] }))}>
          <ModalOverlay />
          <ModalContent width="100%" maxWidth="500px" maxHeight="90vh" height="60%">
            <ModalHeader>{likesModal.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <UsersModal usersListModal={likesModal} setUsersListModal={setLikesModal} />
            </ModalBody>
          </ModalContent>
        </Modal>
        )}
  
        <div className="hidden xl:block">
          <SearchBar />
          <SuggestedUsers />
        </div>
      </div>

    );
};

                            export {SinglePost};