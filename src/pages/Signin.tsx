import React from "react";
import { MovePage } from "../components/common/utils";
import { useRecoilState } from "recoil";
import { emailState, loginState, passwordState } from "../store/atom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router";

export default function Signin(): JSX.Element {
  const moveSignup = MovePage({ url: "/signup" });
  const [email, setEmail] = useRecoilState(emailState);
  const [password, setPassword] = useRecoilState(passwordState);
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const moveMain = MovePage({ url: "/" });
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.name;
    if (type === "email") {
      setEmail(e.target.value);
    } else if (type === "password") {
      setPassword(e.target.value);
    }
  };

  const resetInput = () => {
    setEmail("");
    setPassword("");
  };

  const handleOnSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("로그인에 성공하였습니다.");
      setIsLogin(true);
      resetInput();
      moveMain();
    } catch (error) {
      console.dir(error);
      resetInput();
      alert("로그인에 실패하였습니다.");
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center lg:text-left ">
          <h1 className="text-5xl font-bold text-first">로그인</h1>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleOnSignin}>
            <div className="form-control">
              <label className="label">
                <span className="label-text ">Email</span>
              </label>
              <input
                type="text"
                placeholder="email"
                className="input input-bordered text-black"
                name="email"
                autoComplete="username"
                value={email}
                required
                onChange={handleOnChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered text-black"
                name="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={handleOnChange}
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-first text-fourth">로그인</button>
            </div>
            <div className="form-control mt-4">
              <button className="btn bg-fourth text-black">구글 로그인</button>
            </div>
            <div className="form-control mt-4">
              <button className="btn bg-first text-fourth" onClick={moveSignup}>
                회원가입하러 가기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
