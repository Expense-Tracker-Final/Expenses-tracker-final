// import { createBrowserRouter, RouterProvider } from "react-router-dom"
// import ActualTracking from "./Components/ActualTracking"
// import FrequentList from "./Components/FrequentL
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ActualTracking from "./Components/ActualTracking"
import FrequentList from "./Components/FrequentList"

import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "../src/common/Navbar"
import Dashboard from "./Components/dashboard/Dashboard";


function App() {
 const router=createBrowserRouter([
  {
    path:"/",
    element:<ActualTracking/>

  },
  {
    path:"/frequent",
    element:<FrequentList/>
  }]
)
  return (
    <>
    {/* <h1> expense manager</h1>
      <RouterProvider router={router} /> */}
      {/* <Navbar /> */}
      {/* <FrequentList /> */}
      <Dashboard/>
      <Navbar />
      <RouterProvider router={router} />

    </>
  )

}
export default App