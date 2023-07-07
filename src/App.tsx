import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "../src/assets/css/tailwind.css";
import Router from "./router/router";
import Nav from "./components/common/Nav";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Nav />
      <section className="h-full">
        <Router />
      </section>
    </BrowserRouter>
  );
}

export default App;
