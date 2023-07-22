import { useRecoilState } from "recoil";
import { loginState } from "../store/atom";

export default function Error() {
  const isLogin = useRecoilState(loginState);
  return (
    <>
      {isLogin ? (
        <div className="hero min-h-screen bg-second">
          <div className="hero-content flex-col">
            <div className="text-left">로그인이 필요합니다.</div>
          </div>
        </div>
      ) : (
        <div className="hero min-h-screen bg-second">
          <div className="hero-content flex-col">
            <div className="text-left">잘못된 접근입니다.</div>
          </div>
        </div>
      )}
    </>
  );
}
