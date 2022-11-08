import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './modules/App/App';
import 'normalize.css';
import './main.global.sass';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(<App />);
