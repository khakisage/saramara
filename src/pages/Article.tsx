import { useParams } from "react-router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { articleListState, articleSpecState, userState } from "../store/atom";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { fetchArticles } from "../components/common/utils";
import Loading from "../components/common/Loading";
import { auth, db } from "../firebase-config";
import { deleteDoc, doc } from "firebase/firestore";

export default function Article(): JSX.Element {
  const { articleId } = useParams<{ articleId: string }>();
  const setArticleList = useSetRecoilState(articleListState);
  const [articleSpec, setArticleSpec] = useRecoilState(articleSpecState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userInfo = useRecoilValue(userState);

  useEffect(() => {
    setIsLoading(true);
    fetchArticles().then((fetchedArticles) => {
      setArticleList(fetchedArticles);
      // articleSpecState에 articleList의 length가 0일 때를 대비하여 articleSpecState의 type에 undefined도 추가
      const matchedArticle = fetchedArticles.find((article) => article.id === articleId);
      setArticleSpec(matchedArticle || undefined);
      setIsLoading(false);
    });
  }, [articleId, setArticleList, setArticleSpec]);

  const handleDelete = async () => {
    if (userInfo.uid === "") {
      alert("로그인이 필요합니다.");
      return;
    }
    if (articleSpec?.uid === userInfo.uid) {
      await deleteDoc(doc(db, "articles", articleId as string)).then(() => {
        alert("삭제되었습니다.");
        window.location.href = "/";
      });
    }
  };
  return (
    <>
      <Loading isLoading={isLoading} />
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
          <img className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src={articleSpec?.image} />
          <div className="text-center lg:w-2/3 w-full">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{articleSpec?.title}</h1>
            <h2 className="mb-8 leading-relaxed">{articleSpec?.price.toLocaleString()} 원</h2>
            <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleSpec?.content || "") }}></p>
            <div className="flex justify-center">
              <button className="inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg">Button</button>
              {articleSpec?.uid === userInfo.uid ? (
                <button
                  className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              ) : (
                <button
                  className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg"
                  onClick={() => alert("권한이 없습니다.")}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
