import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Public from "./pages/Public";
import Private from "./pages/Private";
import NotFound from "./pages/Notfound";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";

function App() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    init(); //cookie ellenőrzés "/me" endpoint-on
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/public" element={<Public />} />
          <Route path="/private" element={<Private />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* sorrend, utoljára legyen a notfound */}

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}

export default App;
