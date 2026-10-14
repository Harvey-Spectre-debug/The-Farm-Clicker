let coins = 0;
let crops = 0;

function update() {
  document.getElementById("coins").textContent = coins;
  document.getElementById("crops").textContent = crops;
}

document.getElementById("farm").onclick = () => { coins++; update(); };

document.getElementById("buy").onclick = () => {
  if (coins >= 10) { coins -= 10; crops++; update(); }
};

setInterval(() => { coins += crops; update(); }, 1000);
