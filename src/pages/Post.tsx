import { useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useRecoilState } from 'recoil';
import { articleState } from '../store/atom';
import ReactQuill from 'react-quill';
import { auth, db } from '../firebase-config';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router';

export default function Post() {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      ['clean'],
    ],
  };
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
  ];
  const navigate = useNavigate();
  const [article, setArticle] = useRecoilState(articleState);
  const user = auth.currentUser;
  const uid = user?.uid;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.name;
    if (type === 'title') {
      setArticle({ ...article, title: e.target.value });
    } else if (type === 'category') {
      setArticle({ ...article, category: e.target.value });
    } else if (type === 'price') {
      setArticle({ ...article, price: +e.target.value });
    }
  };
  const onChangeQuill = (content: string) => {
    setArticle({ ...article, content: content });
  };

  const encodefileToBase64 = (fileBlob: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        setArticle({ ...article, image: reader.result as string | undefined });
        resolve(reader.result);
      };
    });
  };

  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      console.log('user is leaving');
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', listener);

    return () => {
      console.log('removing beforeunload listener');
      window.removeEventListener('beforeunload', listener);
      setArticle({
        id: '',
        uid: '',
        title: '',
        category: '2',
        price: 0,
        content: '',
        image: '',
        good: 0,
        bad: 0,
      });
    };
  }, []);

  const articleData = {
    uid: uid,
    title: article.title,
    category: article.category,
    price: article.price,
    content: article.content,
    image: article.image,
    good: 0,
    bad: 0,
  };
  // firestore(db)에 데이터 저장
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!articleData.title || !articleData.price || !articleData.image) {
      alert('제목, 사진, 가격은 필수 입력 항목입니다.');
      return;
    }
    try {
      // firestore(db)에 데이터 저장
      await addDoc(collection(db, 'articles'), {
        ...articleData,
      }).then(() => {
        alert('게시글이 등록되었습니다.');
        navigate('/');
      });
      // 게시글 작성 완료 후 페이지 이동
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div className="hero min-h-screen bg-second">
      <div className="hero-content flex-col w-max">
        <div className="card flex-shrink-0 max-w-xl shadow-2xl bg-base-100">
          <form className="card-body " onSubmit={handleOnSubmit}>
            <div className="form-control" onChange={handleOnChange}>
              <label className="label" htmlFor="title">
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="제목을 입력하세요."
                  className="w-full text-first"
                />
              </label>
            </div>
            <div className="form-control" onChange={handleOnChange}>
              <label className="label" htmlFor="category">
                <select
                  id="category"
                  name="category"
                  className="w-full text-first select select-bordered max-w-xs"
                  required
                >
                  <option value="2">신발</option>
                  <option value="3">모자</option>
                  <option value="4">악세사리</option>
                  <option value="5">의류</option>
                </select>
              </label>
            </div>
            <div className="form-control" onChange={handleOnChange}>
              <label className="label" htmlFor="price">
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="가격을 입력하세요."
                  className="w-full text-first"
                  style={{ appearance: 'textfield' }}
                />
              </label>
            </div>
            <div className="form-control">
              {article.image && (
                <img
                  src={article.image as string}
                  alt="preview"
                  className="w-1/2"
                />
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
                      encodefileToBase64(input.files[0]);
                    }
                  }}
                />
              </label>
            </div>
            <div className="form-control text-first h-full mb-6">
              <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                placeholder="내용을 입력해주세요"
                onChange={onChangeQuill}
                style={{ height: '4rem', marginBottom: '2rem' }}
              />
            </div>
            <div className="form-control flex-row gap-1">
              <button
                className="btn bg-third text-fourth hover:bg-third2 border-none w-full"
                type="submit"
              >
                등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
