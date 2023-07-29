import { useRecoilState, useRecoilValue } from "recoil";
import { articleListState, pageState } from "../store/atom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import Pagination from "react-js-pagination";
import ".././assets/css/paging.css";
import { useNavigate } from "react-router";
import Loading from "../components/common/Loading";

export default function ArticleList(): JSX.Element {
  const articleList = useRecoilValue(articleListState);
  const [page, setPage] = useRecoilState(pageState);
  const navigate = useNavigate();

  const moveToArticle = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };
  const pageCount = articleList.length;

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum);
  };
  return (
    <>
      <div className="flex flex-col gap-4 min-h-screen bg-second ">
        <div className="flex flex-col h-auto w-full justify-center items-center mt-40 gap-4">
          {articleList.slice((page - 1) * 3, page * 3).map((article) => {
            console.log("article", article);
            return (
              <div key={article.id} className="card w-1/2 h-52 bg-first shadow-xl flex-row">
                <figure>
                  <img className="object-cover object-center w-full h-full" src={article.image} alt="Shoes" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{article.title}</h2>
                  <p>{article.price.toLocaleString()} 원</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={() => moveToArticle(article.id)}>
                      더 보기
                    </button>
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
    </>
  );
}
