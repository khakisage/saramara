import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const loginState = atom({
  key: "loginState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const emailState = atom({
  key: "emailState",
  default: "",
});

export const passwordState = atom({
  key: "passwordState",
  default: "",
});

export const confirmPasswordState = atom({
  key: "confirmPasswordState",
  default: "",
});

export const textState = atom({
  key: "textState",
  default: "",
});

export type ArticleState = {
  id: string;
  title: string;
  content: string;
  category: string;
  price: number;
  image: string | ArrayBuffer | null;
  comments: any[];
};

export const articleState = atom<ArticleState>({
  key: "articleState",
  default: {
    id: "",
    title: "",
    content: "",
    category: "",
    price: 0,
    image: null,
    comments: [],
  },
});

export const fileState = atom({
  key: "fileState",
  default: null,
});

export const articleListState = atom<ArticleState[]>({
  key: "articleListState",
  default: [],
});

export const pageState = atom({
  key: "pageState",
  default: 1,
});

export const articleSpecState = atom<ArticleState | undefined>({
  key: "articleSpecState",
  default: undefined,
});
