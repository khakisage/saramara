import { useParams } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  articleListState,
  articleSpecState,
  loginUserState,
} from '../store/atom';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import Loading from '../components/common/Loading';
import { db } from '../firebase-config';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import Comment from '../components/common/Comment';
import Vote from '../components/common/Vote';

export interface CommentData {
  uid: string; // 댓글을 작성한 유저의 uid
  id: string;
  displayName: string; // 댓글을 작성한 유저의 닉네임
  contents: string;
  createdAt: number;
  articleId: string; // 어떤 게시물에 달린 댓글인지 알려주기 위해 사용됨, article의 id
  commentId: string; // 댓글의 id
}
export default function Article(): JSX.Element {
  const { articleId } = useParams<{ articleId: string }>(); // articles collection의 문서 id
  const articleList = useRecoilValue(articleListState);
  const [articleSpec, setArticleSpec] = useRecoilState(articleSpecState); // 필요
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userInfo = useRecoilValue(loginUserState);
  const [commentList, setCommentList] = useState<CommentData[]>([]);

  // articleList에서 articleId와 일치하는 article을 찾아서 articleSpec에 저장
  useEffect(() => {
    setIsLoading(true);
    const matchedArticle = articleList.find(
      (article: { id: string | undefined }) => article.id === articleId,
    );
    setArticleSpec(matchedArticle || undefined);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const loadComments = async () => {
      const querySnapshot = await getDocs(collection(db, 'comments'));
      const comments: any = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().articleId === articleSpec?.id) {
          comments.push({ id: doc.id, ...doc.data() });
        }
        setCommentList(comments);
      });
    };
    loadComments();
  }, [articleSpec?.id]);

  const handleDelete = async () => {
    if (userInfo.uid === '') {
      alert('로그인이 필요합니다.');
      return;
    }
    if (articleSpec?.uid === userInfo.uid) {
      await deleteDoc(doc(db, 'articles', articleId as string)).then(() => {
        alert('삭제되었습니다.');
        window.location.href = '/';
      });
    }
  };

  return (
    <>
      <Loading isLoading={isLoading} />
      <section className="bg-second text-fourth h-[100vh]">
        <div className="flex items-center justify-center absolute top-1 right-1 mt-20 mb-5 mr-60">
          {articleSpec?.uid === userInfo.uid ? (
            <button
              className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-4 focus:outline-none hover:bg-gray-200 rounded text-lg"
              onClick={handleDelete}
            >
              X
            </button>
          ) : (
            <></>
          )}
        </div>

        <div className="flex flex-col h-[100vh] items-center justify-center">
          <img
            className="object-cover object-center rounded w-96"
            alt="hero"
            src={articleSpec?.image}
          />
          <div className="mt-10">
            <h1 className="title-font sm:text-xl text-3xl mb-2 font-medium text-fourth">
              {articleSpec?.title}
            </h1>
            <h2 className="mb-4 leading-relaxed">
              가격 : {articleSpec?.price.toLocaleString()} 원
            </h2>
            <p
              className="mb-4 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(articleSpec?.content || ''),
              }}
            ></p>
            <Vote
              userInfo={userInfo}
              articleSpec={articleSpec}
              setArticleSpec={setArticleSpec}
            />
          </div>
          <div className="text-center xl2:w-1/2 w-full flex flex-col justify-center">
            <div>
              <Comment
                setCommentList={setCommentList}
                commentList={commentList}
                userInfo={userInfo}
                articleId={articleId}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
