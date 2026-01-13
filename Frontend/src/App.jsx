import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Verify from "./pages/verify.jsx";
import VerifyEmail from "./pages/VerifyEmail";

const router = createBrowserRouter([
  {
    path:'/',
    element:<><Navbar/><Home/></>
  },
    {
    path:'/signup',
    element:<><Signup/></>
  },
    {
    path:'/login',
    element:<><Login/></>
  },
   {
    path:'/verify',
    element:<><Verify/></>
  },
   {
    path:'/verify/:token',
    element:<><VerifyEmail/></>
  },
  
  
])


const App = () => {
  return (
  <>
  <RouterProvider router={router}/>
  </>
  )
}

export default App