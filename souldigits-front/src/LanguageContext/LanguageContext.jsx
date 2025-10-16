import React, { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

    const toggleLang = () => {
        const newLang = lang === "en" ? "he" : "en";
        setLang(newLang);
        localStorage.setItem("lang", newLang);
        document.dir = newLang === "he" ? "rtl" : "ltr";
    };

    useEffect(() => {
        document.dir = lang === "he" ? "rtl" : "ltr";
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    );
};
