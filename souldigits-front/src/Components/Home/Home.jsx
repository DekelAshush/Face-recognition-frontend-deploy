import React, { useContext } from "react";
import { LanguageContext } from "../../LanguageContext/LanguageContext.jsx"

function Home() {
    const { lang } = useContext(LanguageContext);

    const t = {
        en: {
            title: "Welcome to my site!",
            description: "Explore my services and get in touch.",
        },
        he: {
            title: "ברוכים הבאים לאתר שלי!",
            description: "גלו את השירותים שלי וצרו קשר.",
        },
    };

    return (
        <div>
            <h1>{t[lang].title}</h1>
            <p>{t[lang].description}</p>
        </div>
    );
}

export default Home;
