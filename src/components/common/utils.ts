import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase-config";

export const MovePage = ({ url }: { url: string }) => {
  const navigate = useNavigate();
  const movePage = () => {
    navigate(url);
  };
  return movePage;
};

type Article = {
  id: string;
  uid: string;
  title: string;
  content: string;
  category: string;
  price: number;
  image: string | ArrayBuffer | null;
  comments: any[];
};

export const fetchArticles = async () => {
  const querySnapshot = await getDocs(collection(db, "articles"));
  const articles: any = [];
  querySnapshot.forEach((doc) => {
    articles.push({ id: doc.id, ...doc.data() });
  });
  return articles;
};
