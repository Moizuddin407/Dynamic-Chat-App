import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated for React Router v6+

import Join from './components/Join';
import Chat from './components/Chat';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Join />} /> {/* Updated for new syntax */}
      <Route path="/chat" element={<Chat />} /> {/* Updated for new syntax */}
    </Routes>
  </Router>
);

export default App;
