import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const loginState = atom({
  key: "loginState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const userState = atom({
  key: "userState",
  default: {
    uid: "",
    email: "",
    displayName: "내일의 패션리더",
    profileImg: "",
    favoriteHistory: {},
  },
  // effects_UNSTABLE: [persistAtom],
});

export const loginUserState = atom({
  key: "loginUserState",
  default: {
    uid: "",
    email: "",
    displayName: "",
    profileImg: "",
    favoriteHistory: {},
  },
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
  uid: string;
  title: string;
  content: string;
  category: string;
  price: number;
  image: string | undefined;
  good: number;
  bad: number;
};

export const articleState = atom<ArticleState>({
  key: "articleState",
  default: {
    id: "",
    uid: "",
    title: "",
    content: "",
    category: "2",
    price: 0,
    good: 0,
    bad: 0,
    image: null,
    // comments: [],
  },
});

export const fileState = atom({
  key: "fileState",
  default: null,
});

export const articleListState = atom<ArticleState[]>({
  key: "articleListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const pageState = atom({
  key: "pageState",
  default: 1,
});

export const articleSpecState = atom<ArticleState | undefined>({
  key: "articleSpecState",
  default: undefined,
});

export const commentState = atom({
  key: "commentState",
  default: {
    articleId: "",
    uid: "",
    content: "",
    displayName: "",
  },
});
