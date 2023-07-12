import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRecoilState } from "recoil";
import { confirmPasswordState, emailState, passwordState } from "../store/atom";
import { auth } from "../firebase-config";
import { MovePage } from "../components/common/utils";

export default function Signup(): JSX.Element {
  const [email, setEmail] = useRecoilState(emailState);
  const [password, setPassword] = useRecoilState(passwordState);
  const [confirmPassword, setConfirmPassword] = useRecoilState(confirmPasswordState);
  const moveSignin = MovePage({ url: "/signin" });
  const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.name;
    if (type === "email") {
      setEmail(e.target.value);
    } else if (type === "password") {
      setPassword(e.target.value);
    } else if (type === "confirmPassword") {
      setConfirmPassword(e.target.value);
    }
  };

  const handleOnSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("회원가입에 성공하였습니다.");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        moveSignin();
      } catch (error) {
        console.dir(error);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        alert("회원가입에 실패하였습니다.");
      }
    }
  };

  const resetInput = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-first">회원가입</h1>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleOnSignup}>
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
                placeholder="password(6자 이상)"
                className="input input-bordered text-black"
                name="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={handleOnChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="password(6자 이상)"
                className="input input-bordered text-black"
                name="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                required
                onChange={handleOnChange}
              />
              {password !== confirmPassword && <p className="text-red-500">incorrect password</p>}
            </div>
            <div className="form-control mt-6">
              <label htmlFor="confirm-modal" className="modal-button btn bg-first text-fourth">
                회원가입
              </label>
            </div>
            {email !== "" && regexEmail.test(email) && password !== "" && confirmPassword !== "" && password === confirmPassword ? (
              <>
                <input type="checkbox" id="confirm-modal" className="modal-toggle" />
                <div className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg text-first">회원가입을 진행할까요?</h3>
                    <div className="modal-action">
                      <button type="submit" className="btn bg-third text-fourth hover:bg-third2 border-none">
                        네
                      </button>
                      <label htmlFor="confirm-modal" className="btn btn-outline">
                        아니오
                      </label>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <input type="checkbox" id="confirm-modal" className="modal-toggle" />
                <div className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg text-first">이메일 형식이 틀렸거나, 이미 존재합니다.</h3>
                    <div className="modal-action">
                      <label htmlFor="confirm-modal" className="btn btn-outline" onClick={resetInput}>
                        닫기
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
