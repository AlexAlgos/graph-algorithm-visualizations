import React from 'react';
import './App.css';
import '../src/StyleSheets/Visualizations.css';
import '../src/StyleSheets/Instructions.css';
import Visualizations from './Components/Visualizations.jsx';
import Instructions from './Components/Instructions';

export default function App() {
  return (
    <>
    <Instructions></Instructions>
    <Visualizations></Visualizations>
    </>
  );
}