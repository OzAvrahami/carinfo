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

function Hero({ onReportLoaded }) {
  const [plateText, setPlateText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);
  const searchingRef = useRef(false);

  async function handleSearch(event) {
    event.preventDefault();

    if (searchingRef.current) return;

    const plate = plateText.replace(/[\s-]/g, "");

    setErrorMessage("");
    onReportLoaded(null);

    if (!/^\d{7,8}$/.test(plate)) {
      setErrorMessage("יש להזין מספר רישוי בן 7 או 8 ספרות.");
      inputRef.current?.focus();
      return;
    }

    searchingRef.current = true;
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(
        `/api/vehicles/${encodeURIComponent(plate)}/report`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("לא נמצא רכב במאגר עבור המספת שהזנת.");
        }

        if (response.status === 400) {
          throw new Error("מספר הרישוי אינו תקין. בדוק את המספר ונסה שוב");
        }

        if (response.status === 429) {
          throw new Error("בוצעו יותר מדי חיפושים. המתן מעט ונסה שוב.");
        }
        throw new Error("לא ניתן לטעון את נתוני הרכב כרגע. נסה שוב בהמשך.");
      }

      const result = await response.json();

      if (
        !result.data ||
        typeof result.data !== "object" ||
        !result.data.vehicle
      ) {
        throw new Error("התקבלה תשובה לא תקינה מהשרת. נסה שוב בהמשך.");
      }

      onReportLoaded(result.data);

    } catch (error) {
      if (controller.signal.aborted) {
        setErrorMessage("החיפוש ארך זמן רב מדי. נסה שוב.");
      } else if (error instanceof TypeError) {
        setErrorMessage("לא ניתן להתחבר לשרת. בדוק את החיבור ונסה שוב.");
      } else if (error instanceof SyntaxError) {
        setErrorMessage("התקבלה תשובה לא תקינה מהשרת. נסה שוב בהמשך.");
      } else {
        setErrorMessage(error.message || "החיפוש נכשל. נסה שוב.");
      }
    } finally {
      clearTimeout(timeoutId);
      searchingRef.current = false;
      setIsLoading(false);
    }
  }

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
        <form id="search-form" className="search-form" onSubmit={handleSearch}>
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
                onChange={(event) => {
                  setPlateText(event.target.value);
                  setErrorMessage("");
                  onReportLoaded(null);
                }}
                disabled={isLoading}
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? "search-hint search-error" : "search-hint"}
                placeholder="מספר הרכב שלך"
                dir="ltr"
              />
              <button
                id="clear-search"
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setPlateText("");
                  setErrorMessage("");
                  onReportLoaded(null);
                  inputRef.current?.focus();
                }}
                aria-label="ניקוי מספר הרישוי"
              >
                <svg className="icon" aria-hidden="true">
                  <use href="#i-x" />
                </svg>
              </button>
            </div>
            <button className="search-button" type="submit" aria-label="חפש רכב">
              <svg className="icon" aria-hidden="true">
                <use href="#i-search" />
              </svg>
              <span>{isLoading ? "חפש רכב" : "מחפש..."}</span>
              <svg className="icon button-arrow" aria-hidden="true">
                <use href="#i-arrow" />
              </svg>
            </button>
          </div>
          <p id="search-hint" className="search-hint">
            הזינו מספר רישוי בן 7 או 8 ספרות, עם או בלי מקפים.
          </p>

          {errorMessage && (
            <p id="search-error" role="alert" style={{ color: "#b42318", margin: "12px"}}>
              {errorMessage}
            </p>
          )}

          <p role="status" className="sr-only">
            {isLoading ? "מחפש נתוני רכב, נא להמתין" : ""}
          </p>
        </form>
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
  const [report, setReport] = useState(null);

  return (
    <>
      <a href="#report" className="skip-link">
        דילוג לתוצאות
      </a>
      <Header />
      <main>
        <Hero onReportLoaded={setReport} />
        {report && <VehicleReport report={report} />}
        <FAQ />
      </main>
      <Footer />
      <Icons />
    </>
  );
}
