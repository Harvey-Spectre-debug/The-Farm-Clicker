let coins = 0;
let crops = 0;
let crops2 = 0;
let clickPower = 1;
let upgradeCost = 25;

function update() {
  document.getElementById("coins").textContent = coins;
  document.getElementById("crops").textContent = crops;
  document.getElementById("crops2").textContent=crops2;
  document.getElementById("buy").disabled = coins < 10;
  document.getElementById("buy2").disabled = coins < 50;
  document.getElementById("upgrade").disabled = coins < upgradeCost;
}

document.getElementById("farm").onclick = () => { coins += clickPower; update(); };

document.getElementById("buy").onclick = () => {
  if (coins >= 10) { coins -= 10; crops++; update(); }
};
document.getElementById("buy2").onclick = () =>{
   if (coins >=50) { coins -=50; crops2++; update(); }
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

setInterval(() => { coins += crops + crops2 * 5; update(); }, 1000);
update();