import React from 'react';
import { CommentData } from '../../pages/Article';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebase-config';

export default function Comment(props: any): JSX.Element {
  const { commentList, setCommentList, userInfo, articleId } = props;
  const [comment, setComment] = React.useState<string>('');

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInfo.uid || comment === '') {
      alert('로그인 후 이용해주세요.');
      return;
    }
    try {
      const commentData = {
        uid: userInfo.uid,
        contents: comment,
        createdAt: new Date(),
        displayName: userInfo.displayName,
        articleId: articleId,
      };
      const docRef = await addDoc(collection(db, 'comments'), commentData);
      const commentId = docRef.id;
      await updateDoc(doc(db, 'comments', commentId), { commentId });
      setComment('');
      setCommentList([...commentList, { ...commentData, commentId }]);
    } catch (err) {
      console.log(err);
    }
  };

  const commentOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleDelete = async (commentId: string, uid: string) => {
    if (userInfo.uid !== uid) {
      alert('본인의 댓글만 삭제할 수 있습니다.');
      return;
    }
    try {
      const commentRef = doc(db, 'comments', commentId);
      await deleteDoc(commentRef);
      setCommentList(
        commentList.filter(
          (comment: CommentData) => comment.commentId !== commentId,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container mx-auto flex px-5 pt-2 mt-4 items-center justify-center flex-col">
        <div className="card w-3/5 bg-first shadow-xl">
          <div className="card-body">
            <label
              htmlFor="comment"
              className="text-fourth mb-3 text-left text-2xl"
            >
              comment
            </label>
            {commentList &&
              commentList.map((comment: CommentData) => {
                return (
                  <>
                    <div
                      key={comment.commentId}
                      className="flex flex-row justify-between"
                    >
                      <div className="text-fourth w-3/5 bg-second collapse">
                        <div className="pl-3 pt-2 mb-1">{comment.contents}</div>
                      </div>
                      <button
                        className="text-red-500"
                        onClick={() =>
                          handleDelete(comment.commentId as string, comment.uid)
                        }
                      >
                        삭제
                      </button>
                    </div>
                  </>
                );
              })}
            <form
              className="flex flex-row gap-4 justify-center mt-3"
              onSubmit={handleComment}
            >
              <input
                id="comment"
                type="text"
                placeholder="자유롭게 작성해주세요."
                className="input input-bordered w-full max-w-xs text-first"
                value={comment}
                onChange={commentOnChange}
              />
              <button
                type="submit"
                className="btn bg-third text-fourth hover:bg-third2 border-none"
              >
                등록
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
