import { useParams } from "react-router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { articleListState, articleSpecState, userState } from "../store/atom";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { fetchArticles } from "../components/common/utils";
import Loading from "../components/common/Loading";
import { auth, db } from "../firebase-config";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

interface CommentData {
  uid: string;
  displayName: string;
  contents: string;
  createdAt: number;
  articleId?: string;
}
export default function Article(): JSX.Element {
  const { articleId } = useParams<{ articleId: string }>(); // articles collection의 문서 id
  const setArticleList = useSetRecoilState(articleListState);
  const [articleSpec, setArticleSpec] = useRecoilState(articleSpecState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userInfo = useRecoilValue(userState);
  const user = auth.currentUser;
  const uid = user?.uid;
  // commentList의 type은 CommentData[]로 지정해주기

  const [commentList, setCommentList] = useState<CommentData[]>([]);
  const [comment, setComment] = useState("");
  console.log("아티클스펙", articleSpec);
  console.log(userInfo);
  const loginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo") as string);
  console.log("article login user info", loginUserInfo);

  useEffect(() => {
    setIsLoading(true);
    fetchArticles().then((fetchedArticles) => {
      setArticleList(fetchedArticles);
      // articleSpecState에 articleList의 length가 0일 때를 대비하여 articleSpecState의 type에 undefined도 추가
      const matchedArticle = fetchedArticles.find((article: { id: string | undefined }) => article.id === articleId);
      setArticleSpec(matchedArticle || undefined);
      setIsLoading(false);
    });
  }, [articleId, setArticleList, setArticleSpec]);

  const commentOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setComment(e.target.value);
  };

  const typeButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const event = e.target as HTMLButtonElement;
    const updatedArticleSpec = {
      ...articleSpec,
    };
    if (event.value === "1") {
      // 좋아요 버튼을 눌렀을 때,
      // loginUserInfo의 favoriteHistory에 현재 게시물의 id가 없다면,
      // 현재 게시물의 id를 loginUserInfo의 favoriteHistory에
      // {id: articleSpec?.id, good: articleSpec?.good} 형태로 추가해준다.
      // firebase의 articles collection 에 현재 게시물의 정보가 담긴 문서에 접근하여, good를 1 증가시킨다.
      // loginUserInfo의 favoriteHistory에 현재 게시물의 id가 있다면,
      // alert를 띄워준다.
      if (!Object.keys(loginUserInfo.favoriteHistory).includes(articleSpec?.id as string)) {
        // loginUserInfo.favoriteHistory는 객체
        loginUserInfo.favoriteHistory[articleSpec!.id] = articleSpec?.good;
        updatedArticleSpec.good! += 1;
        await setDoc(doc(db, "articles", articleId), updatedArticleSpec);
        localStorage.setItem("loginUserInfo", JSON.stringify(loginUserInfo));
      } else {
        alert("이미 선택하였습니다.");
      }
      console.log("좋아요");
      //updatedArticleSpec.good = articleSpec?.good ? articleSpec.good + 1 : 1;
    } else if (event.value === "2") {
      // 싫어요 버튼을 눌렀을 때,
      // loginUserInfo의 favoriteHistory에 현재 게시물의 id가 없다면,
      // 현재 게시물의 id를 loginUserInfo의 favoriteHistory에
      // {id: articleSpec?.id, bad: articleSpec?.bad} 형태로 추가해준다.
      // firebase의 articles collection 에 현재 게시물의 정보가 담긴 문서에 접근하여, bad를 1 증가시킨다.
      // loginUserInfo의 favoriteHistory에 현재 게시물의 id가 있다면,
      // alert를 띄워준다.
      if (!Object.keys(loginUserInfo.favoriteHistory).includes(articleSpec?.id as string)) {
        loginUserInfo.favoriteHistory[articleSpec!.id] = articleSpec?.bad;
        updatedArticleSpec.bad! += 1;
        await setDoc(doc(db, "articles", articleId), updatedArticleSpec);
        await setDoc(doc(db, "users", uid), loginUserInfo);
        localStorage.setItem("loginUserInfo", JSON.stringify(loginUserInfo));
      } else {
        alert("이미 선택하였습니다.");
        console.log("싫어요");
      }

      // updatedArticleSpec.bad = articleSpec?.bad ? articleSpec.bad + 1 : 1;
    }

    await setDoc(doc(db, "articles", articleId), updatedArticleSpec);
  };
  const handleSaramara = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // e.preventDefault();
    if (!uid) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (articleSpec?.uid === loginUserInfo.uid) {
      alert("자신의 게시물에는 좋아요를 누를 수 없습니다.");
      return;
    } else {
      typeButtonClick(e);
    }
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uid) {
      console.log("여기");
      alert("로그인이 필요합니다.");
      return;
    }
    if (comment === "") {
      alert("댓글을 입력해주세요.");
      return;
    }
    try {
      const commentData: CommentData = {
        uid: loginUserInfo.uid,
        displayName: loginUserInfo.displayName,
        contents: comment,
        createdAt: Date.now(),
        articleId: articleSpec?.id,
      };
      await addDoc(collection(db, "comments"), commentData);
      console.log(commentData);
      setComment("");
      setCommentList([...commentList, commentData]);
    } catch (error) {
      console.log(error);
      alert("댓글 등록에 실패하였습니다.");
    }
  };
  useEffect(() => {
    const loadComments = async () => {
      const querySnapshot = await getDocs(collection(db, "comments"));
      const comments: any = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().articleId === articleSpec?.id) {
          comments.push({ id: doc.id, ...doc.data() });
        }
        setCommentList(comments);
        console.log("쿼리스냅샷", doc.data());
      });

      console.log(comments);
    };
    loadComments();
  }, [articleSpec?.id]);
  console.log(commentList);

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

  const handleCommentDelete = async (id: string) => {
    if (userInfo.uid !== uid) {
      alert("권한이 없습니다!");
      return;
    }
    try {
      const commentRef = doc(db, "comments", id);
      const commentSnapshot = await getDoc(commentRef);
      console.log(commentSnapshot.data());
      if (commentSnapshot.exists()) {
        const commentData = commentSnapshot.data() as CommentData;
        if (commentData.uid === userInfo.uid) {
          await deleteDoc(commentRef);
          alert("댓글이 삭제되었습니다.");
          setCommentList(commentList.filter((comment) => comment.uid !== commentData.uid));
        } else {
          alert("댓글을 삭제할 권한이 없습니다.");
        }
      }
    } catch (error) {
      console.log(error);
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
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-fourth">{articleSpec?.title}</h1>
            <h2 className="mb-8 leading-relaxed">{articleSpec?.price.toLocaleString()} 원</h2>
            <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleSpec?.content || "") }}></p>
            <p className="mb-8 leading-relaxed">{/* 사라 버튼 클릭 수, 마라 버튼 클릭 수 */}</p>
            <div className="felx justify-center flex-row gap-8 mb-5">
              <button
                value={1}
                className="text-white bg-red-500 border-0 mr-3 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
                onClick={handleSaramara}
              >
                사라
              </button>
              <span className="text-fourth mr-3">{articleSpec?.good}</span>
              <button
                value={2}
                className="text-white bg-red-500 border-0 mr-3 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
                onClick={handleSaramara}
              >
                마라
              </button>
              <span className="text-fourth mr-3">{articleSpec?.bad}</span>
            </div>
            <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
              <div className="card w-96 bg-first shadow-xl">
                <form className="card-body" onSubmit={handleComment}>
                  <label htmlFor="comment" className="text-fourth">
                    여러분의 생각은?
                  </label>
                  {commentList &&
                    commentList.map((comment: any) => {
                      return (
                        <>
                          <div key={comment.uid} className="text-fourth">
                            {comment.contents}
                          </div>
                        </>
                      );
                    })}
                  <div className="flex flex-row gap-4">
                    <input
                      id="comment"
                      type="text"
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs text-first"
                      value={comment}
                      onChange={commentOnChange}
                    />
                    <button type="submit" className="btn btn-primary bg-third">
                      등록
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
