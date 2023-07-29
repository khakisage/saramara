import React from "react";
import { CommentData } from "../../pages/Article";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

export default function Comment(props: any): JSX.Element {
  const { commentList, setCommentList, userInfo, articleId } = props;
  const [comment, setComment] = React.useState<string>("");

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInfo.uid || comment === "") {
      alert("로그인 후 이용해주세요.");
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
      const docRef = await addDoc(collection(db, "comments"), commentData);
      const commentId = docRef.id;
      await updateDoc(doc(db, "comments", commentId), { commentId });
      setComment("");
      setCommentList([...commentList, commentData]);
    } catch (err) {
      console.log(err);
    }
  };

  const commentOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleDelete = async (commentId: string) => {
    try {
      const commentRef = doc(db, "comments", commentId);
      await deleteDoc(commentRef);
      setCommentList(commentList.filter((comment: CommentData) => comment.commentId !== commentId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container mx-auto flex px-5 pt-2 items-center justify-center flex-col">
        <div className="card w-4/5 bg-first shadow-xl">
          <div className="card-body">
            <label htmlFor="comment" className="text-fourth mb-3 text-left text-2xl">
              여러분의 생각을 들려주세요!
            </label>
            {commentList &&
              commentList.map((comment: CommentData) => {
                return (
                  <>
                    <div key={comment.commentId} className="flex flex-row justify-between">
                      <div className="text-fourth w-3/5">{comment.contents}</div>
                      <button className="text-red-500" onClick={() => handleDelete(comment.commentId as string)}>
                        삭제
                      </button>
                    </div>
                  </>
                );
              })}
            <form className="flex flex-row gap-4 justify-center" onSubmit={handleComment}>
              <input
                id="comment"
                type="text"
                placeholder="자유롭게 작성해주세요."
                className="input input-bordered w-full max-w-xs text-first"
                value={comment}
                onChange={commentOnChange}
              />
              <button type="submit" className="btn btn-primary bg-third">
                등록
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
