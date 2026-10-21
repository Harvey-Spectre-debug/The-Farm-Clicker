let coins = 0;
let crops = 0;
let crops2 = 0;
let clickPower = 1;
let upgradeCost = 25;
const TOTAL_PLOTS = 9;
let unlockedPlots =4;
let plotCost = 100;
function update() {
  document.getElementById("coins").textContent = coins;
  document.getElementById("crops").textContent = crops;
  document.getElementById("crops2").textContent=crops2;
  const full = crops + crops2 >=  unlockedPlots;
  document.getElementById("buy").disabled = coins < 10 || full;
  document.getElementById("buy2").disabled = coins < 50 || full;
  document.getElementById("upgrade").disabled = coins < upgradeCost;
  const pb = document.getElementById("plotbtn");
  pb.textContent = unlockedPlots >= TOTAL_PLOTS ? "All plots unlocked" : "Unlock plot (cost " + plotCost + ")";
  pb.disabled = coins < plotCost || unlockedPlots >= TOTAL_PLOTS; 
  drawPlots();
}
function drawPlots() {
  const box = document.getElementById("plots");
  box.innerHTML = "";
  for (let i = 0; i < TOTAL_PLOTS; i++) {
      const plot = document.createElement("div");
      plot.className = "plot";
      if (i >= unlockedPlots) {
        plot.classList.add("locked");
        plot.textContent = "🔒";
      } else if (i < crops) {
        plot.textContent = "🥕";
      }else if (i < crops + crops2) {
       plot.textContent = "🍅";
      }
      box.appendChild(plot);
  }

}

document.getElementById("farm").onclick = () => { coins += clickPower; update(); };

document.getElementById("buy").onclick = () => {
  if (coins >= 10 && crops + crops2 < unlockedPlots) { coins -=10; crops++; update(); }
};
document.getElementById("buy2").onclick = () =>{
   if (coins >= 50 && crops + crops2 < unlockedPlots) { coins -=50; crops2++; update(); }
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
document.getElementById("plotbtn").onclick = () => {
  if (coins >= plotCost && unlockedPlots < TOTAL_PLOTS) {
    coins -= plotCost;
    unlockedPlots++;
    plotCost *= 2;

  }
};
setInterval(() => { coins += crops + crops2 * 5; update(); }, 1000);
update();