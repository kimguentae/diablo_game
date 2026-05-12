const COURTS = ["A", "B", "C"];

const SETS = [
  { label: "1세트", start: "20:20", end: "21:00" },
  { label: "2세트", start: "21:00", end: "21:40" },
  { label: "3세트", start: "21:40", end: "22:20" },
  { label: "4세트", start: "22:20", end: "23:00" }
];

// 기본 명단
const names = [
  "김재용","염성민","김근태","장준원","손가람","이정현",
  "박종성","김준현","송지훈","박정규","김동현","유세호",
  "하지훈","김남진","이우진","이해동","박종혁","최준희",
  "최성욱","이진우","이현철","정상돈","최부승","최선우",
  "이명진","전유준","성제현","장이현"
];

// 선수 데이터
const players = names.map(n => ({
  name: n,
  active: false,
  leave: "23:00",
  earlyExit: false,
  games: 0
}));

const listEl = document.getElementById("playerList");
const resultEl = document.getElementById("result");

/* =========================
   UI 생성
========================= */
function renderPlayer(p) {
  const div = document.createElement("div");
  div.className = "player";

  div.innerHTML = `
    <strong>${p.name}</strong>
    <div class="player-options" style="display:none">
      ⏰ 퇴장
      <select>
        <option>21:00</option>
        <option>21:40</option>
        <option>22:20</option>
        <option selected>23:00</option>
      </select>
      <br/>
      ⚡ 조기퇴장 <input type="checkbox"/>
    </div>
  `;

  div.onclick = () => {
    p.active = !p.active;
    div.classList.toggle("active");
    div.querySelector(".player-options").style.display =
      p.active ? "block" : "none";
  };

  div.querySelector("select").onchange = e => {
    p.leave = e.target.value;
  };

  div.querySelector("input").onchange = e => {
    p.earlyExit = e.target.checked;
  };

  listEl.appendChild(div);
}

players.forEach(renderPlayer);

/* =========================
   게스트 추가 (더블클릭)
========================= */
listEl.ondblclick = () => {
  const name = prompt("게스트 이름");
  if (!name) return;

  const p = {
    name,
    active: true,
    leave: "23:00",
    earlyExit: false,
    games: 0
  };

  players.push(p);
  renderPlayer(p);
};

/* =========================
   경기 생성
========================= */
document.getElementById("generateBtn").onclick = () => {
  resultEl.innerHTML = "";

  // 초기화
  players.forEach(p => p.games = 0);

  let prevSetPlayers = [];

  SETS.forEach(set => {

    // 현재 가능 인원
    let available = players.filter(p => p.active);

    // 우선순위 정렬 (조기퇴장 + 적게 뛴 사람)
    available.sort((a, b) => {
      if (a.earlyExit && !b.earlyExit) return -1;
      if (!a.earlyExit && b.earlyExit) return 1;
      return a.games - b.games;
    });

    const used = new Set();
    const matches = [];
    const currentSetPlayers = [];

    for (let court of COURTS) {

      let pool = available.filter(p => !used.has(p.name));

      // 이전 세트 중복 최소화 (완벽 강제 X, 자연스럽게)
      pool.sort((a, b) => {
        const aPrev = prevSetPlayers.includes(a.name);
        const bPrev = prevSetPlayers.includes(b.name);

        if (aPrev && !bPrev) return 1;
        if (!aPrev && bPrev) return -1;
        return 0;
      });

      if (pool.length < 4) break;

      const game = pool.slice(0, 4);

      game.forEach(p => {
        used.add(p.name);
        p.games++;
        currentSetPlayers.push(p.name);
      });

      matches.push(`${court}코트: ${game.map(p => p.name).join(" / ")}`);
    }

    prevSetPlayers = currentSetPlayers;

    const box = document.createElement("div");
    box.className = "result-set";

    if (matches.length === 0) {
      box.innerHTML = `<strong>${set.label}</strong><br>⚠️ 인원 부족`;
    } else {
      box.innerHTML =
        `<strong>${set.label} (${set.start}~${set.end})</strong><br>` +
        matches.join("<br>");
    }

    resultEl.appendChild(box);
  });
};