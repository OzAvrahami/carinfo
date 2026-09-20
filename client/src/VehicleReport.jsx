import { useState } from "react";

export default function VehicleReport() {
  const [activeTab, setActiveTab] = useState("overview");

  function handleTabKey(event) {
    // Presentation-only keyboard navigation, following the visual RTL order.
    const tabs = ["overview", "specs", "history"];
    const current = tabs.indexOf(activeTab);
    let next;
    if (event.key === "ArrowLeft") next = tabs[(current + 1) % tabs.length];
    else if (event.key === "ArrowRight")
      next = tabs[(current + tabs.length - 1) % tabs.length];
    else if (event.key === "Home") next = tabs[0];
    else if (event.key === "End") next = tabs[tabs.length - 1];
    else return;
    event.preventDefault();
    setActiveTab(next);
    event.currentTarget.parentElement.querySelector(`#tab-${next}`).focus();
  }

  return (
    <section
      id="report"
      className="container report-section"
      aria-label="דוח רכב לדוגמה — תצוגת עיצוב בלבד"
    >
      <div className="report-topline">
        <span>
          <span className="breadcrumb-label">בדיקת רכב</span>
          <svg className="icon" aria-hidden="true">
            <use href="#i-chevron-left" />
          </svg>
          <b id="breadcrumb-plate" dir="ltr">
            820-20-203
          </b>
        </span>
        <span className="demo-label">
          <span></span>דוח לדוגמה
        </span>
      </div>

      <div id="vehicle-result" className="vehicle-report">
        <div className="report-heading">
          <div className="report-title-group">
            <span className="heading-icon">
              <svg className="icon" aria-hidden="true">
                <use href="#i-document" />
              </svg>
            </span>
            <div>
              <div className="report-title-line">
                <h2>תיק הרכב שלך</h2>
                <span className="report-number" dir="ltr">
                  820-20-203
                </span>
              </div>
              <p>הפרטים הקטנים. התמונה המלאה.</p>
            </div>
          </div>
          <div className="report-actions">
            <button
              id="share-report"
              type="button"
              aria-disabled="true"
              aria-label="שיתוף — המחשה בלבד"
            >
              <svg className="icon" aria-hidden="true">
                <use href="#i-share" />
              </svg>
              <span>שיתוף</span>
            </button>
            <button
              id="print-report"
              type="button"
              aria-disabled="true"
              aria-label="הדפסה — המחשה בלבד"
            >
              <svg className="icon" aria-hidden="true">
                <use href="#i-print" />
              </svg>
              <span>הדפסה</span>
            </button>
          </div>
        </div>
        <div className="report-layout">
          <aside className="vehicle-showcase" aria-labelledby="vehicle-title">
            <div className="car-stage">
              <div className="stage-top">
                <span className="stage-brand" dir="ltr">
                  TOYOTA
                </span>
                <span className="body-type">רכב פנאי</span>
              </div>
              <div className="stage-word" aria-hidden="true" dir="ltr">
                RAV4
              </div>
              <img
                className="vehicle-image"
                src="/assets/rav4.png"
                width="1920"
                height="1080"
                alt="טויוטה RAV4 לבנה — תמונת דגם להמחשה"
                fetchPriority="high"
              />
              <span className="image-caption">תמונת הדגם להמחשה</span>
              <div className="stage-corner" aria-hidden="true"></div>
            </div>
            <div className="vehicle-name">
              <div>
                <span className="vehicle-eyebrow">הכירו את הרכב</span>
                <h3 id="vehicle-title" dir="ltr">
                  Toyota RAV4
                </h3>
                <p>
                  טויוטה ראב 4 <span>·</span> 2024 <span>·</span> לבן
                </p>
              </div>
              <span className="model-year" dir="ltr">
                24<span>MODEL</span>
              </span>
            </div>
            <div className="vehicle-plate-row">
              <span>מספר רישוי</span>
              <div className="license-plate" dir="ltr">
                <span className="plate-country">IL</span>
                <strong>820-20-203</strong>
              </div>
            </div>
            <div className="vehicle-quick-specs">
              <span>
                <svg className="icon" aria-hidden="true">
                  <use href="#i-leaf" />
                </svg>
                היברידי
              </span>
              <span>
                <svg className="icon" aria-hidden="true">
                  <use href="#i-seat" />
                </svg>
                5 מושבים
              </span>
              <span>
                <svg className="icon" aria-hidden="true">
                  <use href="#i-user" />
                </svg>
                פרטית
              </span>
            </div>
            <div className="illustration-notice">
              <svg className="icon" aria-hidden="true">
                <use href="#i-info" />
              </svg>
              <p>
                תיק הרכב מוצג להמחשה בלבד.
                <br />
                הנתונים אינם תוצאת חיפוש במאגר.
              </p>
            </div>
          </aside>
          <div className="report-details">
            <div
              className="report-tabs"
              role="tablist"
              aria-label="קטגוריות מידע"
            >
              <button
                id="tab-overview"
                type="button"
                role="tab"
                aria-selected={activeTab === "overview"}
                aria-controls="panel-overview"
                tabIndex={activeTab === "overview" ? 0 : -1}
                onClick={() => setActiveTab("overview")}
                onKeyDown={handleTabKey}
              >
                <svg className="icon" aria-hidden="true">
                  <use href="#i-grid" />
                </svg>
                סקירה כללית
              </button>
              <button
                id="tab-specs"
                type="button"
                role="tab"
                aria-selected={activeTab === "specs"}
                aria-controls="panel-specs"
                tabIndex={activeTab === "specs" ? 0 : -1}
                onClick={() => setActiveTab("specs")}
                onKeyDown={handleTabKey}
              >
                <svg className="icon" aria-hidden="true">
                  <use href="#i-settings" />
                </svg>
                מפרט טכני
              </button>
              <button
                id="tab-history"
                type="button"
                role="tab"
                aria-selected={activeTab === "history"}
                aria-controls="panel-history"
                tabIndex={activeTab === "history" ? 0 : -1}
                onClick={() => setActiveTab("history")}
                onKeyDown={handleTabKey}
              >
                <svg className="icon" aria-hidden="true">
                  <use href="#i-history" />
                </svg>
                היסטוריית בעלויות
              </button>
            </div>
            <section
              id="panel-overview"
              className="tab-panel"
              role="tabpanel"
              aria-labelledby="tab-overview"
              tabIndex="0"
              hidden={activeTab !== "overview"}
            >
              <div className="section-heading">
                <h3>הפרטים הבסיסיים</h3>
                <span>על קצה המפתח</span>
              </div>
              <dl className="overview-grid">
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-car" />
                    </svg>
                  </span>
                  <dt>יצרן</dt>
                  <dd dir="ltr">TOYOTA</dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-layers" />
                    </svg>
                  </span>
                  <dt>דגם</dt>
                  <dd dir="ltr">RAV4</dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-calendar" />
                    </svg>
                  </span>
                  <dt>שנת ייצור</dt>
                  <dd>2024</dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-car" />
                    </svg>
                  </span>
                  <dt>סוג רכב</dt>
                  <dd>פרטי</dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-fuel" />
                    </svg>
                  </span>
                  <dt>סוג דלק</dt>
                  <dd>היברידי</dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-drop" />
                    </svg>
                  </span>
                  <dt>צבע</dt>
                  <dd>
                    <span className="color-dot" aria-hidden="true"></span>לבן
                  </dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-seat" />
                    </svg>
                  </span>
                  <dt>מספר מושבים</dt>
                  <dd>
                    5 <small>מושבים</small>
                  </dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-gauge" />
                    </svg>
                  </span>
                  <dt>קילומטראז׳</dt>
                  <dd className="missing-value">
                    לא זמין{" "}
                    <a
                      className="mileage-help"
                      href="#mileage-faq"
                      aria-label="מידע על הקילומטראז׳"
                    >
                      <svg className="icon" aria-hidden="true">
                        <use href="#i-info" />
                      </svg>
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="info-cards">
                <section className="info-card">
                  <h3>
                    <span className="small-icon">
                      <svg className="icon" aria-hidden="true">
                        <use href="#i-calendar" />
                      </svg>
                    </span>
                    רישוי ומועדים
                  </h3>
                  <dl className="data-rows">
                    <div>
                      <dt>תאריך רישום</dt>
                      <dd dir="ltr">07.07.2024</dd>
                    </div>
                    <div>
                      <dt>תוקף רישוי</dt>
                      <dd className="unavailable">לא זמין</dd>
                    </div>
                    <div>
                      <dt>טסט אחרון</dt>
                      <dd className="unavailable">לא זמין</dd>
                    </div>
                    <div>
                      <dt>טסט הבא</dt>
                      <dd className="unavailable">לא זמין</dd>
                    </div>
                  </dl>
                </section>
                <section className="info-card">
                  <h3>
                    <span className="small-icon">
                      <svg className="icon" aria-hidden="true">
                        <use href="#i-user" />
                      </svg>
                    </span>
                    בעלות ומידע נוסף
                  </h3>
                  <dl className="data-rows">
                    <div>
                      <dt>בעלות נוכחית</dt>
                      <dd>
                        <span className="ownership-pill">פרטית</span>
                      </dd>
                    </div>
                    <div>
                      <dt>בעלים קודמים</dt>
                      <dd>0</dd>
                    </div>
                    <div>
                      <dt>רכב במבנה מיוחד</dt>
                      <dd>לא</dd>
                    </div>
                    <div>
                      <dt>הורדה מהכביש</dt>
                      <dd>לא</dd>
                    </div>
                  </dl>
                </section>
              </div>
            </section>
            <section
              id="panel-specs"
              className="tab-panel"
              role="tabpanel"
              aria-labelledby="tab-specs"
              tabIndex="0"
              hidden={activeTab !== "specs"}
            >
              <div className="section-heading">
                <h3>המפרט הטכני</h3>
                <span>מבט מתחת למכסה המנוע</span>
              </div>
              <div className="technical-grid">
                <section className="info-card">
                  <h3>
                    <span className="small-icon">
                      <svg className="icon" aria-hidden="true">
                        <use href="#i-settings" />
                      </svg>
                    </span>
                    מנוע והנעה
                  </h3>
                  <dl className="data-rows">
                    <div>
                      <dt>סוג דלק</dt>
                      <dd>היברידי</dd>
                    </div>
                    <div>
                      <dt>נפח מנוע</dt>
                      <dd className="unavailable">לא זמין</dd>
                    </div>
                    <div>
                      <dt>דגם מנוע</dt>
                      <dd className="unavailable">לא זמין</dd>
                    </div>
                    <div>
                      <dt>הספק</dt>
                      <dd className="unavailable">לא זמין</dd>
                    </div>
                  </dl>
                </section>
                <section className="info-card">
                  <h3>
                    <span className="small-icon">
                      <svg className="icon" aria-hidden="true">
                        <use href="#i-car" />
                      </svg>
                    </span>
                    מרכב וציוד
                  </h3>
                  <dl className="data-rows">
                    <div>
                      <dt>מספר מושבים</dt>
                      <dd>5</dd>
                    </div>
                    <div>
                      <dt>מידת צמיגים</dt>
                      <dd className="unavailable">לא זמין</dd>
                    </div>
                    <div>
                      <dt>רמת גימור</dt>
                      <dd className="unavailable">לא זמין</dd>
                    </div>
                    <div>
                      <dt>ארץ ייצור</dt>
                      <dd className="unavailable">לא זמין</dd>
                    </div>
                  </dl>
                </section>
              </div>
              <div className="panel-note">
                <svg className="icon" aria-hidden="true">
                  <use href="#i-info" />
                </svg>
                <p>
                  כשהמידע חסר, חשוב לדעת שהוא חסר. בדוגמה זו שדות ללא תוכן
                  מוצגים במפורש כ״לא זמין״.
                </p>
              </div>
            </section>
            <section
              id="panel-history"
              className="tab-panel"
              role="tabpanel"
              aria-labelledby="tab-history"
              tabIndex="0"
              hidden={activeTab !== "history"}
            >
              <div className="section-heading">
                <h3>הדרך של הרכב</h3>
                <span>היסטוריית בעלויות לדוגמה</span>
              </div>
              <div className="history-summary">
                <span className="history-count">01</span>
                <div>
                  <strong>בעלות אחת, מהרישום הראשון</strong>
                  <p>בדוגמה זו לא מוצגים חילופי בעלות.</p>
                </div>
                <svg className="icon" aria-hidden="true">
                  <use href="#i-history" />
                </svg>
              </div>
              <ol className="ownership-timeline">
                <li>
                  <span className="timeline-dot" aria-hidden="true"></span>
                  <div>
                    <div className="timeline-heading">
                      <h4>בעלות פרטית</h4>
                      <span className="ownership-pill">נוכחית</span>
                    </div>
                    <p>
                      <b dir="ltr">07.07.2024</b> — היום
                    </p>
                    <span>תאריך רישום ראשון לדוגמה</span>
                  </div>
                </li>
              </ol>
              <div className="panel-note">
                <svg className="icon" aria-hidden="true">
                  <use href="#i-info" />
                </svg>
                <p>
                  המידע מתייחס לסוג הבעלות ולמועדים בלבד. לא מוצגים פרטים אישיים
                  של בעלי הרכב.
                </p>
              </div>
            </section>
            <div className="report-source">
              <div>
                <svg className="icon" aria-hidden="true">
                  <use href="#i-database" />
                </svg>
                <span>
                  תצוגת עיצוב:{" "}
                  <a href="#faq">
                    תוכן קבוע להמחשה{" "}
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-external" />
                    </svg>
                  </a>
                </span>
              </div>
              <span>ללא חיפוש או חיבור למאגרים</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
