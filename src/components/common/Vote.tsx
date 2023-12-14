import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React from 'react';
import { db } from '../../firebase-config';
import { useSetRecoilState } from 'recoil';
import { loginUserState } from '../../store/atom';

export default function Vote(props: any): JSX.Element {
  const { articleSpec, userInfo, setArticleSpec } = props;
  const setLoginUserState = useSetRecoilState(loginUserState);

  const updateVote = async (value: number) => {
    try {
      const articleRef = doc(db, 'articles', articleSpec.id);
      const articleDoc = await getDoc(articleRef);
      const articleData = articleDoc.data();
      const articleGood = articleData?.good;
      const articleBad = articleData?.bad;
      const favoriteHistory = { ...userInfo.favoriteHistory };
      if (value === 1) {
        // 좋아요 버튼을 눌렀다면
        if (!favoriteHistory[articleSpec.id]) {
          // 좋아요를 누른 적이 없다면
          await updateDoc(articleRef, {
            good: articleGood + 1,
          });
        } else {
          // 좋아요를 누른 적이 있다면
          await updateDoc(articleRef, {
            good: articleGood - 1,
          });
        }
      } else if (value === -1) {
        // 싫어요 버튼을 눌렀다면
        if (!favoriteHistory[articleSpec.id]) {
          // 싫어요를 누른 적이 없다면
          await updateDoc(articleRef, {
            bad: articleBad + 1,
          });
        } else {
          // 싫어요를 누른 적이 있다면
          await updateDoc(articleRef, {
            bad: articleBad - 1,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const event = parseInt(e.currentTarget.value);
    if (!userInfo.uid) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    console.log('articleSpec의 id', articleSpec.id);
    if (event === 1) {
      const favoriteHistory = { ...userInfo.favoriteHistory };
      if (!favoriteHistory[articleSpec.id]) {
        favoriteHistory[articleSpec.id] = 1;
        await updateVote(favoriteHistory[articleSpec.id]);
        setLoginUserState({
          ...userInfo,
          favoriteHistory: favoriteHistory,
        });
        setArticleSpec({
          ...articleSpec,
          good: articleSpec.good + 1,
        });

        alert('좋아요를 눌렀습니다.');
      } else if (favoriteHistory[articleSpec.id] === 1) {
        if (favoriteHistory[articleSpec.id] === 1) {
          delete favoriteHistory[articleSpec.id];
          await updateVote(1);
          alert('좋아요를 취소했습니다.');
          setLoginUserState({
            ...userInfo,
            favoriteHistory: {},
          });
          setArticleSpec({
            ...articleSpec,
            good: articleSpec.good - 1,
          });
        } else if (favoriteHistory[articleSpec.id] === -1) {
          alert('좋아요를 취소하고, 다시 선택해주세요.');
        }
      }
      await updateDoc(doc(db, 'users', userInfo.uid), {
        favoriteHistory: favoriteHistory,
      });
    } else if (event === -1) {
      const favoriteHistory = { ...userInfo.favoriteHistory };
      if (!favoriteHistory[articleSpec.id]) {
        favoriteHistory[articleSpec.id] = -1;
        await updateVote(favoriteHistory[articleSpec.id]);
        setLoginUserState({
          ...userInfo,
          favoriteHistory: favoriteHistory,
        });
        setArticleSpec({
          ...articleSpec,
          bad: articleSpec.bad - 1,
        });

        alert('싫어요를 눌렀습니다.');
      } else {
        if (favoriteHistory[articleSpec.id] === -1) {
          delete favoriteHistory[articleSpec.id];
          await updateVote(-1);
          setLoginUserState({
            ...userInfo,
            favoriteHistory: {},
          });
          setArticleSpec({
            ...articleSpec,
            bad: articleSpec.bad + 1,
          });
          alert('싫어요를 취소했습니다.');
        } else if (favoriteHistory[articleSpec.id] === 1) {
          alert('싫어요를 취소하고, 다시 선택해주세요.');
        }
      }
      await updateDoc(doc(db, 'users', userInfo.uid), {
        favoriteHistory: favoriteHistory,
      });
    }
  };

  return (
    <>
      <form className="felx justify-center flex-row gap-8">
        <button
          value={'1'}
          className="text-white bg-red-500 border-0 mr-3 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
          onClick={handleButtonClick}
        >
          사라
        </button>
        <span className="text-fourth mr-3">{articleSpec?.good}</span>
        <button
          value={'-1'}
          className="text-white bg-red-500 border-0 mr-3 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
          onClick={handleButtonClick}
        >
          마라
        </button>
        <span className="text-fourth mr-3">{articleSpec?.bad}</span>
      </form>
    </>
  );
}
