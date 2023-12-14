import { useEffect, useState } from 'react';

const TypingTitle = () => {
  const [mainTitle, setMainTitle] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const titleText = '살까? 말까? 다른 사람들의 생각은 어떨까요?';

  useEffect(() => {
    const typing = setInterval(() => {
      setMainTitle((prev) => {
        let result;
        if (isDelete) {
          result = prev.slice(0, -1);
          if (result === '') {
            setIsDelete(false);
            setCount(0);
          }
        } else {
          result = prev ? prev + titleText[count] : titleText[0];
          if (count >= titleText.length - 1) {
            setIsDelete(true);
          } else {
            setCount(count + 1);
          }
        }

        return result;
      });
    }, 150);

    return () => clearInterval(typing);
  });

  return <h1 className="text-5xl text-fourth font-bold mb-4">{mainTitle}</h1>;
};

export default TypingTitle;
