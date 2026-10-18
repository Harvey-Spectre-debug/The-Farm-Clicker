let coins = 0;
let crops = 0;
let clickPower = 1;
let upgradeCost = 25;

function update() {
  document.getElementById("coins").textContent = coins;
  document.getElementById("crops").textContent = crops;
}

document.getElementById("farm").onclick = () => { coins += clickPower; update(); };

document.getElementById("buy").onclick = () => {
  if (coins >= 10) { coins -= 10; crops++; update(); }
};

document.getElementById("upgrade").onclick = () => {
  if (coins >= upgradeCost) {
    coins -= upgradeCost;
    clickPower++;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    document.getElementById("upgrade").textContent = "Upgrade click (cost " + upgradeCost + ")";
    update();
  }
};

setInterval(() => { coins += crops; update(); }, 1000);