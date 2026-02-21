import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function FrontendLayout() {
  return (
    <div className="layout">
      <Header />

      <main className="layout__main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default FrontendLayout;
