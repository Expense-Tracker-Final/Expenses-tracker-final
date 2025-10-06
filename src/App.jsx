import { BrowserRouter, Routes, Route } from "react-router-dom";
import ActualTracking from "./Components/ActualTracking";
import Home from "./common/Home";
import FrequentList from "./Components/FrequentList";
import Dashboard from "./Components/dashboard/Dashboard";
import Report from "./Components/report/Report";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "./common/Navbar"; // <-- fixed import path
import Footer from "./common/Footer"; 
import DailySummary from "./Components/DailySummary";
import Edit from "./Components/Edit";
import WeeklyMonthlySummary from "./Components/WeeklyMonthlySummary";
import MonthlySavings from "./Components/MonthlySavings";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/budget" element={<ActualTracking />} />
          <Route path="/frequent" element={<FrequentList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<Report />} />
          <Route path="/daily" element={<DailySummary date={new Date().toLocaleDateString('en-GB')} />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/weeklyMonthy" element={<WeeklyMonthlySummary />} />
          <Route path="/savings" element={<MonthlySavings />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
