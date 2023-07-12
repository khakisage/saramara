import { BrowserRouter } from "react-router-dom";
import "../src/assets/css/tailwind.css";
import Router from "./router/router";
import Nav from "./components/common/Nav";

function App() {
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
