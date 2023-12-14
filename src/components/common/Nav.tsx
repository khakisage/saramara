import { MovePage } from './utils';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { loginState, loginUserState, userState } from '../../store/atom';
import { useNavigate } from 'react-router';
import { auth } from '../../firebase-config';
import Search from './Search';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Nav(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const moveMain = MovePage({ url: '/' });
  const moveSignin = MovePage({ url: '/signin' });
  const navigate = useNavigate();
  const resetUserInfo = useResetRecoilState(userState);
  const deleteUserInfo = () => localStorage.removeItem('recoil-persist');
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const loginUserInfo = useRecoilValue(loginUserState);

  const handleSignOut = () => {
    setIsLogin(false);
    auth.signOut();
    resetUserInfo();
    navigate('/');
    deleteUserInfo();
    setIsOpen(false);
  };

  const handleNavigate = (url: string) => {
    navigate(url);
    setIsOpen(false);
  };

  return (
    <div className="navbar bg-first fixed">
      <div className="flex-1">
        <button
          className="btn btn-ghost normal-case text-xl"
          onClick={moveMain}
        >
          사라마라
        </button>
      </div>
      <div className="flex-none gap-2">
        <Search />
        {isLogin === false ? (
          <button
            className="btn bg-third text-fourth hover:bg-third2 border-none"
            onClick={moveSignin}
          >
            로그인
          </button>
        ) : (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="w-10 rounded-fullhover:text-bg-fourth">
                {loginUserInfo ? (
                  <img src={loginUserInfo?.profileImg} alt="profileImage" />
                ) : (
                  <img src="/Default_profile.png" alt="profileImage" />
                )}
              </div>
            </label>
            {isOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-first2 rounded-box w-52 "
              >
                <li>
                  <button onClick={() => handleNavigate('/mypage')}>
                    내 정보
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('/post')}>
                    글 작성
                  </button>
                </li>
                <li>
                  <button onClick={handleSignOut}>로그아웃</button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
