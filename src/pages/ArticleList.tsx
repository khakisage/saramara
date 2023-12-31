import { useRecoilState, useRecoilValue } from 'recoil';
import { articleListState, categoryState, pageState } from '../store/atom';
import Pagination from 'react-js-pagination';
import '.././assets/css/paging.css';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export default function ArticleList(): JSX.Element {
  const articleList = useRecoilValue(articleListState);
  const [page, setPage] = useRecoilState(pageState);

  const [categoryFilter, setCategoryFilter] = useRecoilState(categoryState);
  const navigate = useNavigate();

  const moveToArticle = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setCategoryFilter(selectedCategory);
    localStorage.setItem('selectedCategory', selectedCategory);
  };

  useEffect(() => {
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
      setCategoryFilter(selectedCategory);
    }
  }, []);

  const filteredArticleList = articleList.filter((article) => {
    // 카테고리 선택된 값과 일치하는 게시글만 필터링
    if (categoryFilter === '1') return article;
    return article.category === categoryFilter;
  });

  const itemsCountPerPage = 3;
  const totalItemsCount = filteredArticleList.length;

  console.log('filteredArticleList', filteredArticleList);
  return (
    <>
      <div className="flex flex-col gap-4 min-h-screen bg-second overflow-y-auto">
        <div className="flex flex-col w-full justify-start items-center gap-4 mt-24">
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="select select-bordered text-first"
          >
            <option value="1">전체</option>
            <option value="2">신발</option>
            <option value="3">모자</option>
            <option value="4">악세사리</option>
            <option value="5">의류</option>
          </select>
          {filteredArticleList
            .slice((page - 1) * 3, page * 3)
            .map((article) => {
              console.log('article', article);
              return (
                <div
                  key={article.id}
                  className="card w-1/2 h-48 bg-first shadow-xl flex-row"
                >
                  <figure className=" rounded-md">
                    <img
                      className="object-fit object-center w-60 h-52"
                      src={article.image}
                      alt="Shoes"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{article.title}</h2>
                    <p>{article.price.toLocaleString()} 원</p>
                    <p className="card-text">
                      {article.good >= article.bad ? '👍' : '👎'}
                    </p>
                    <div className="card-actions justify-end">
                      <button
                        className="btn btn-primary"
                        onClick={() => moveToArticle(article.id)}
                      >
                        더 보기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <Pagination
          activePage={page}
          itemsCountPerPage={itemsCountPerPage}
          totalItemsCount={totalItemsCount}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          prevPageText={'<'}
          nextPageText={'>'}
        />
      </div>
    </>
  );
}
