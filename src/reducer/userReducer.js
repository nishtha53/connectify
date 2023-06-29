
const initialUsersState = {
  users: [],
  bookmarks: [],
  user: {},
};


const usersReducer = (state, { type, payload }) => {
  switch (type) {
    case "GET_ALL_USERS":
      return { ...state, users: payload };
    case "GET_ALL_BOOKMARKS":
      return { ...state, bookmarks: payload };
    case "ADD_BOOKMARK":
      return { ...state, bookmarks: payload };
    case "REMOVE_BOOKMARK":
      return { ...state, bookmarks: payload };
    case "UPDATE_FOLLOW_USER":
      return {
          ...state,
          users: state.users.map((user) => {
            const updatedUser = payload.find(({ _id }) => _id === user._id);
            return updatedUser ? updatedUser : user;
          }),
        };
    default:
      return state;
  }
};

export { initialUsersState, usersReducer };