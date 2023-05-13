import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { ContextProvider } from "./SocketContext";
import './styles.css';

ReactDOM.render(
    <ContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ContextProvider>
    , document.getElementById('root'));