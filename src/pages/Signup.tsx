import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-first">회원가입</h1>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text ">Email</span>
              </label>
              <input type="text" placeholder="email" className="input input-bordered text-black" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="text" placeholder="password" className="input input-bordered text-black" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input type="text" placeholder="password" className="input input-bordered text-black" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nickname</span>
              </label>
              <input type="text" placeholder="Nickname" className="input input-bordered text-black" />
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-first text-fourth">회원가입</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
