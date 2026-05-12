const COURTS = ["A", "B", "C"];

const names = [
  "김재용","염성민","김근태","장준원","손가람","이정현",
  "박종성","김준현","송지훈","박정규","김동현","유세호",
  "하지훈","김남진","이우진","이해동","박종혁","최준희",
  "최성욱","이진우","이현철","정상돈","최부승","최선우",
  "이명진","전유준","성제현","장이현"
];

const players = names.map(name => ({
  name,
  active: false
}));

let fixedPairs = [];

const playerList = document.getElementById("playerList");
const pairList = document.getElementById("pairList");
const countEl = document.getElementById("count");
const resultEl = document.getElementById("result");

/* PLAYER */
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
    reorderPlayers();
  };

  playerList.appendChild(div);
});

/* GUEST */
const guest = document.createElement("div");
guest.className = "player guest";
guest.innerText = "+";

guest.onclick = () => {
  const name = prompt("GUEST NAME");
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
    reorderPlayers();
  };

  playerList.appendChild(div);
  updateCount();
  reorderPlayers();
};

playerList.appendChild(guest);

/* 정렬 */
function reorderPlayers() {
  const active = [];
  const inactive = [];

  players.forEach(p => {
    const el = [...playerList.children].find(d => d.innerText === p.name);
    if (!el) return;
    (p.active ? active : inactive).push(el);
  });

  playerList.innerHTML = "";
  active.forEach(e => playerList.appendChild(e));
  inactive.forEach(e => playerList.appendChild(e));
  playerList.appendChild(guest);
}

/* FIXED PAIR 추가 */
document.getElementById("addPair").onclick = () => {
  const activePlayers = players.filter(p => p.active).map(p => p.name);
  if (activePlayers.length < 2) {
    alert("참석자 2명 이상 필요");
    return;
  }

  const p1 = prompt("첫 번째 이름:\n" + activePlayers.join(", "));
  if (!activePlayers.includes(p1)) return;

  const p2 = prompt("두 번째 이름:\n" + activePlayers.join(", "));
  if (!activePlayers.includes(p2) || p1 === p2) return;

  fixedPairs.push([p1, p2]);
  renderPairs();
};

function renderPairs() {
  pairList.innerHTML = "";

  fixedPairs.forEach((pair, i) => {
    const div = document.createElement("div");
    div.className = "pairItem";
    div.innerHTML = `<span>PAIR ${i + 1}</span> ${pair[0]} & ${pair[1]}`;

    const del = document.createElement("button");
    del.innerText = "X";
    del.onclick = () => {
      fixedPairs.splice(i, 1);
      renderPairs();
    };

    div.appendChild(del);
    pairList.appendChild(div);
  });
}

/* GAME */
document.querySelectorAll(".genBtn").forEach(btn => {
  btn.onclick = () => {
    const pool = players.filter(p => p.active).map(p => p.name);

    if (pool.length < 4) {
      alert("인원 부족");
      return;
    }

    let used = new Set();
    let matches = [];

    fixedPairs.forEach(pair => {
      if (pair.every(n => pool.includes(n))) {
        matches.push(pair);
        used.add(pair[0]);
        used.add(pair[1]);
      }
    });

    let rest = pool.filter(n => !used.has(n));
    shuffle(rest);

    let result = [];
    matches.forEach(pair => {
      if (rest.length >= 2) {
        result.push([pair[0], pair[1], rest.shift(), rest.shift()]);
      }
    });

    shuffle(rest);
    while (rest.length >= 4) {
      result.push([rest.shift(), rest.shift(), rest.shift(), rest.shift()]);
    }

    renderResult(result);
  };
});

function renderResult(matches) {
  resultEl.innerHTML = "";
  matches.slice(0, 3).forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "result-set";
    div.innerText = `${COURTS[i]}: ${m[0]} ${m[1]} vs ${m[2]} ${m[3]}`;
    resultEl.appendChild(div);
  });
}

/* shuffle */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}