import { Link, Routes, Route } from "react-router";

import "./App.css";
import Home from "./pages/home";
import Produtos from "./pages/produtos";
import Contato from "./pages/contatos";

function App() {
  return (
    <main className="min-h-screen bg-[#e4e4e4]">
      <nav className="flex gap-6 bg-blue-900 p-4 text-white">
        <Link to={"/"} className="hover:underline">
          Home
        </Link>
        <Link to="/produtos" className="hover:underline">
          Produtos
        </Link>
        <Link to="/contato" className="hover:underline">
          Contato
        </Link>
      </nav>
      <div className="p-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/contato" element={<Contato />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
