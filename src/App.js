import React from 'react';
import Generator from './Generator';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Generator />
    </div>
  );
}

export default App;
