import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./Components/Navigation/Navigation.jsx";
import Home from "./Components/Home/Home.jsx";
import About from "./Components/About/About.jsx";
import Services from "./Components/Services/Services.jsx";
import Testimonials from "./Components/Testimonials/Testimonials.jsx";
import Contact from "./Components/Contact/Contact.jsx";
import WhatsAppButton from "./Components/WhatsAppContactForm/WhatsAppContactForm.jsx";
import { LanguageProvider } from "./LanguageContext/LanguageContext.jsx";

import "./App.css";

function App() {
    return (
        <LanguageProvider>
            <Router>
                <div>
                    <header>
                        <Navigation />
                    </header>

                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/testimonials" element={<Testimonials />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                    </main>

                    <WhatsAppButton />
                </div>
            </Router>
        </LanguageProvider>
    );
}

export default App;
