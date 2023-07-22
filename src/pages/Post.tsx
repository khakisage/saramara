import { useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { useRecoilState } from "recoil";
import { articleState } from "../store/atom";
import ReactQuill from "react-quill";

export default function Post() {
  const modules = {
    toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote"], ["clean"]],
  };
  const formats = ["header", "bold", "italic", "underline", "strike", "blockquote"];
  const [article, setArticle] = useRecoilState(articleState);
  console.log("article", article);
  console.dir("setArticle", setArticle);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.name;
    if (type === "title") {
      console.log(e.target.value);
      setArticle({ ...article, title: e.target.value });
    } else if (type === "category") {
      console.log(e.target.value);
      setArticle({ ...article, category: e.target.value });
    } else if (type === "price") {
      console.log(e.target.value);
      setArticle({ ...article, price: +e.target.value });
    }
  };
  const onChangeQuill = (content: string) => {
    console.log(content);
    setArticle({ ...article, content: content });
  };

  const encodefileToBase64 = (fileBlob: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        setArticle({ ...article, image: reader.result as string | null | ArrayBuffer });
        resolve(reader.result);
      };
    });
  };

  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      console.log("user is leaving");
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", listener);

    return () => {
      console.log("removing beforeunload listener");
      window.removeEventListener("beforeunload", listener);
      setArticle({ title: "", category: "", price: 0, content: "", image: null });
    };
  }, []);

  return (
    <div className="hero min-h-screen bg-second">
      <div className="hero-content flex-col w-max">
        {/* <div className="text-left">
          <h1 className=" text-5xl font-bold text-fourth ">게시글 작성</h1>
        </div> */}
        <div className="card flex-shrink-0 max-w-xl shadow-2xl bg-base-100">
          <form className="card-body ">
            <div className="form-control" onChange={handleOnChange}>
              <label className="label" htmlFor="title">
                <input type="text" id="title" name="title" placeholder="제목을 입력하세요." className="w-full text-first" />
              </label>
            </div>
            <div className="form-control" onChange={handleOnChange}>
              <label className="label" htmlFor="category">
                <select id="category" name="category" className="w-full text-first select select-bordered max-w-xs">
                  <option value="1">의류</option>
                  <option value="2">신발</option>
                  <option value="3">모자</option>
                  <option value="4">악세사리</option>
                </select>
              </label>
            </div>
            <div className="form-control" onChange={handleOnChange}>
              <label className="label" htmlFor="price">
                <input type="number" id="price" name="price" placeholder="가격을 입력하세요." className="w-full text-first" />
              </label>
            </div>
            <div className="form-control">
              {article.image && <img src={article.image as string} alt="preview" className="w-1/2" />}
              <label className="label" htmlFor="image">
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="w-full text-first"
                  onChange={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.files && input.files.length > 0) {
                      encodefileToBase64(input.files[0]);
                    }
                  }}
                />
              </label>
            </div>
            <div className="form-control text-first h-full">
              <ReactQuill theme="snow" modules={modules} formats={formats} placeholder="내용을 입력해주세요" onChange={onChangeQuill} />
            </div>
            <div className="form-control mt-6 flex-row gap-1">
              <label className="btn bg-third text-fourth hover:bg-third2 border-none w-1/2">등록</label>
              <label className="btn bg-third text-fourth hover:bg-third2 border-none w-1/2">취소</label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
