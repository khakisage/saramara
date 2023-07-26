import { MovePage } from "./utils";
import { useRecoilState, useResetRecoilState } from "recoil";
import { loginState, userState } from "../../store/atom";
import { useNavigate } from "react-router";
import { auth } from "../../firebase-config";
import Search from "./Search";
import { Link } from "react-router-dom";

export default function Nav(): JSX.Element {
  const moveMain = MovePage({ url: "/" });
  const moveSignin = MovePage({ url: "/signin" });
  const navigate = useNavigate();
  const resetUserInfo = useResetRecoilState(userState);
  const loginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo") as string);
  const deleteUserInfo = () => localStorage.removeItem("loginUserInfo");
  const [isLogin, setIsLogin] = useRecoilState(loginState);

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
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-fullhover:text-bg-fourth">
                {loginUserInfo ? <img src={loginUserInfo.profileImg} /> : <img src="/Default_profile.png" />}
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-first2 rounded-box w-52 ">
              <li>
                <Link to={"/mypage"}>내 정보</Link>
              </li>
              <li>
                <Link to={"/post"}>글 작성</Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    auth.signOut();
                    resetUserInfo();
                    navigate("/");
                    deleteUserInfo();
                  }}
                >
                  로그아웃
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
