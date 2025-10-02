import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ActualTracking from "./Components/ActualTracking";
import FrequentList from "./Components/FrequentList";
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "@fortawesome/fontawesome-free/css/all.min.css";
import DailySummary from "./Components/DailySummary";
import Edit from "./Components/Edit";
import WeeklyMonthlySummary from "./Components/WeeklyMonthlySummary";

function App() {
  const today = new Date().toLocaleDateString("en-GB");
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ActualTracking />,
    },
    {
      path: "/frequent",
      element: <FrequentList />,
    },
    {
      path: "/daily",
      element: <DailySummary date={today} />,
    },
    {
      path:"/edit",
      element:<Edit/>
    },{
    path:"/weeklyMonthy",
    element:<WeeklyMonthlySummary/>}
  ]);
  return (
    <>
      <h1> expense manager</h1>
      <RouterProvider router={router} />
    </>
  );
}
export default App;
