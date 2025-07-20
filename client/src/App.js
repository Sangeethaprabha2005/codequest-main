import './App.css';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './component/Navbar/navbar';
import Allroutes from './Allroutes';
import { fetchallusers } from './action/users';
import { fetchallquestion } from './action/question';
import './i18n'; 
import LanguageSwitcher from './component/LanguageSwitcher'; 

function App() {
  const [slidein, setslidein] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchallusers());
    dispatch(fetchallquestion());
  }, [dispatch]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setslidein(false);
    }
  }, []);

  const handleslidein = () => {
    if (window.innerWidth <= 768) {
      setslidein((state) => !state);
    }
  };

  return (
    <div className="App">
      <Router>
        <Navbar handleslidein={handleslidein} />
        
        <Routes>
          {/* ✅ Explicit route for LanguageSwitcher page */}
          <Route path="/language-switcher" element={<LanguageSwitcher />} />

          {/* ✅ All app routes go through Allroutes component */}
          <Route path="/*" element={
            <Allroutes 
              slidein={slidein} 
              handleslidein={handleslidein} 
            />
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
