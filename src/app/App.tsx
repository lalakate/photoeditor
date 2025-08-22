import { Route, Routes } from 'react-router-dom';
import { AuthForm, PhotoEditor, PresetFeed, UserProfile } from '@/pages';
import { Header } from '../components/UI/Header';
import { FloatingHomeButton } from '../components/UI/FloatingHomeButton';
import 'normalize.css';
import '../App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<PhotoEditor />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/feed" element={<PresetFeed />} />
        <Route path="/users/:uid" element={<UserProfile />} />
      </Routes>
      <FloatingHomeButton />
    </div>
  );
}

export default App;
