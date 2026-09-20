import { useRef, useState } from "react";
import VehicleReport from "./VehicleReport.jsx";
import Icons from "./Icons.jsx";

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a
          href="#search"
          className="brand"
          dir="ltr"
          aria-label="CarInfo — דף הבית"
        >
          <span className="brand-name">
            Car<span>Info</span>
            <i></i>
          </span>
          <span className="brand-caption" dir="rtl">
            כל המידע. כל הביטחון.
          </span>
        </a>
        <nav className="navigation" aria-label="ניווט ראשי">
          <a href="#search" className="nav-link active" aria-current="page">
            בדיקת רכב
          </a>
          <a className="nav-link about-trigger" href="#faq">
            איך זה עובד?
          </a>
          <a href="#faq" className="nav-link">
            שאלות נפוצות
          </a>
        </nav>
        <a className="new-search" href="#search">
          <svg className="icon" aria-hidden="true">
            <use href="#i-search" />
          </svg>
          בדיקה חדשה
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const [plateText, setPlateText] = useState("82020203");
  const inputRef = useRef(null);
  return (
    <section id="search" className="hero" aria-labelledby="hero-title">
      <div className="hero-landscape" aria-hidden="true"></div>
      <div className="hero-wash" aria-hidden="true"></div>
      <div className="container hero-inner">
        <div className="hero-eyebrow">
          <span className="eyebrow-icon">
            <svg className="icon" aria-hidden="true">
              <use href="#i-database" />
            </svg>
          </span>
          מאחורי כל מספר, יש סיפור.
        </div>
        <h1 id="hero-title">
          מכירים את הרכב.
          <br className="mobile-break" /> <span>יודעים יותר.</span>
        </h1>
        <p className="hero-description">
          כל הפרטים על הרכב שלך, במקום אחד. מתחילים עם מספר רישוי.
        </p>
        <div id="search-form" className="search-form" role="group">
          <label htmlFor="plate-input" className="sr-only">
            מספר רישוי — 7 או 8 ספרות
          </label>
          <div className="search-box">
            <div className="input-wrap">
              <span className="plate-chip" aria-hidden="true">
                <span className="plate-chip-country">IL</span>
                <svg className="icon">
                  <use href="#i-car" />
                </svg>
              </span>
              <input
                id="plate-input"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                maxLength="11"
                ref={inputRef}
                value={plateText}
                onChange={(event) => setPlateText(event.target.value)}
                placeholder="מספר הרכב שלך"
                aria-describedby="search-hint"
                dir="ltr"
              />
              <button
                id="clear-search"
                type="button"
                onClick={() => {
                  setPlateText("");
                  inputRef.current?.focus();
                }}
                aria-label="ניקוי מספר הרישוי"
              >
                <svg className="icon" aria-hidden="true">
                  <use href="#i-x" />
                </svg>
              </button>
            </div>
            <button
              className="search-button"
              type="button"
              aria-disabled="true"
              aria-label="חפש רכב — המחשה בלבד, ללא חיפוש"
            >
              <svg className="icon" aria-hidden="true">
                <use href="#i-search" />
              </svg>
              <span>חפש רכב</span>
              <svg className="icon button-arrow" aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </button>
          </div>
          <p id="search-hint" className="search-hint">
            תצוגת עיצוב בלבד <span>·</span> המספר והנתונים להמחשה בלבד
          </p>
        </div>
        <div className="hero-benefits" aria-label="סוגי המידע">
          <span>
            <svg className="icon" aria-hidden="true">
              <use href="#i-car" />
            </svg>
            פרטי הרכב
          </span>
          <i></i>
          <span>
            <svg className="icon" aria-hidden="true">
              <use href="#i-shield" />
            </svg>
            רישוי ומועדים
          </span>
          <i></i>
          <span>
            <svg className="icon" aria-hidden="true">
              <use href="#i-history" />
            </svg>
            היסטוריית בעלויות
          </span>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section
      id="faq"
      className="container faq-section"
      aria-labelledby="faq-title"
    >
      <div className="faq-intro">
        <span className="section-eyebrow">טוב לדעת</span>
        <h2 id="faq-title">
          כמה דברים,
          <br />
          לפני שממשיכים.
        </h2>
        <p>כדי להבין בדיוק מה רואים.</p>
      </div>
      <div className="faq-list">
        <details>
          <summary>
            מה מוצג בדוח הרכב לדוגמה?
            <svg className="icon" aria-hidden="true">
              <use href="#i-plus" />
            </svg>
          </summary>
          <p>
            כל הפרטים בדוח הם תוכן קבוע להמחשת העיצוב בלבד. אין כאן חיפוש או
            חיבור למאגרי מידע, ושינוי מספר הרישוי בשדה אינו משנה את הדוח.
          </p>
        </details>
        <details id="mileage-faq">
          <summary>
            האם הקילומטראז׳ הוא הנתון העדכני של הרכב?
            <svg className="icon" aria-hidden="true">
              <use href="#i-plus" />
            </svg>
          </summary>
          <p>
            לא. זהו דוח עיצוב לדוגמה, ולא מידע על רכב מסוים. השדה מסומן כ״לא
            זמין״ כדי להמחיש את התצוגה כשאין נתון להצגה.
          </p>
        </details>
        <details>
          <summary>
            למה חלק מהפרטים מסומנים כ״לא זמין״?
            <svg className="icon" aria-hidden="true">
              <use href="#i-plus" />
            </svg>
          </summary>
          <p>
            בדוגמה בחרנו להראות גם מידע חסר, כדי לבחון איך הוא משתלב בעיצוב.
            הסימון אינו מעיד על מצב הרכב; כל התוכן בעמוד נועד להמחשה בלבד.
          </p>
        </details>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a href="#search" className="brand-name" dir="ltr">
          Car<span>Info</span>
          <i></i>
        </a>
        <span>מכירים את הרכב. מקבלים תמונה ברורה יותר.</span>
        <span className="footer-note">עיצוב להמחשה · לא שירות ממשלתי</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a href="#report" className="skip-link">
        דילוג לתוצאות
      </a>
      <Header />
      <main>
        <Hero />
        <VehicleReport />
        <FAQ />
      </main>
      <Footer />
      <Icons />
    </>
  );
}
