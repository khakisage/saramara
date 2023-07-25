import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { articleListState } from "../../store/atom";
import { Link } from "react-router-dom";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const articleList = useRecoilValue(articleListState);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const searchResult = useMemo(() => {
    return articleList.filter((article) => article.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, articleList]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setSearchQuery("");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      <div className="dropdown" ref={inputRef}>
        <button type="button" className="flex sm:hidden w-10 sm:w-auto mx-0 px-0 sm:mx-2 sm:px-2 btn btn-ghost js-search">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-gray-700 dark:stroke-white" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <input
          type="text"
          placeholder="검색"
          className="fixed left-0 top-4 -z-10 opacity-0 sm:opacity-100 sm:static sm:flex w-full input input-ghost focus:outline-0 rounded-none sm:rounded bg-gray-300 dark:bg-gray-600 !text-gray-800 dark:!text-white sm:transform-none transition-all js-searchInput"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-siid="si_input_0"
        />
        {searchQuery.length > 0 && (
          <ul className="absolute inset-x-0 z-50 bg-first divide-y divide-gray-500 rounded-md shadow-lg overflow-hidden max-h-80 overflow-y-auto">
            {searchResult.map((item) => (
              <li key={item.id} className="px-4 py-3 hover:bg-primary-500 hover:text-black transition-all cursor-pointer">
                <Link to={`/articles/${item.id}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Search;
