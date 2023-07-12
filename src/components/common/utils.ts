import { useNavigate } from "react-router-dom";

export const MovePage = ({ url }: { url: string }) => {
  const navigate = useNavigate();
  const movePage = () => {
    navigate(url);
  };
  return movePage;
};
