import { Route, Routes } from "react-router-dom";
import Post from "../pages/Post";
import Main from "../pages/Main";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import Mypage from "../pages/Mypage";
import Article from "../pages/Article";
import Error from "../pages/Error";
import ArticleList from "../pages/ArticleList";

const Router = (): JSX.Element => {
  return (
    <Routes>
      <Route path="*" element={<Error />} />
      <Route path="/" element={<Main />} />
      <Route path="/articles" element={<ArticleList />} />
      <Route path="/articles/:articleId" element={<Article />} />
      <Route path="/post" element={<Post />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/mypage" element={<Mypage />} />
    </Routes>
  );
};

export default Router;
