document.querySelectorAll(".genBtn").forEach(btn => {
  btn.onclick = () => {
    const setNo = btn.dataset.set;

    const available = players.filter(p => p.active);

    if (available.length < 4) {
      alert("인원 부족");
      return;
    }

    let pool = [...available];
    shuffle(pool);

    let used = new Set();
    let resultHTML = [];

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
        resultHTML.push(
          `${COURTS[i]}코트: ${team[0].name} ${team[1].name} vs ${team[2].name} ${team[3].name}`
        );
      }
    }

    const div = document.createElement("div");
    div.className = "result-set";

    if (resultHTML.length === 0) {
      div.innerHTML = `⚠️ 인원 부족`;
    } else {
      div.innerHTML =
        `<strong>(${setNo}세트)</strong><br>` +
        resultHTML.join("<br>");
    }

    resultEl.appendChild(div);
  };
});