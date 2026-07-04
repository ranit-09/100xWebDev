import  { Appbar } from './components/Appbar';
import { BrowserRouter ,Route,Routes} from 'react-router';
import './index.css';
import { LandingPage } from "./pages/Landing";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages//Dashboard";
import { VideoCreator } from "./pages/VideoCreator";

export function App() {
  return (
    <div >
      <Appbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/video-creator" element={<VideoCreator />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
  
}

export default App;
