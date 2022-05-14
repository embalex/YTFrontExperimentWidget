import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';


const App:React.FC = () => {
    return <div>Loading...</div>;
  }

const element = document.getElementById('app');
if (element === null) {
  throw new Error('Root element is empty');
}
const root = ReactDOM.createRoot(element);
root.render(<App />);
