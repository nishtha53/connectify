import { useRef, useState } from "react";
import { useAuth } from "../../context/auth-context";
import { usePosts } from "../../context/post-context";
import { BsFillImageFill, FaSmile, MdCancel } from "../../utils/icons";
import { PrimaryButton } from "../Buttons/Buttons";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { uploadMedia } from "../../utils/uploadMedia";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";


const NewPost = () => {
  const { currentUser } = useAuth();
  const { createPostHandler } = usePosts();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);

  const newPostRef = useRef();

  const submitPostHandler = async (event) => {
    event.preventDefault();
    if (media) {
      const resp = await uploadMedia(media);
      createPostHandler({
        content,
        media: resp.url,
        mediaAlt: resp.original_filename,
      });
    } else {
      createPostHandler({ content, media: "", mediaAlt: "" });
    }
    setContent("");
    setMedia(null);
    newPostRef.current.innerText = "";
  };
  return (
    <div className="grid grid-cols-[2rem_1fr] gap-2 items-start text-sm border-b border-darkGrey px-4 py-3 cursor-text dark:border-lightGrey">
      <UserAvatar user={currentUser} className="h-9 w-9" />
      <form className="flex flex-col gap-2" onSubmit={submitPostHandler}>
        <div className="w-full outline-none mt-1.5 h-auto">
          <textarea
            ref={newPostRef}
            value={content}
            rows={2}
            className="w-full outline-none resize-none h-auto"
            placeholder="What is happening?!"
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {media ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(media)}
                alt="demo"
                className="w-full h-auto rounded-md"
              />
              <button
                type="button"
                className="absolute top-1.5 left-2 text-lg"
                onClick={() => setMedia(null)}
              >
                <MdCancel />
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4 mt-1.5">
          <label className="cursor-pointer text-xl">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                Math.round(e.target.files[0].size / 1024000) > 1
                  ? console.log("File size should not be more than 1Mb")
                  : setMedia(e.target.files[0])
              }
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
          <PrimaryButton
            type="submit"
            className="py-1 px-4 rounded-md disabled:opacity-80 disabled:cursor-not-allowed"
            disabled={!content.trim() && !media}
          >
            Post
          </PrimaryButton>
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
                  setContent(content + emoji.native);
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

export { NewPost };