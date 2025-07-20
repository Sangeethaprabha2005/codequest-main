import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import './Homemainbar.css';
import Questionlist from './Questionlist';

function Homemainbar() {
  const user = useSelector((state) => state.currentuserreducer);
  const navigate = useNavigate();
  const location = useLocation();
  const questionlist = useSelector((state) => state.questionreducer);

  const handleAskQuestion = () => {
    if (!user) {
      alert('Login or signup to ask a question');
      navigate('/Auth');
    } else {
      navigate('/Askquestion');
    }
  };

  const handleLanguageChange = () => {
    if (!user) {
      alert('Login or signup to change language');
      navigate('/Auth');
    } else {
      navigate('/language-switcher');
    }
  };

  return (
    <div className="main-bar">
      <div className="main-bar-header">
        {location.pathname === "/" ? (
          <h1>Top Questions</h1>
        ) : (
          <h1>All Questions</h1>
        )}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="ask-btn" onClick={handleAskQuestion}>Ask Question</button>
          <button className="lang-btn" onClick={handleLanguageChange}>Change Language</button>
        </div>
      </div>

      <div>
        {questionlist.data === null ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <p>{questionlist.data.length} questions</p>
            <Questionlist questionlist={questionlist.data} />
          </>
        )}
      </div>

      <div id="recaptcha-container"></div>
    </div>
  );
}

export default Homemainbar;
