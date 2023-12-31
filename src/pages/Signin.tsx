import React, { useState } from "react";
import { MovePage } from "../components/common/utils";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loginState, loginUserState, userState } from "../store/atom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

// interface curLoginUser {
//   displayName: string | null;
//   profileImg: string | null;
//   uid: string;
//   email: string;
//   favoriteHistory: object;
// }

export default function Signin(): JSX.Element {
  const moveSignup = MovePage({ url: "/signup" });
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const setLoginUserInfo = useSetRecoilState(loginUserState);
  const [userinfo, setUserinfo] = useRecoilState(userState); // 아직까진 사용하지 않음
  const setIsLogin = useSetRecoilState(loginState);
  const moveMain = MovePage({ url: "/" });

  // 로그인 폼 상태 변경 함수 -------------------------
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.name;
    if (type === "email") {
      setEmail(e.target.value);
    } else if (type === "password") {
      setPassword(e.target.value);
    }
  };
  // -------------------------------------------------

  // 로그인 폼 제출 함수 -----------------------------
  const submitSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === "" || password === "") return;
    try {
      await signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid)); // 유저 collection에서 해당 유저 문서 가져오기.
        // if (userDoc.exists()) {
        //   const { uid } = userCredential.user;
        //   // localStorage.setItem("loginUserInfo", JSON.stringify({ uid, email })); // 로컬 스토리지에 로그인 유저 정보 저장
        //   getUserInfo(uid);
        // }
        console.log("signin page submitSignin 내부 userDoc의 데이터", userDoc.data());
        setLoginUserInfo({ ...userDoc.data() });
        setIsLogin(true);
        alert("로그인 되었습니다.");
        moveMain();
      });
    } catch (error) {
      console.log(error);
    }
  };
  // -------------------------------------------------

  const resetInput = () => {
    setEmail("");
    setPassword("");
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      if (userCredential.user) {
        const { uid, email } = userCredential.user;

        setUserinfo({ ...userinfo, uid, email: email as string });

        // 구글 계정에서 제공되는 사용자 정보를 반영
        setLoginUserInfo({
          displayName: userCredential.user.displayName,
          profileImg: userCredential.user.photoURL,
          uid: userCredential.user.uid,
          email: email as string,
        });

        localStorage.setItem(
          "loginUserInfo",
          JSON.stringify({
            displayName: userCredential.user.displayName,
            profileImg: userCredential.user.photoURL,
            uid: userCredential.user.uid,
            email: email as string,
          })
        );

        await setDoc(doc(db, "users", uid), {
          ...userinfo,
        });
      }

      console.log("구글 로그인 완료!");
      setIsLogin(true);
      resetInput();
      moveMain();
    } catch (error) {
      console.log(error);
      alert("구글 로그인에 실패하였습니다.");
    }
  };

  // const getUserInfo = async (uid: string) => {
  //   const docRef = doc(db, "users", uid);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     console.log("Document data:", docSnap.data());
  //     setLoginUserInfo({
  //       displayName: docSnap.data()?.displayName,
  //       profileImg: docSnap.data()?.profileImg,
  //       uid: docSnap.data()?.uid,
  //       email: docSnap.data()?.email,
  //       favoriteHistory: docSnap.data()?.favoriteHistory,
  //     });
  //     setLoginUserInfo({ ...docSnap.data() });
  //     localStorage.setItem("loginUserInfo", JSON.stringify({ ...docSnap.data() }));
  //   } else {
  //     console.log("No such document!");
  //   }
  // };

  // const handleOnSignin = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
  //       console.log("로그인 성공 시 가져오는 데이터", userCredential);
  //       // setUserInfo({ ...userInfo, uid: userCredential.user?.uid, email: userCredential.user?.email as string });
  //       getUserInfo(userCredential.user?.uid as string);
  //     });
  //     console.log("로그인에 성공하였습니다.");
  //     setIsLogin(true);
  //     resetInput();
  //     moveMain();
  //   } catch (error) {
  //     console.dir(error);
  //     resetInput();
  //     alert("로그인에 실패하였습니다.");
  //   }
  // };

  return (
    <div className="hero min-h-screen bg-second">
      <div className="hero-content flex-col">
        <div className="text-center lg:text-left ">
          <h1 className="text-5xl font-bold text-fourth">로그인</h1>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={submitSignin}>
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
                value={password}
                onChange={handleOnChange}
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-first text-fourth">로그인</button>
            </div>

            <div className="form-control mt-4">
              <button className="btn bg-first text-fourth" onClick={moveSignup}>
                회원가입하러 가기
              </button>
            </div>
          </form>
          <button className="btn bg-fourth text-black" onClick={handleGoogleLogin}>
            구글 로그인
          </button>
        </div>
      </div>
    </div>
  );
}
