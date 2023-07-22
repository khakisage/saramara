import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();
  return (
    <>
      <div className="hero min-h-screen bg-second">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl text-fourth font-bold">살까? 말까?</h1>
            <p className="py-6 text-fourth">다른 사람들의 생각은 어떨까요? 고민될 땐, 물어봐요!</p>
            <button className="btn bg-third text-fourth hover:bg-third2 border-none" onClick={() => navigate("/list")}>
              살펴보기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
