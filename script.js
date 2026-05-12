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

let fixedPairs = [];

const listEl = document.getElementById("playerList");
const resultEl = document.getElementById("result");

/* =========================
   이름 카드 UI
========================= */
players.forEach(p => {
  const div = document.createElement("div");
  div.className = "player";
  div.innerText = p.name;

  div.onclick = () => {
    p.active = !p.active;
    div.classList.toggle("active");
  };

  listEl.appendChild(div);
});

/* =========================
   고정페어 (더블클릭)
========================= */
listEl.ondblclick = () => {
  const a = prompt("첫 번째 이름");
  const b = prompt("두 번째 이름");

  if (!a || !b) return;

  fixedPairs.push([a, b]);
  alert(`고정페어: ${a} - ${b}`);
};

/* =========================
   경기 자동편성 (1세트)
========================= */
document.getElementById("generateBtn").onclick = () => {
  resultEl.innerHTML = "";

  let available = players.filter(p => p.active);

  if (available.length < 4) {
    alert("인원이 부족합니다");
    return;
  }

  let used = new Set();
  let result = [];

  // 고정페어 우선
  fixedPairs.forEach(pair => {
    const p1 = available.find(p => p.name === pair[0]);
    const p2 = available.find(p => p.name === pair[1]);

    if (p1 && p2 && !used.has(p1.name) && !used.has(p2.name)) {
      used.add(p1.name);
      used.add(p2.name);
      result.push([p1, p2]);
    }
  });

  // 나머지 랜덤
  let pool = available.filter(p => !used.has(p.name));
  shuffle(pool);

  for (let i = 0; i < COURTS.length; i++) {
    const team = [];

    while (team.length < 4 && pool.length > 0) {
      const p = pool.shift();
      if (!used.has(p.name)) {
        used.add(p.name);
        team.push(p);
      }
    }

    if (team.length === 4) {
      result.push(team);
    }
  }

  // 출력
  result.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "result-set";

    div.innerHTML =
      `<strong>${COURTS[i]}코트</strong><br>` +
      r.map(p => p.name).join(" / ");

    resultEl.appendChild(div);
  });
};

/* =========================
   랜덤
========================= */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}