import { usePosts } from "../../context/post-context";
import { NewPost } from "../../components/NewPost/NewPost";
import { PostCard } from "../../components/PostCard/PostCard";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { SideBar } from "../../components/SideBar/SideBar";
import { SuggestedUsers } from "../../components/SuggestedUsers/SuggestedUsers";

const Explore = () => {
  const {
    postsState: { posts },
    isLoading,
  } = usePosts();
  return (
    <div className="grid sm:grid-cols-[5rem_1fr] lg:grid-cols-[12rem_1fr] xl:grid-cols-[13rem_1fr_20rem] w-[100%] lg:w-[80%] mb-16 sm:m-auto dark:bg-darkGrey dark:text-lightGrey transition-all duration-500">
      <SideBar />

      <div className="sm:border-x border-darkGrey dark:border-lightGrey">
        <h1 className=" p-4 sticky top-0 backdrop-blur-md z-20 border-b border-darkGrey dark:border-lightGrey flex items-center justify-between">
          <span className="text-xl font-bold">Explore</span>
          <div className="block xl:hidden">
            <SearchBar />
          </div>
        </h1>

        <div>
          <div>
            {isLoading ? (
              "Loader"
            ) : posts?.length > 0 ? (
              [...posts].map((post) => <PostCard key={post._id} post={post} />)
            ) : (
              <div className="p-4 text-center">No posts</div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden xl:block">
        <SearchBar />
        <SuggestedUsers />
      </div>
    </div>
  );
};

export { Explore };