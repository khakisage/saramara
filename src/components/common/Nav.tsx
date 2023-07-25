import { MovePage } from "./utils";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { loginState, userState } from "../../store/atom";
import { useNavigate } from "react-router";
import { auth } from "../../firebase-config";
import Search from "./Search";

export default function Nav(): JSX.Element {
  const moveMain = MovePage({ url: "/" });
  const moveSignin = MovePage({ url: "/signin" });
  const navigate = useNavigate();
  const resetUserInfo = useResetRecoilState(userState);
  // const user = auth.currentUser;
  console.log("userinfo", useRecoilValue(userState));
  // const uid = user?.uid;
  // console.log("uid", uid);
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  console.log("isLogin", isLogin);
  return (
    <div className="navbar bg-first fixed">
      <div className="flex-1">
        <button className="btn btn-ghost normal-case text-xl" onClick={moveMain}>
          사라마라
        </button>
      </div>
      <div className="flex-none gap-2">
        <Search />
        {isLogin === false ? (
          <button className="btn bg-third text-fourth hover:bg-third2 border-none" onClick={moveSignin}>
            로그인
          </button>
        ) : (
          <>
            <button
              className="btn bg-third text-fourth hover:bg-third2 border-none"
              onClick={() => {
                setIsLogin(false);
                auth.signOut();
                resetUserInfo();
                navigate("/");
              }}
            >
              로그아웃
            </button>
            <button className="btn bg-third text-fourth hover:bg-third2 border-none" onClick={() => navigate("/mypage")}>
              내 정보
            </button>
            <button className="btn bg-third text-fourth hover:bg-third2 border-none" onClick={() => navigate("/post")}>
              글 작성
            </button>
          </>
        )}
      </div>
    </div>
  );
}
