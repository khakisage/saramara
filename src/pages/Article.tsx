import { useParams } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { articleListState, articleSpecState, loginUserState } from "../store/atom";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import Loading from "../components/common/Loading";
import { auth, db } from "../firebase-config";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import Comment from "../components/common/Comment";
import Vote from "../components/common/Vote";

export interface CommentData {
  uid: string; // 댓글을 작성한 유저의 uid
  displayName: string; // 댓글을 작성한 유저의 닉네임
  contents: string;
  createdAt: number;
  articleId?: string; // 어떤 게시물에 달린 댓글인지 알려주기 위해 사용됨, article의 id
  commentId?: string; // 댓글의 id
}
export default function Article(): JSX.Element {
  const { articleId } = useParams<{ articleId: string }>(); // articles collection의 문서 id
  console.log("articleId", articleId);
  const articleList = useRecoilValue(articleListState); // 필요

  const [articleSpec, setArticleSpec] = useRecoilState(articleSpecState); // 필요

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userInfo = useRecoilValue(loginUserState);
  const user = auth.currentUser;
  const uid = user?.uid; // 현재 로그인된 유저의 uid

  console.log("현재 로그인된 유저", user, uid);
  console.log("articleList", articleList);

  const [commentList, setCommentList] = useState<CommentData[]>([]);

  console.log("아티클스펙", articleSpec);
  console.log(userInfo);

  const loginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo") as string); // 필요 없음
  console.log("article login user info", loginUserInfo);

  // articleList에서 articleId와 일치하는 article을 찾아서 articleSpec에 저장
  useEffect(() => {
    setIsLoading(true);
    const matchedArticle = articleList.find((article: { id: string | undefined }) => article.id === articleId);
    console.log("matchedArticle", matchedArticle);
    setArticleSpec(matchedArticle || undefined);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const loadComments = async () => {
      const querySnapshot = await getDocs(collection(db, "comments"));
      const comments: any = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().articleId === articleSpec?.id) {
          comments.push({ id: doc.id, ...doc.data() });
        }
        setCommentList(comments);
        // console.log("쿼리스냅샷", doc.data());
      });

      console.log(comments);
    };
    loadComments();
  }, [articleSpec?.id]);
  console.log("1", commentList);

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
      <section className="bg-second text-fourth body-font h-full">
        <div className="flex items-center justify-center absolute top-1 right-1 mt-20 mb-5 mr-60">
          {articleSpec?.uid === userInfo.uid ? (
            <button
              className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg"
              onClick={handleDelete}
            >
              삭제하기
            </button>
          ) : (
            <button
              className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg"
              onClick={() => alert("권한이 없습니다.")}
            >
              삭제하기
            </button>
          )}
        </div>
        <div className="container mx-auto h-full flex px-5 py-24 flex-col items-center">
          <div className="flex flex-row justify-between content-between">
            <h1 className="text-4xl text-fourth mb-6 ">사? 말아?</h1>
          </div>
          <img className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src={articleSpec?.image} />
          <div className="text-center lg:w-2/3 w-full">
            <h1 className="title-font sm:text-4xl text-3xl mb-2 font-medium text-fourth">{articleSpec?.title}</h1>
            <h2 className="mb-4 leading-relaxed">{articleSpec?.price.toLocaleString()} 원</h2>
            <p className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleSpec?.content || "") }}></p>
            <Vote userInfo={userInfo} articleSpec={articleSpec} setArticleSpec={setArticleSpec} />
          </div>
          <Comment setCommentList={setCommentList} commentList={commentList} userInfo={userInfo} articleId={articleId} />
        </div>
      </section>
    </>
  );
}
