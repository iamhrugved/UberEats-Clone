import React from 'react';
// import styled from 'styled-components';
import logo from './uber-eats.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <div className="container">
      <div className="container-fluid text-center">
        <h3 className="margin">
          <img src={logo} alt="UEL" width={200} height={30} />
        </h3>
      </div>
    </div>
  );
}

export default App;
