const COURTS = ["A", "B", "C"];
const COLORS = ["red","blue","green","yellow","purple"];

let pressTimer = null;

const names = [
  "김재용","염성민","김근태","장준원","손가람","이정현",
  "박종성","김준현","송지훈","박정규","김동현","유세호",
  "하지훈","김남진","이우진","이해동","박종혁","최준희",
  "최성욱","이진우","이현철","정상돈","최부승","최선우",
  "이명진","전유준","성제현","장이현"
];

const players = names.map(n => ({
  name: n,
  active: false,
  color: null
}));

const listEl = document.getElementById("playerList");
const resultEl = document.getElementById("result");
const countEl = document.getElementById("count");

const setStore = {1:null,2:null,3:null,4:null,5:null};

/* =========================
   COUNT
========================= */
function updateCount(){
  countEl.innerText = players.filter(p=>p.active).length;
}

/* =========================
   DOM MAP
========================= */
const domMap = new Map();

/* =========================
   PLAYER 생성
========================= */
players.forEach(p=>{
  const div = document.createElement("div");
  div.className = "player";
  div.innerText = p.name;

  div.setAttribute("draggable", "false"); // 🔥 핵심

  domMap.set(p.name, div);

  div.onclick = ()=>{
    p.active = !p.active;
    div.classList.toggle("active");
    updateCount();
    reorder();
  };

  attachPress(div, p);

  listEl.appendChild(div);
});

/* =========================
   GUEST
========================= */
const guest = document.createElement("div");
guest.className = "player guest";
guest.innerText = "+";

guest.setAttribute("draggable", "false");

guest.onclick = ()=>{
  const name = prompt("GUEST NAME");
  if(!name) return;

  const p = {name, active:true, color:null};
  players.push(p);

  const div = document.createElement("div");
  div.className = "player active";
  div.innerText = name;

  div.setAttribute("draggable", "false");

  domMap.set(name, div);

  div.onclick = ()=>{
    p.active = !p.active;
    div.classList.toggle("active");
    updateCount();
    reorder();
  };

  attachPress(div, p);

  listEl.appendChild(div);
  updateCount();
  reorder();
};

listEl.appendChild(guest);

/* =========================
   🔥 롱프레스 (모바일 안정)
========================= */
function attachPress(div, player){

  const start = (e) => {
    e.preventDefault();
    e.stopPropagation(); // 🔥 중요

    pressTimer = setTimeout(()=>{
      changeColor(div, player);
    }, 600);
  };

  const end = () => {
    clearTimeout(pressTimer);
  };

  div.addEventListener("touchstart", start, { passive: false });
  div.addEventListener("touchend", end);

  div.addEventListener("mousedown", start);
  div.addEventListener("mouseup", end);
  div.addEventListener("mouseleave", end);

  div.addEventListener("contextmenu", e => e.preventDefault());

  div.addEventListener("dragstart", e => e.preventDefault()); // 🔥 핵심
}

/* =========================
   색 변경
========================= */
function changeColor(div, player){

  let idx = COLORS.indexOf(player.color);
  idx = (idx + 1) % COLORS.length;

  COLORS.forEach(c => div.classList.remove(c));

  player.color = COLORS[idx];
  div.classList.add(player.color);
}

/* =========================
   정렬 (선택자 상단)
========================= */
function reorder(){

  const active = [];
  const inactive = [];

  players.forEach(p=>{
    const el = domMap.get(p.name);
    if(!el) return;

    if(p.active) active.push(el);
    else inactive.push(el);
  });

  listEl.innerHTML = "";

  active.forEach(el => listEl.appendChild(el));
  inactive.forEach(el => listEl.appendChild(el));
  listEl.appendChild(guest);
}

/* =========================
   GAME
========================= */
document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick = ()=>{

    const available = players.filter(p=>p.active);

    if(available.length < 4){
      alert("인원 부족");
      return;
    }

    let grouped = {};

    available.forEach(p=>{
      let key = p.color || "none";
      if(!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    });

    let pairs = [];

    Object.values(grouped).forEach(group=>{
      shuffle(group);

      for(let i=0;i<group.length;i+=2){
        if(group[i+1]){
          pairs.push(group[i], group[i+1]);
        }
      }
    });

    shuffle(pairs);

    let matches = [];

    for(let i=0;i<COURTS.length;i++){
      if(pairs.length < 4) break;

      matches.push([
        pairs.shift(),
        pairs.shift(),
        pairs.shift(),
        pairs.shift()
      ]);
    }

    setStore[btn.dataset.set] = matches;
    render();
  };
});

/* =========================
   RESULT
========================= */
function render(){

  resultEl.innerHTML = "";

  for(let s=1;s<=5;s++){
    const data = setStore[s];
    if(!data) continue;

    const div = document.createElement("div");
    div.className = "result-set";

    div.innerHTML =
      `(${s})<br>` +
      data.map((t,i)=>
        `${COURTS[i]}코트: ${t[0].name} ${t[1].name} vs ${t[2].name} ${t[3].name}`
      ).join("<br>");

    resultEl.appendChild(div);
  }
}

/* =========================
   shuffle
========================= */
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    let j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}