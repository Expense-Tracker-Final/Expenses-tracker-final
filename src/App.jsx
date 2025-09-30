import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ActualTracking from "./Components/ActualTracking"
import FrequentList from "./Components/FrequentList"
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "@fortawesome/fontawesome-free/css/all.min.css";


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
      <RouterProvider router={router} />
    </>
  )

}
export default App