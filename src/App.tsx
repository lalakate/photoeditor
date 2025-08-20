import { Header } from './components/UI/Header/Header';
import './App.css';
import 'normalize.css';
import PhotoEditor from './components/PhotoEditor/PhotoEditor';
import { Route, Routes } from 'react-router-dom';
import { AuthForm } from './components/Auth/AuthForm';
import { useAppSelector } from './store/hooks';
import PresetFeed from './components/Feed/PresetFeed';
import UserProfile from './components/User/UserProfile';
import FloatingHomeButton from './components/UI/FloatingHomeButton/FloatingHomeButton';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<PhotoEditor />} />
        {/* <Route path={`user${userId}`} /> */}
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/feed" element={<PresetFeed />} />
        <Route path="/users/:uid" element={<UserProfile />} />
      </Routes>
      <FloatingHomeButton />
    </div>
  );
}

export default App;
