const playerGrid = document.getElementById('playerGrid');
const playerCount = document.getElementById('playerCount');
const addGuestBtn = document.getElementById('addGuestBtn');

let players = [
  "김재용","염성민","김근태","장준원","손가람",
  "이정현","박종성","김준현","송지훈","박정규",
  "김동현","유세호","하지훈","김남진","이우진",
  "이해동","박종혁","최준희","최성욱","이진우",
  "이현철","정상돈","최부승","최선우","이명진",
  "전유준","성제현","장이현"
].map(name => ({ name, active: false }));

renderPlayers();

/* PLAYER 렌더 */
function renderPlayers() {
  playerGrid.innerHTML = '';

  players.forEach((player) => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = player.name;

    if (player.active) btn.classList.add('selected');

    btn.addEventListener('click', () => {
      player.active = !player.active;
      renderPlayers();
    });

    playerGrid.appendChild(btn);
  });

  updateCount();
}

/* 참석 인원 카운트 */
function updateCount() {
  const count = players.filter(p => p.active).length;
  playerCount.textContent = count;
}

/* GUEST 추가 */
addGuestBtn.addEventListener('click', () => {
  const name = prompt('GUEST NAME');
  if (!name) return;

  players.push({ name, active: true });
  renderPlayers();
});