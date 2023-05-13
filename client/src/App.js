import React from 'react';
import Home from './components/Home';
import { Routes, Route } from 'react-router-dom'

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/:member/:id/:name/:fcm" element={<Home />} />
            </Routes>
        </>
    );
}

export default App;