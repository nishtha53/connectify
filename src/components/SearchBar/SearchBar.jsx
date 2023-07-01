import { FiSearch } from "../../utils/icons";
import { useUsers } from "../../context/user-context";
import { SearchedUsersModal } from "../SearchedUsersModal/SearchUserModal";


const SearchBar = () => {

  const {
    usersState: { searchInput },
    usersDispatch,
  } = useUsers();

  return (
    <div className="sticky top-[15px] mr-1 xl:mr-0 z-40">
      <div className="relative xl:mx-4 2xl:my-3 rounded-lg border border-darkGrey focus-within:border-darkPrimary bg-lightGrey ">
        <input
          type="text"
          placeholder="Search Users..."
          onChange={(e) =>
            usersDispatch({ type: "SEARCH_USER", payload: e.target.value })
          }
          value={searchInput}
          className="bg-lightGrey text-darkGrey text-sm xl:text-base py-2 px-4 w-[90%] outline-none rounded-lg"
        />
        <FiSearch className="absolute right-4 top-2.5 xl:top-3 dark:text-darkGrey" />
      </div>
      {searchInput && (
        <div className="absolute top-15 w-[90%] mx-4">
          <SearchedUsersModal />
        </div>
      )}
    </div>
  );
};

export { SearchBar };