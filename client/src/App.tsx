import Landingpage from "@/pages/Landingpage";
import {Routes, Route} from 'react-router-dom';
import Signup from "@/pages/SignUp";
import SignIn from "./pages/SignIn";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<SignIn />} />
      </Routes>
    </>
  )
}

export default App