const COURTS = ["A", "B", "C"];

const names = [
  "김재용","염성민","김근태","장준원","손가람","이정현",
  "박종성","김준현","송지훈","박정규","김동현","유세호",
  "하지훈","김남진","이우진","이해동","박종혁","최준희",
  "최성욱","이진우","이현철","정상돈","최부승","최선우",
  "이명진","전유준","성제현","장이현"
];

const players = names.map(n => ({
  name: n,
  active: false
}));

const listEl = document.getElementById("playerList");
const resultEl = document.getElementById("result");
const countEl = document.getElementById("count");

const setStore = { 1:null, 2:null, 3:null, 4:null, 5:null };

/* =========================
   UI 생성
========================= */
function updateCount() {
  countEl.innerText = players.filter(p => p.active).length;
}

players.forEach(p => {
  const div = document.createElement("div");
  div.className = "player";
  div.innerText = p.name;

  div.onclick = () => {
    p.active = !p.active;
    div.classList.toggle("active");
    updateCount();
  };

  listEl.appendChild(div);
});

/* =========================
   게스트
========================= */
const guest = document.createElement("div");
guest.className = "player";
guest.style.border = "2px dashed #555";
guest.innerText = "+ GUEST";

guest.ondblclick = () => {
  const name = prompt("게스트 이름");
  if (!name) return;

  const p = { name, active: true };
  players.push(p);

  const div = document.createElement("div");
  div.className = "player active";
  div.innerText = name;

  div.onclick = () => {
    p.active = !p.active;
    div.classList.toggle("active");
    updateCount();
  };

  listEl.insertBefore(div, guest);
  updateCount();
};

listEl.appendChild(guest);

/* =========================
   GAME 생성
========================= */
document.querySelectorAll(".genBtn").forEach(btn => {
  btn.onclick = () => {
    const setNo = Number(btn.dataset.set);

    const available = players.filter(p => p.active);

    if (available.length < 4) {
      alert("인원 부족");
      return;
    }

    let pool = [...available];
    shuffle(pool);

    let used = new Set();
    let matches = [];

    for (let i = 0; i < COURTS.length; i++) {
      const team = [];

      while (team.length < 4 && pool.length > 0) {
        const p = pool.shift();
        if (!used.has(p.name)) {
          used.add(p.name);
          team.push(p);
        }
      }

      if (team.length === 4) matches.push(team);
    }

    setStore[setNo] = matches;
    renderGames();
  };
});

/* =========================
   GAME 출력 (고정 순서)
========================= */
function renderGames() {
  resultEl.innerHTML = "";

  for (let s = 1; s <= 5; s++) {
    const data = setStore[s];

    const div = document.createElement("div");
    div.className = "result-set";

    if (!data) {
      div.innerHTML = `<b>(${s}세트)</b><br>대기`;
    } else {
      div.innerHTML =
        `<b>(${s}세트)</b><br>` +
        data.map((t, i) =>
          `${COURTS[i]}코트: ${t[0].name} ${t[1].name} vs ${t[2].name} ${t[3].name}`
        ).join("<br>");
    }

    resultEl.appendChild(div);
  }
}

/* =========================
   shuffle
========================= */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}