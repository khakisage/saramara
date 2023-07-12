import React from "react";
import { MovePage } from "./utils";
import { useRecoilState } from "recoil";
import { loginState } from "../../store/atom";

export default function Nav(): JSX.Element {
  const moveMain = MovePage({ url: "/" });
  const moveSignin = MovePage({ url: "/signin" });
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  console.log("isLogin", isLogin);
  return (
    <div className="navbar bg-first">
      <div className="flex-1">
        <button className="btn btn-ghost normal-case text-xl" onClick={moveMain}>
          사라마라
        </button>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto text-black" />
        </div>
        {isLogin === false ? (
          <button className="btn bg-third text-fourth hover:bg-third2 border-none" onClick={moveSignin}>
            로그인
          </button>
        ) : (
          <button className="btn bg-third text-fourth hover:bg-third2 border-none" onClick={() => setIsLogin(false)}>
            로그아웃
          </button>
        )}
      </div>
    </div>
  );
}
