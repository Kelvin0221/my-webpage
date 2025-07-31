import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AboutMe from './about-me';
import HomePage from './home';
import Skills from './skills';
import { userContext } from './assets/context/usercontext.ts';
import { useState } from 'react';
import Disclaimer from './disclaimer';

function AppRouter(){
    const [username, setUsername] = useState("User");

    return <userContext.Provider value={{username, setUsername}}>
                <BrowserRouter>
                    <Routes>
                        <Route path="*" element={<HomePage />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/aboutme" element={<AboutMe />} />
                        <Route path="/skills" element={<Skills />} />
                        <Route path="/disclaimer" element={<Disclaimer />} />
                        {/* <Route path="/app" element={<App title="TEST ROUTER" />} /> */}
                    </Routes>
                </BrowserRouter>
            </userContext.Provider>

}

export default AppRouter