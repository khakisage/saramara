import { useRecoilState } from "recoil";
import { articleListState, pageState } from "../store/atom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import Pagination from "react-js-pagination";
import ".././assets/css/paging.css";

type Article = {
  id: string;
  title: string;
  content: string;
  category: string;
  price: number;
  image: string | ArrayBuffer | null;
  comments: any[];
};
export default function ArticleList(): JSX.Element {
  const [articleList, setArticleList] = useRecoilState(articleListState);
  const [page, setPage] = useRecoilState(pageState);
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    const fetchArticleList = async () => {
      const querySnapshot = await getDocs(collection(db, "articles"));
      const articles: Article[] = [];
      querySnapshot.forEach((doc) => {
        articles.push({ id: doc.id, ...(doc.data() as Article) });
      });
      setArticleList(articles);
      setPageCount(articles.length);
    };
    fetchArticleList();
  }, []);

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum);
  };
  console.log("articleList", articleList);
  return (
    <div className="flex flex-col gap-4 min-h-screen bg-second ">
      <div className="flex flex-col h-auto w-full justify-center items-center mt-40 gap-4">
        {articleList.slice((page - 1) * 3, page * 3).map((article) => {
          return (
            <div key={article.id} className="card w-1/2 h-52 bg-first shadow-xl flex-row">
              <figure>
                <img className="object-cover object-center w-full h-full" src={article.image} alt="Shoes" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{article.title}</h2>
                <p>{article.price.toLocaleString()} 원</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">더 보기</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Pagination
        activePage={page}
        itemsCountPerPage={3}
        totalItemsCount={pageCount}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
        prevPageText={"<"}
        nextPageText={">"}
      />
    </div>
  );
}
