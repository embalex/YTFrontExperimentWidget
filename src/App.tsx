import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import DashboardWidget from './DashboardWidget';
import { UnresolvedExperiments } from './components/UnresolvedExperiments';
import './App.css';

const App:React.FC = () => {
  const [isAppInInitProcess, setIsAppInInitProcess] = useState(true);

  useEffect(() => {
    DashboardWidget
      .init()
      .then(() => {
        setIsAppInInitProcess(false);
      });
  }, []);

  if (isAppInInitProcess) {
    return <div>Loading...</div>;
  }

  if (!DashboardWidget.isUserCanUseTags) {
    return <img src="minion.svg" alt="Menion" className="menion" />;
  }

  return <UnresolvedExperiments registerRefreshCallback={DashboardWidget.registerRefreshCallback} />;
};

const element = document.getElementById('app');
if (element === null) {
  throw new Error('Root element is empty');
}
const root = ReactDOM.createRoot(element);
root.render(<App />);
