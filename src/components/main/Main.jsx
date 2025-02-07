import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Main.css';
import { assets } from '../../assets/assets';
import Loader from '../Loader/Loader';

export const Main = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt }),
      });

      const data = await res.json();
      setResponse(data.answer || 'No response received.');
    } catch (error) {
      setResponse('Error fetching response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="User Icon" />
      </div>
      <div className="main-container">
        <div className="greet">
          <p><span>Hello, Lewis</span></p>
          <p>How can I help you?</p>
        </div>
        <div className="cards">
          {[
            { text: 'Suggest beautiful places to see on an upcoming road trip', icon: assets.compass_icon },
            { text: 'Briefly summarize this concept: Urban Planning', icon: assets.bulb_icon },
            { text: 'Brainstorm team activities for our work retreat', icon: assets.message_icon },
            { text: 'Improve the readability of the following code', icon: assets.code_icon },
          ].map((item, index) => (
            <div key={index} className="card" onClick={() => setPrompt(item.text)}>
              <p>{item.text}</p>
              <img src={item.icon} alt="Card Icon" />
            </div>
          ))}
        </div>
        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div>
              <img src={assets.gallery_icon} alt="Gallery" />
              <img src={assets.mic_icon} alt="Mic" />
              <img src={assets.send_icon} alt="Send" onClick={handleSend} />
            </div>
          </div>
          {loading && <Loader />}
          {response && (
            <div className="response-box">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
            </div>
          )}
          <p className="bottom-info">Gemini may display incorrect information.</p>
        </div>
      </div>
    </div>
  );
};

export default Main;
