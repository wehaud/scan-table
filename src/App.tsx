import "./App.css";
import { IpCard } from "./features/ip/components/IpCard";
import { ScanTable } from "./features/scans/components/ScanTable";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./app/AppLayout";

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