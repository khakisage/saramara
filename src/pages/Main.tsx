import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config";
import { useSetRecoilState } from "recoil";
import { articleListState } from "../store/atom";

type Article = {
  id: string;
  title: string;
  content: string;
  category: string;
  price: number;
  image: string | ArrayBuffer | null;
  comments: any[];
};
export default function Main() {
  const setArticleList = useSetRecoilState(articleListState);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchArticleList = async () => {
      const querySnapshot = await getDocs(collection(db, "articles"));
      const articles: any = [];
      querySnapshot.forEach((doc) => {
        articles.push({ id: doc.id, ...doc.data() });
      });
      setArticleList(articles);
    };
    fetchArticleList();
  }, []);

  return (
    <>
      <div className="hero min-h-screen bg-second">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl text-fourth font-bold">살까? 말까?</h1>
            <p className="py-6 text-fourth">다른 사람들의 생각은 어떨까요? 고민될 땐, 물어봐요!</p>
            <button className="btn bg-third text-fourth hover:bg-third2 border-none" onClick={() => navigate("/articles")}>
              살펴보기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
