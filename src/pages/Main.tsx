import { collection, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { articleListState } from '../store/atom';
import TypingTitle from '../components/common/Title';

type Article = {
  id: string;
  title: string;
  content: string;
  uid: string;
  image: string | undefined;
  price: number;
  nickname: string;
  category: string;
  good: number;
  bad: number;
};

export type Title = {
  count: number;
  setCount: (value: number) => void;
  mainTitle: string;
  setMainTitle: (value: string) => void;
  readonly titleText: string;
};

export default function Main() {
  const setArticleList = useSetRecoilState(articleListState);
  const articleList = useRecoilValue(articleListState);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticleList = async () => {
      const querySnapshot = await getDocs(collection(db, 'articles'));
      // const sth = querySnapshot.docs.map((doc) => doc.data());
      const sth = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const arr = [...sth] as Article[];
      setArticleList(arr as Article[]);
    };
    fetchArticleList();
  }, []);

  console.log('Mainpage 내부 articleList', articleList);

  return (
    <>
      <div className="hero min-h-screen bg-second">
        <div className="hero-content text-center flex-col">
          <div className="h-12">
            <TypingTitle />
          </div>
          <button
            className="btn bg-third text-fourth hover:bg-third2 border-none"
            onClick={() => navigate('/articles')}
          >
            살펴보기
          </button>
        </div>
      </div>
    </>
  );
}
