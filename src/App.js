import React from 'react';
import Generator from './Generator';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './clarity';
import ReactGA from 'react-ga';

const TRACKING_ID = "UA-6345750229-G-6Y2T0WEP2C"; // Google Analytics ölçüm kimliği
ReactGA.initialize(TRACKING_ID);

function App() {
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Generator />
    </div>
  );
}

export default App;
