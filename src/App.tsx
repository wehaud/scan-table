import "./App.css";
import { IpCard } from "./components/ipCard";
import { ScanTable } from "./components/scanTable";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/appLayout";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<ScanTable />} />
          <Route path="/ip/:ip" element={<IpCard />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;