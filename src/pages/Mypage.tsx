import { useRecoilState } from "recoil";
import { articleListState, userState } from "../store/atom";
import { auth, db } from "../firebase-config";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import Loading from "../components/common/Loading";

export default function Mypage() {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const navigate = useNavigate();
  const moveToArticle = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };
  const loginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo") as string);
  const user = auth.currentUser;
  const uid = user?.uid;
  const email = user?.email;
  const [articles, setArticles] = useRecoilState(articleListState);
  const myArticleList = articles.filter((article) => article.uid === uid);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchArticleList = async () => {
      const querySnapshot = await getDocs(collection(db, "articles"));
      const articles: any[] = [];
      querySnapshot.forEach((doc) => {
        articles.push({ id: doc.id, ...doc.data() });
      });
      setArticles(articles);
      setIsLoading(false);
    };
    fetchArticleList();
  }, []);

  useEffect(() => {
    setUserInfo({ ...userInfo, uid: uid as string, email: email as string });
  }, []);

  const encodeFileToBase64 = (fileBlob: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        setUserInfo({ ...userInfo, profileImg: reader.result as string });
        resolve(reader.result);
      };
    });
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.name;
    if (type === "nickname") {
      setUserInfo((prev) => ({ ...prev, displayName: e.target.value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  // const updateUserInfo = async (uid: string) => {
  //   await updateDoc(doc(db, "users", uid), {
  //     displayName: userInfo.displayName,
  //     profileImg: userInfo.profileImg,
  //     uid: userInfo.uid,
  //     email: userInfo.email,
  //   }).then(() => {
  //     alert("수정되었습니다.");
  //   });
  // };
  const updateUserInfo = async (uid: string) => {
    const updatedUserInfo = {
      displayName: userInfo.displayName,
      uid: userInfo.uid,
      email: userInfo.email,
      profileImg: userInfo.profileImg,
      favoriteHistory: [],
    };

    // if (typeof userInfo.profileImg === "string") {
    //   updatedUserInfo.profileImg = userInfo.profileImg;
    // } else {
    //   updatedUserInfo.profileImg = await encodeFileToBase64(userInfo.profileImg as File);
    // }

    await updateDoc(doc(db, "users", uid), updatedUserInfo)
      .then(() => {
        alert("수정되었습니다.");
        localStorage.setItem("loginUserInfo", JSON.stringify(updatedUserInfo));
      })
      .catch((err) => console.log(err.message));
  };
  return (
    <>
      <Loading isLoading={isLoading} />
      <div className="hero min-h-screen bg-second">
        <div className="hero-content flex-col">
          <div className="text-center lg:text-left ">
            <h1 className="text-5xl font-bold text-fourth">나의 정보</h1>
          </div>
          <div className="hero-content flex-row">
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <form className="card-body">
                <div className="form-control">
                  {loginUserInfo.profileImg ? (
                    <div className="avatar">
                      <div className="w-24 rounded-xl">
                        <img src={loginUserInfo.profileImg} alt="기본이미지" />
                      </div>
                    </div>
                  ) : (
                    <div className="avatar">
                      <div className="w-24 rounded-xl">
                        <img src="Default_profile.png" alt="기본이미지" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">닉네임 : {userInfo.displayName}</span>
                  </label>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="form-control mt-4 w-1/2">
                    <label htmlFor="modify-modal" className="btn bg-first text-fourth">
                      정보 수정
                    </label>
                  </div>
                </div>
                <input type="checkbox" id="modify-modal" className="modal-toggle" />
                <div className="modal">
                  <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-lg text-first">회원 정보 수정</h3>
                    <form className="card-body" onSubmit={handleSubmit}>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">닉네임</span>
                        </label>
                        <input
                          type="text"
                          placeholder="내일의 패션리더"
                          className="input input-bordered text-black"
                          name="nickname"
                          value={userInfo.displayName}
                          onChange={handleOnChange}
                          required
                        />
                      </div>
                      <div className="form-control mt-4">
                        {userInfo.profileImg ? (
                          <div className="avatar">
                            <div className="w-24 rounded-xl">
                              <img src={userInfo.profileImg as string} alt="프로필이미지" />
                            </div>
                          </div>
                        ) : (
                          <div className="avatar">
                            <div className="w-24 rounded-xl">
                              <img src="Default_profile.png" alt="기본이미지" />
                            </div>
                          </div>
                        )}
                        <label className="label" htmlFor="image">
                          <input
                            type="file"
                            id="image"
                            name="image"
                            className="w-full text-first"
                            onChange={(e) => {
                              const input = e.target as HTMLInputElement;
                              if (input.files && input.files.length > 0) {
                                encodeFileToBase64(input.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </form>
                    <div className="modal-action">
                      <label
                        htmlFor="modify-modal"
                        className="btn bg-first text-fourth"
                        onClick={async () => {
                          setUserInfo((prev) => ({ ...prev, displayName: userInfo.displayName, profileImg: userInfo.profileImg }));
                          updateUserInfo(userInfo.uid);
                        }}
                      >
                        저장
                      </label>
                      <label htmlFor="modify-modal" className="btn btn-outline">
                        닫기
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <form className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text ">내가 작성한 글</span>
                  </label>
                  {myArticleList.map((article) => {
                    return (
                      <div key={article.id} className="card w-full bg-first shadow-xl mt-2">
                        <div className="card-body">
                          <h2 className="card-title">{article.title}</h2>
                          <div className="card-actions justify-end">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                moveToArticle(article.id);
                              }}
                            >
                              더 보기
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
