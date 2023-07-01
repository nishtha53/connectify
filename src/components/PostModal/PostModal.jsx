import { useAuth } from "../../context/auth-context";
import { PrimaryButton } from "../Buttons/Buttons";
import { SecondaryButton } from "../Buttons/Buttons";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { toast } from "react-hot-toast";
import { useRef, useState } from "react";
import { BsFillImageFill, FaSmile, MdCancel } from "../../utils/icons";
import { uploadMedia } from "../../utils/uploadMedia";
import { usePosts } from "../../context/post-context";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";


const PostModal = ({ post, setShowPostModal, setShowOptions }) => {
  const { currentUser } = useAuth();
  const { createPostHandler, editPostHandler } = usePosts();
   
  const styles = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -20%)",
    width: "80%",
    height: "fit-content",
    bgcolor: "background.paper",
    boxShadow: 24,
  };
  

  const [content, setContent] = useState(post || {});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [media, setMedia] = useState(null);

  const postRef = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();
    if (post) {
      const toastId = toast.loading("Updating post...");
      if (media) {
        const resp = await uploadMedia(media);
        editPostHandler(post._id, {
          content: content?.content,
          media: resp.url,
          mediaAlt: resp.original_filename,
        });
      } else {
        editPostHandler(post._id, {
          content: content?.content,
          media: content?.mediaURL,
          mediaAlt: content?.mediaAlt,
        });
      }
      toast.success("Updated post successfully", { id: toastId });
      setShowOptions((prev) => !prev);
    } else {
      const toastId = toast.loading("Creating new post..");
      if (media) {
        const resp = await uploadMedia(media);
        createPostHandler({
          content: content?.content,
          media: resp.url,
          mediaAlt: resp.original_filename,
        });
      } else {
        createPostHandler({
          content: content?.content,
          media: "",
          mediaAlt: "",
        });
      }
      toast.success("Added new post successfully", { id: toastId });
    }
    setShowPostModal(false);
    setContent({});
    setMedia(null);
    postRef.current.innterText = "";
  };

  return (
    <div
      style={styles}
      className="grid grid-cols-[2.5rem_1fr] gap-2 items-start bg-lighterPrimary text-sm border-darkGrey px-4 py-3 cursor-text w-[90%] sm:w-[60%] xl:w-[45%] shadow-dark shadow-lg rounded-md border"
    >
      <UserAvatar user={currentUser} className="h-10 w-10" />
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <div className="w-full break-all outline-none mt-1.5 bg-lighterPrimary">
          <textarea
            ref={postRef}
            value={content?.content}
            className="w-full break-all outline-none bg-lighterPrimary resize-none h-[6rem]"
            placeholder="What is happening?!"
            onChange={(e) =>
              setContent((prev) => ({ ...prev, content: e.target.value }))
            }
          />

          {content?.mediaURL || media ? (
            <div className="relative">
              <img
                src={media ? URL.createObjectURL(media) : content?.mediaURL}
                alt={content?.mediaAlt || media.name.split(".")[0]}
              />
              <button
                type="button"
                className="absolute top-1.5 left-2 text-lg"
                onClick={() =>
                  content?.mediaURL
                    ? setContent((prev) => ({
                        ...prev,
                        mediaURL: null,
                        mediaAlt: "",
                      }))
                    : setMedia(null)
                }
              >
                <MdCancel />
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="flex justify-between gap-3 pr-2">
          <div className="flex justify-center items-center gap-3">
            <label className="cursor-pointer text-lg">
              <input
                type="file"
                accept="/image*"
                className="hidden"
                onChange={(e) => {
                  if (Math.round(e.target.files[0].size / 1024000) > 1) {
                    console.log("File size should not be more than 1Mb");
                  } else {
                    setMedia(e.target.files[0]);
                  }
                }}
              />
              <BsFillImageFill />
            </label>
            <label
            className="cursor-pointer"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <FaSmile
              className="text-xl scale-110 hover:scale-125"
              title="Add Emoji"
            />
          </label>
          </div>
          <div className="flex gap-5">
            <PrimaryButton
              type="submit"
              className="py-2.5 px-5 rounded-md disabled:opacity-80 border-lightPrimary"
              disabled={!content?.content?.trim() && !media}
            >
              {post ? "Save" : "Post"}
            </PrimaryButton>
            <SecondaryButton
              type="reset"
              className="py-1 px-4 rounded-md border-none"
              onClick={() => {
                setShowPostModal((prev) => !prev);
                post && setShowOptions((prev) => !prev);
              }}
            >
              Cancel
            </SecondaryButton>
          </div>
        </div>
      </form>
      <Modal isOpen={showEmojiPicker} onClose={() => setShowEmojiPicker(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select an Emoji</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
            <Picker
            data={data}
            emojiSize={20}
            emojiButtonSize={28}
            maxFrequentRows={0}
            navPosition="bottom"
            previewPosition="none"
            onEmojiSelect={(emoji) => {
              setContent((prev) => ({
                ...prev,
                content: prev.content
                  ? prev.content + emoji.native
                  : emoji.native,
              }));
              setShowEmojiPicker(false);
            }}
          />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

    </div>
  );
};

export { PostModal };