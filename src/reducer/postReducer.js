
const initialPostsState = {
  posts: [],
  filterType: "Latest",
};


const postsReducer = (state, { type, payload }) => {
  switch (type) {
    case "GET_ALL_POSTS":
      return { ...state, posts: payload };
    case "LIKE_POST":
      return { ...state, posts: payload };
    case "DISLIKE_POST":
      return { ...state, posts: payload };
    case "FILTER_POSTS":
      return { ...state, filterType: payload };
    default:
      return state;
  }
};

export { initialPostsState, postsReducer };