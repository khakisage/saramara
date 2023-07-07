import React from "react";
import { Link } from "react-router-dom";
import { firestore } from "../firebase-config";
export default function Signin() {
  console.log(firestore);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center lg:text-left ">
          <h1 className="text-5xl font-bold text-first">로그인</h1>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text ">Email</span>
              </label>
              <input type="text" placeholder="email" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="text" placeholder="password" className="input input-bordered" />
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-first text-fourth">로그인</button>
            </div>
            <div className="form-control mt-4">
              <button className="btn bg-fourth text-black">구글 로그인</button>
            </div>
            <div className="form-control mt-4">
              <button className="btn bg-first text-fourth">
                <Link to="/signup">회원가입하러 가기</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
