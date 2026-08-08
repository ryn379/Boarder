import { BrowserRouter, Routes, Route } from "react-router-dom";
import Aircraft from "./pages/aircraft.jsx";
import LookUp from "./pages/lookup.jsx";
import OrderTable from "./pages/orderTable.jsx";
import Analytics from "./pages/analytics.jsx";
import Groups from "./pages/groups.jsx";
import Navbar from "./pages/navbar.jsx";
import Home from "./pages/home.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-[#F5F3EE] flex flex-col">
        <Navbar />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lookup" element={<LookUp />} />
            <Route path="/aircraft" element={<Aircraft />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/ordertable" element={<OrderTable />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-[#0B1D3A] font-sans">
      <div className="font-mono text-xs tracking-[0.2em] text-[#7C8698] mb-3">
        404
      </div>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-[#7C8698]">GO BACK</p>
    </div>
  );
}

export default App;
