import { useAuth } from "../../context/auth-context";
import {
  MdLogout
} from "../../utils/icons";

const SettingsModal = ({ setShowSettingsModal }) => {
  const { logoutHandler } = useAuth();

  return (
    <div className="flex flex-col w-max rounded-md shadow-lg border border-darkGrey bg-lighterPrimary">
      <>
        <button
          className="py-2 px-4 text-left cursor-pointer rounded-md hover:bg-lightPrimary text-red flex items-center justify-center"
          onClick={() => {
            logoutHandler();
            setShowSettingsModal(false);
          }}
        >
          Logout
          <MdLogout className="ml-4" />
        </button>
      </>
    </div>
  );
};

export { SettingsModal };