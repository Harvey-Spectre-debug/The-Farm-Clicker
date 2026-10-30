let coins = 0;
let crops = 0;
let crops2 = 0;
let clickPower = 1;
let upgradeCost = 25;
const TOTAL_PLOTS = 9;
let unlockedPlots =4;
let plotCost = 100;
const decorItems = [
  { emoji: "🌳", name: "Oak tree", cost: 150, bonus: 0.05 },
  { emoji: "🏠", name: "Cottage", cost: 400, bonus: 0.10 },
  { emoji: "⛲", name: "Fountain", cost: 900, bonus: 0.15 },
  { emoji: "🌬️", name: "Windmill", cost: 2000, bonus: 0.25 },
  { emoji: "🏰", name: "Castle", cost: 6000, bonus: 0.50 }
];
let owned = [];
let season = 1;
let goldenSeeds = 0;
const seasons = [
  { name: "Spring", a: "#bfe3ff", b: "#cfe8b0", c: "#8fcf6a" },
  { name: "Summer", a: "#fff3b0", b: "#ffd98a", c: "#f5a65b" },
  { name: "Autumn", a: "#f9d5a7", b: "#e8a15a", c: "#b5651d" },
  { name: "Winter", a: "#e8f4ff", b: "#cfe3f5", c: "#ffffff" }
];
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
  drawDecor();
  drawPlots();
  drawSeason();
  save();
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
function getBonus() {
  let total = 1;
  owned.forEach(i => { total += decorItems[i].bonus; });
  return total;
}

function getRank() {
  if (owned.length >= 5) return "Dream Island";
  if (owned.length >=3) return "lively Island";
  if (owned.length >= 1) return "Cozy Island";
  return "Bare Patch"
}

function buildShop() {
  const shop = document.getElementById("shop");
  decorItems.forEach((item, i) => {
    const btn = document.createElement("button");
    btn.id = "shop" + i;
    btn.onclick = () => {
      if (coins >= item.cost && !owned.includes(i)) {
        coins -= item.cost;
        owned.push(i);
        update();
      }
    };
    shop.appendChild(btn);
  });
}

function drawDecor() {
  decorItems.forEach((item, i) => {
    const btn = document.getElementById("shop" + i);
    const has = owned.includes(i);
    btn.textContent = has ? item.emoji + "Owned" : item.emoji + " " + item.name + " (" + item.cost + ")";
    btn.disabled = has || coins < item.cost;
  });
  document.getElementById("decor").textContent = owned.map(i => decorItems[i].emoji).join(" ");
  document.getElementById("rank").textContent = getRank();
  document.getElementById("bonus").textContent = Math.round((getBonus() - 1) * 100);
  }
function drawSeason() {
  const s = seasons[(season - 1) % 4];
  document.body.style.background = "linear-gradient(" + s.a + ", " + s.b + " 60%, " + s.c + ")";
  document.getElementById("seasoninfo").textContent = 
   s.name + " (Season " + season + ") | Golden Seeds: " + goldenSeeds + " (+" + goldenSeeds * 25 + "% income)";
  const btn = document.getElementById("newseason");
  btn.textContent = "🌱 Start Season " + (season + 1) + " (+1 Golden Seed)";
  btn.disabled = owned.length <decorItems.length;
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
}
function save() {
  const data = { coins, crops, crops2, clickPower, upgradeCost, unlockedPlots, plotCost, owned, season, goldenSeeds };
  localStorage.setItem("farmSave", JSON.stringify(data));
}

function load() {
  const saved = localStorage.getItem("farmSave");
  if (!saved) return;
  const data = JSON.parse(saved);  
  coins = data.coins || 0;
  crops = data.crops || 0;
  crops2 = data.crops2 || 0;
  clickPower = data.clickPower || 1;
  upgradeCost = data.upgradeCost || 25;
  unlockedPlots = data.unlockedPlots || 4;
    plotCost = data.plotCost || 100;
    owned = data.owned || [];
    season = data.season || 1;
    goldenSeeds = Math.max(0, season - 1);
  document.getElementById("upgrade").textContent = "Upgrade click (cost " + upgradeCost + ")"; 
}
document.getElementById("newseason").onclick = () => {
  if (owned.length < decorItems.length) return;
  if (!confirm("Start a new season? You keep your Golden Seeds, but everything else resets.")) return;
  goldenSeeds++;
  season++;
  coins = 0;
  crops = 0;
  crops2 = 0;
  clickPower = 1;
  upgradeCost = 25;
  unlockedPlots = 4;
  plotCost = 100;
  owned = [];
  document.getElementById("upgrade").textContent = "Upgrade click (cost " + upgradeCost + ")";
  update();
};

setInterval(() => { coins += Math.round((crops + crops2 * 5) * getBonus() * (1 + goldenSeeds * 0.25)); update(); }, 1000);
buildShop();
load();
update(); 