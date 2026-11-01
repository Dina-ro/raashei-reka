/* ============================================================
   רעשי רקע · קובץ ההתנהגות
   ------------------------------------------------------------
   כאן מגדירים את מספר הוואטסאפ ואת ההודעה שתיפתח מוכנה.
   מספיק לשנות פה, וכל הכפתורים בדף מתעדכנים.
   ============================================================ */

// מספר הוואטסאפ בפורמט בינלאומי: 972 במקום ה-0 שבהתחלה
const WHATSAPP_NUMBER = "972547849329";

// ההודעה שתופיע מוכנה אצל מי שלוחצת על הכפתור
const WHATSAPP_MESSAGE = "היי דינה, אני רוצה להצטרף לאתגר רעשי רקע 🌸";

// ---- מחברים את כל כפתורי הוואטסאפ למספר ולהודעה ----
const waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
document.querySelectorAll(".wa-link").forEach(function (link) {
  link.href = waUrl;
});

// ---- השנה בתחתית הדף מתעדכנת לבד ----
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- כפתור צף בטלפון: מופיע אחרי הפתיחה, נעלם בהזמנה האחרונה ----
const sticky = document.querySelector(".sticky-cta");
const hero = document.querySelector(".hero");
const finalSection = document.querySelector(".final");

if ("IntersectionObserver" in window && sticky && hero && finalSection) {
  let heroVisible = true;
  let finalVisible = false;
  const update = function () {
    sticky.classList.toggle("is-visible", !heroVisible && !finalVisible);
  };
  new IntersectionObserver(function (entries) {
    heroVisible = entries[0].isIntersecting; update();
  }).observe(hero);
  new IntersectionObserver(function (entries) {
    finalVisible = entries[0].isIntersecting; update();
  }).observe(finalSection);

  // ---- אנימציה עדינה: חלקים "עולים" לתוך המסך בגלילה ----
  const revealItems = document.querySelectorAll(".section__head, .checklist li, .problem__card, .step, .box, .benefit, .about__text, .about__photo");
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach(function (el) {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}
