import { useState } from "react";

/**
 * @param {{ report: ReturnType<typeof import("../../server/src/mappers/vehicleReport.js").mapVehicleReport> }} props
 */

export default function VehicleReport({ report }) {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { vehicle, history, specifications, ownershipHistory, ownershipRecordCount } = report;

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
            {vehicle.plateNumber.text}
          </b>
        </span>
        <span className="demo-label">
          <span></span>נתוני משרד התחבורה
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
                  {vehicle.plateNumber.text}
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
                  {vehicle.manufacturer.text}
                </span>
                <span className="body-type">{specifications.bodyType.text}</span>
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
                  {vehicle.model.text}
                </h3>
                <p>
                  {vehicle.model.text} <span>·</span> {vehicle.manufacturerYear.text} <span>·</span>{vehicle.color.text}
                </p>
              </div>
              <span className="model-year" dir="ltr">
                {vehicle.manufacturerYear.shortText}<span>MODEL</span>
              </span>
            </div>
            <div className="vehicle-plate-row">
              <span>מספר רישוי</span>
              <div className="license-plate" dir="ltr">
                <span className="plate-country">IL</span>
                <strong>{vehicle.plateNumber.text}</strong>
              </div>
            </div>
            <div className="vehicle-quick-specs">
              <span>
                <svg className="icon" aria-hidden="true">
                  <use href="#i-leaf" />
                </svg>
                {vehicle.fuelType.text}
              </span>
              <span>
                <svg className="icon" aria-hidden="true">
                  <use href="#i-seat" />
                </svg>
                {specifications.seatCount.display}
              </span>
              <span>
                <svg className="icon" aria-hidden="true">
                  <use href="#i-user" />
                </svg>
                {vehicle.currentOwnershipType.text}
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
                  <dt>{vehicle.manufacturer.label}</dt>
                  <dd dir="ltr">{vehicle.manufacturer.text}</dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-layers" />
                    </svg>
                  </span>
                  <dt>{vehicle.model.label}</dt>
                  <dd dir="ltr">{vehicle.model.text}</dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-calendar" />
                    </svg>
                  </span>
                  <dt>{vehicle.manufacturerYear.label}</dt>
                  <dd>{vehicle.manufacturerYear.text}</dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-car" />
                    </svg>
                  </span>
                  <dt>{specifications.bodyType.label}</dt>
                  <dd>{specifications.bodyType.text}</dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-fuel" />
                    </svg>
                  </span>
                  <dt>{vehicle.fuelType.label}</dt>
                  <dd>{vehicle.fuelType.text}</dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-drop" />
                    </svg>
                  </span>
                  <dt>{vehicle.color.label}</dt>
                  <dd>
                    <span className="color-dot" aria-hidden="true"></span>{vehicle.color.text}
                  </dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-seat" />
                    </svg>
                  </span>
                  <dt>{specifications.seatCount.label}</dt>
                  <dd>
                    {specifications.seatCount.text} <small>{specifications.seatCount.unit}</small>
                  </dd>
                </div>
                <div>
                  <span className="field-icon">
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-gauge" />
                    </svg>
                  </span>
                  <dt>{history.lastTestMileageKm.label}</dt>
                  <dd
                    className={
                      history.lastTestMileageKm.value === null
                        ? "missing-value"
                        : undefined
                    }
                  >
                    {history.lastTestMileageKm.display}
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
                      <dt>{history.firstRegistrationDate.label}</dt>
                      <dd dir="ltr">{history.firstRegistrationDate.text}</dd>
                    </div>
                    <div>
                      <dt>{vehicle.licenseValidUntil.label}</dt>
                      <dd dir="ltr">{vehicle.licenseValidUntil.text}</dd>
                    </div>
                    <div>
                      <dt>{vehicle.lastTestDate.label}</dt>
                      <dd dir="ltr">{vehicle.lastTestDate.text}</dd>
                    </div>
                    <div>
                      <dt>{vehicle.firstRoadMonth.label}</dt>
                      <dd dir="ltr">{vehicle.firstRoadMonth.text}</dd>
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
                      <dt>{vehicle.currentOwnershipType.label}</dt>
                      <dd>
                        <span className="ownership-pill">{vehicle.currentOwnershipType.text}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>{ownershipRecordCount.label}</dt>
                      <dd>{ownershipRecordCount.text}</dd>
                    </div>
                    <div>
                      <dt>{history.structureChanged.label}</dt>
                      <dd>{history.structureChanged.text}</dd>
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
                      <dt>{vehicle.fuelType.label}</dt>
                      <dd>{vehicle.fuelType.text}</dd>
                    </div>
                    <div>
                      <dt>{specifications.engineDisplacementCc.label}</dt>
                      <dd>{specifications.engineDisplacementCc.display}</dd>
                    </div>
                    <div>
                      <dt>{vehicle.engineModel.label}</dt>
                      <dd>{vehicle.engineModel.text}</dd>
                    </div>
                    <div>
                      <dt>{specifications.powerHp.label}</dt>
                      <dd>{specifications.powerHp.text} {specifications.powerHp.unit}</dd>
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
                      <dt>{specifications.seatCount.label}</dt>
                      <dd>
                        {specifications.seatCount.text} <small>{specifications.seatCount.unit}</small>
                      </dd>
                    </div>
                    <div>
                      <dt>{vehicle.frontTireSize.label}</dt>
                      <dd>{vehicle.frontTireSize.text}</dd>
                    </div>
                    <div>
                      <dt>{vehicle.trimLevel.label}</dt>
                      <dd>{vehicle.trimLevel.text}</dd>
                    </div>
                    <div>
                      <dt>{specifications.countryOfManufacture.label}</dt>
                      <dd>{specifications.countryOfManufacture.text}</dd>
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
              tabIndex={0}
              hidden={activeTab !== "history"}
            >
              <div className="section-heading">
                <h3>הדרך של הרכב</h3>
                <span>היסטוריית בעלויות</span>
              </div>
              <div className="history-summary">
                <span className="history-count">{ownershipRecordCount.text}</span>
                <div>
                  <strong>{ownershipRecordCount.label}</strong>
                  <p>סוגי הבעלות והמועדים כפי שנמסרו במאגר.</p>
                </div>
                <svg className="icon" aria-hidden="true">
                  <use href="#i-history" />
                </svg>
              </div>
              {ownershipHistory.length > 0 ? (
                <ol className="ownership-timeline">
                  {ownershipHistory.map((record) => (
                    <li key={record.id}>
                      <span className="timeline-dot" aria-hidden="true"></span>
                      <div>
                        <div className="timeline-heading">
                          <h4>{record.ownershipType.text}</h4>
                        </div>

                        <p>
                          {record.startMonth.label}:{" "}
                          <b dir="ltr">{record.startMonth.text}</b>
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>לא נמצאו רשומות בעלות במאגר עבור הרכב הזה.</p>
              )}

              <div className="panel-note">
                <svg className="icon" aria-hidden="true">
                  <use href="#i-info" />
                </svg>
                <p>
                  המידע מתייחס לסוג הבעלות ולחודש תחילה.
                  מספר הרשמות אינו בהכרח מספר הבעלים הקודמים.
                  לא מוצגים פרטים אישים של בעלי הרכב.
                </p>
              </div>
            </section>

            <div className="report-source">
              <div>
                <svg className="icon" aria-hidden="true">
                  <use href="#i-database" />
                </svg>
                <span>
                  מקור הנתונים:{" "}
                  <a href="https://data.gov.il" target="_blank" rel="noopener noreferrer">
                    משרד התחבורה - data.gov.il{" "}
                    <svg className="icon" aria-hidden="true">
                      <use href="#i-external" />
                    </svg>
                  </a>
                </span>
              </div>
              <span>המידע מוצג כפי שנמסר במאגרים</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
