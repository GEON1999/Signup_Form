import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignupStep1 from './pages/SignupStep1';
import SignupStep2 from './pages/SignupStep2';
import SignupStep3 from './pages/SignupStep3';
import UserHome from './pages/UserHome';
import GitHubCallback from './pages/GitHubCallBack';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup/step1" element={<SignupStep1 />} />
          <Route path="/signup/step2" element={<SignupStep2 />} />
          <Route path="/signup/step3" element={<SignupStep3 />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/auth/github-callback" element={<GitHubCallback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
