const COURTS = ["A","B","C"];

const COLOR_LIST = ["none","red","yellow","white","blue"];

const COLOR_MAP = {
  red: "#ff3b30",
  yellow: "#ffcc00",
  white: "#ffffff",
  blue: "#2979ff",
  none: null
};

const names = [
  "김재용","염성민","김근태","장준원","손가람","이정현",
  "박종성","김준현","송지훈","박정규","김동현","유세호",
  "하지훈","김남진","이우진","이해동","박종혁","최준희",
  "최성욱","이진우","이현철","정상돈","최부승","최선우",
  "이명진","전유준","성제현","장이현"
];

const players = names.map((n,i)=>({
  id:i,
  name:n,
  active:false,
  color:"none"
}));

const listEl = document.getElementById("playerList");
const resultEl = document.getElementById("result");
const countEl = document.getElementById("count");

const setStore = {1:null,2:null,3:null,4:null,5:null};

function updateCount(){
  countEl.innerText = players.filter(p=>p.active).length;
}

/* =========================
   PLAYER UI
========================= */
players.forEach(p=>{
  const div = document.createElement("div");
  div.className = "player";
  div.innerText = p.name;

  const dot = document.createElement("div");
  dot.className = "dot";
  div.appendChild(dot);

  function renderDot(){
    dot.style.background = COLOR_MAP[p.color] || "transparent";
  }

  renderDot();

  /* 클릭 = 선택 + 색 변경 */
  div.onclick = ()=>{
    p.active = !p.active;

    if(p.active){
      cycleColor(p);
    }

    div.classList.toggle("active");
    updateCount();
    reorder();
    renderDot();
  };

  /* 더블클릭 = 제외 */
  div.ondblclick = ()=>{
    p.active = false;
    p.color = "none";
    div.classList.remove("active");
    updateCount();
    reorder();
    renderDot();
  };

  listEl.appendChild(div);
});

/* =========================
   색 순환
========================= */
function cycleColor(p){
  const idx = COLOR_LIST.indexOf(p.color);
  p.color = COLOR_LIST[(idx+1)%COLOR_LIST.length];
}

/* =========================
   순서 (선택자 위)
========================= */
function reorder(){
  const active = [];
  const inactive = [];

  players.forEach(p=>{
    const el = Array.from(listEl.children)
      .find(d=>d.innerText===p.name);

    if(!el) return;

    if(p.active) active.push(el);
    else inactive.push(el);
  });

  listEl.innerHTML = "";
  active.forEach(e=>listEl.appendChild(e));
  inactive.forEach(e=>listEl.appendChild(e));
}

/* =========================
   GUEST
========================= */
const guest = document.createElement("div");
guest.className = "player guest";
guest.innerText = "+";

guest.onclick = ()=>{
  const name = prompt("GUEST NAME");
  if(!name) return;

  const p = {
    id:Date.now(),
    name,
    active:true,
    color:"none"
  };

  players.push(p);

  const div = document.createElement("div");
  div.className = "player active";
  div.innerText = name;

  const dot = document.createElement("div");
  dot.className = "dot";
  div.appendChild(dot);

  div.onclick = ()=>{
    p.active = !p.active;
    if(p.active) cycleColor(p);
    div.classList.toggle("active");
    renderDot();
    updateCount();
    reorder();
  };

  div.ondblclick = ()=>{
    p.active = false;
    p.color = "none";
    div.classList.remove("active");
    updateCount();
    reorder();
    renderDot();
  };

  function renderDot(){
    dot.style.background = COLOR_MAP[p.color] || "transparent";
  }

  listEl.appendChild(div);
  updateCount();
  reorder();
};

listEl.appendChild(guest);

/* =========================
   GAME (색 기반 고정 페어)
========================= */
document.querySelectorAll(".genBtn").forEach(btn=>{
  btn.onclick = ()=>{

    const available = players.filter(p=>p.active);

    if(available.length < 4){
      alert("인원 부족");
      return;
    }

    let groups = {};
    let normal = [];

    available.forEach(p=>{
      if(p.color !== "none"){
        if(!groups[p.color]) groups[p.color]=[];
        groups[p.color].push(p);
      }else{
        normal.push(p);
      }
    });

    let pool = [];

    Object.values(groups).forEach(g=>{
      for(let i=0;i<g.length;i+=2){
        if(g[i+1]){
          pool.push([g[i],g[i+1]]);
        }else{
          normal.push(g[i]);
        }
      }
    });

    let flat = pool.flat().concat(normal);
    shuffle(flat);

    let matches = [];

    for(let i=0;i<COURTS.length;i++){
      if(flat.length < 4) break;
      matches.push(flat.splice(0,4));
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
        `${COURTS[i]}: ${t[0].name} ${t[1].name} vs ${t[2].name} ${t[3].name}`
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