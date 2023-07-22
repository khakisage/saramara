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

export const articleState = atom({
  key: "articleState",
  default: {
    title: "",
    content: "",
    category: "",
    price: 0,
    image: "" as string | ArrayBuffer | null,
  },
});

export const fileState = atom({
  key: "fileState",
  default: null,
});
