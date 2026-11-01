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
    const on = !heroVisible && !finalVisible;
    sticky.classList.toggle("is-visible", on);
    document.body.classList.toggle("sticky-on", on);
  };
  new IntersectionObserver(function (entries) {
    heroVisible = entries[0].isIntersecting; update();
  }).observe(hero);
  new IntersectionObserver(function (entries) {
    finalVisible = entries[0].isIntersecting; update();
  }).observe(finalSection);

  // ---- אנימציה עדינה: חלקים "עולים" לתוך המסך בגלילה ----
  const revealItems = document.querySelectorAll(".section__head, .checklist li, .problem__card, .step, .box, .who-card, .benefit, .about__text, .about__photo");
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

/* ============================================================
   האנימציה בפתיחה: רצף הודעות נכנס, ואז הכול מתנקה
   ------------------------------------------------------------
   רוצה לשנות הודעות? משנים את הרשימה כאן.
   av = האות בעיגול, name = מי שולחת, text = ההודעה, badge = המספר האדום
   ============================================================ */
const MESSAGES = [
  { av: "ג", name: "קבוצת הגן", text: "מי מביאה מחר עוגה? 🎂", badge: "112" },
  { av: "ל", name: "לקוחה", text: "רק שאלה קטנה...", badge: "4", style: "b" },
  { av: "א", name: "אמא", text: "התקשרתי אלייך 3 פעמים", badge: "3" },
  { av: "@", name: "מייל", text: "חשבונית לא שולמה", badge: "!", style: "c" },
  { av: "ו", name: "ועד הבית", text: "תזכורת: תשלום חודשי", badge: "38" },
  { av: "ח", name: "קבוצת החוג", text: "שינוי שעה!! קראו עד הסוף", badge: "57" },
  { av: "ת", name: "תזכורת", text: "תור לרופא שיניים מחר", badge: "1", style: "c" },
  { av: "ש", name: "השכונה שלנו", text: "מישהי יודעת של מי הכלב?", badge: "86" },
  { av: "ל", name: "לקוחה", text: "?? ראית את ההודעה שלי", badge: "5", style: "b" }
];

(function () {
  const feed = document.getElementById("feed");
  const phone = document.querySelector(".phone");
  const calm = document.getElementById("calm");
  const count = document.getElementById("notifCount");
  if (!feed || !phone) return;
  // מי שביקשה בהגדרות המכשיר פחות תנועה, רואה תמונה קבועה
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const MAX_VISIBLE = 5;
  let total = 0, running = false, timers = [];
  const wait = function (ms) { return new Promise(function (r) { timers.push(setTimeout(r, ms)); }); };

  function makeMsg(m) {
    const el = document.createElement("div");
    el.className = "msg";
    el.innerHTML =
      '<span class="msg__av' + (m.style ? " msg__av--" + m.style : "") + '">' + m.av + '</span>' +
      '<span class="msg__body"><b>' + m.name + '</b><span>' + m.text + '</span></span>' +
      '<span class="msg__meta"><small>עכשיו</small><em>' + m.badge + '</em></span>';
    return el;
  }
  function setCount(n) {
    count.textContent = n;
    count.classList.toggle("zero", n === 0);
    count.classList.add("bump");
    setTimeout(function () { count.classList.remove("bump"); }, 220);
  }

  async function cycle() {
    feed.innerHTML = ""; total = 0; setCount(0);
    calm.classList.remove("is-on");
    await wait(700);
    // שלב 1: ההודעות נכנסות, כל פעם קצת יותר מהר
    for (let i = 0; i < MESSAGES.length; i++) {
      const el = makeMsg(MESSAGES[i]);
      feed.prepend(el);
      requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("is-in"); }); });
      total += 1 + Math.floor(Math.random() * 6); setCount(total);
      const all = feed.querySelectorAll(".msg");
      all.forEach(function (m, idx) { m.classList.toggle("is-old", idx >= 3); });
      if (all.length > MAX_VISIBLE) {
        const last = all[all.length - 1];
        last.classList.remove("is-in");
        setTimeout(function () { last.remove(); }, 450);
      }
      await wait(Math.max(380, 1300 - i * 120));
    }
    // שלב 2: שיא הרעש
    phone.classList.add("is-overload");
    await wait(900);
    phone.classList.remove("is-overload");
    // שלב 3: מנקות. ההודעות נעלמות אחת אחת
    const items = Array.from(feed.querySelectorAll(".msg"));
    for (const m of items) { m.classList.add("is-swipe"); await wait(110); }
    await wait(350);
    feed.innerHTML = ""; setCount(0);
    // שלב 4: שקט. נשאר רק זמן לעצמך
    calm.classList.add("is-on");
    await wait(3600);
    calm.classList.remove("is-on");
    await wait(600);
  }

  async function loop() {
    if (running) return;
    running = true;
    while (running) { await cycle(); }
  }
  function stop() { running = false; timers.forEach(clearTimeout); timers = []; }

  // האנימציה רצה רק כשהטלפון נראה על המסך
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) loop(); else stop();
    }, { threshold: 0.2 }).observe(phone);
  } else {
    loop();
  }
})();
