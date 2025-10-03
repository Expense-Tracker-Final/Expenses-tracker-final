import { BrowserRouter, Routes, Route } from "react-router-dom";
import ActualTracking from "./Components/ActualTracking";
import FrequentList from "./Components/FrequentList";
import Dashboard from "./Components/dashboard/Dashboard";
import Report from "./Components/report/Report";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "./common/Navbar"; // <-- fixed import path
import Footer from "./common/Footer"; 


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ActualTracking />} />
        <Route path="/frequent" element={<FrequentList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} /> 
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
