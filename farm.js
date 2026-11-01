const FARM_CROPS = {
    carrot: { icon: "🥕", seed: 10, grow: 20, sell: 20 },
    tomato: { icon: "🍅", seed: 50, grow: 45, sell: 120 }    
};
const FARM_KEY = "farmPlots";

let farmPlots = [];
let farmBasket = { carrot: 0, tomato: 0 };
let farmSeed = "carrot";

function farmToast(text) {
  if (typeof showToast === "function") showToast(text);
}

function farmSave() {
  if (typeof resetting !== "undefined" && resetting) return;
  localStorage.setItem(FARM_KEY, JSON.stringify({ plots: farmPlots, basket: farmBasket, seed: farmSeed }));
}

function farmLoad() {
    const raw = localStorage.getItem(FARM_KEY);
    if (raw) {
        try {
            const d = JSON.parse(raw);
            farmPlots = d.plots || [];
            farmBasket = d.basket || { carrot: 0, tomato: 0 };
            farmSeed = d.seed || "carrot";
          } catch (e) {
            farmPlots = [];   
        }
      } else {
        let i = 0;
        for (let n = 0; n < crops && i < TOTAL_PLOTS; n++, i++) {
            farmPlots[i] = { type: "carrot", planted: 0, watered: true };
        }
        for (let n = 0; n < crops2 && i < TOTAL_PLOTS; n++, i++) {
            farmPlots[i] = { type: "tomato", planted: 0, watered: true};
        }
        crops = 0;
        crops2 = 0;
      }
      while (farmPlots.length < TOTAL_PLOTS) farmPlots.push(null);
    }

    function resetFarm() {
        farmPlots = [];
        while (farmPlots.length < TOTAL_PLOTS) farmPlots.push(null);
        farmBasket = { carrot: 0, tomato: 0 };
    }

    function farmInfo(p) {
        const c = FARM_CROPS[p.type];
        const total = c.grow * 1000;
        const elapsed = Date.now() - p.planted;
        return {
            c: c,
            progress: Math.min(1,elapsed / total),
            left: Math.max(0, Math.ceil((total - elapsed) / 1000))
        };
    }

    function farmSellMultiplier() {
        const deco = typeof getBonus === "function" ? getBonus() : 1;
        const seeds = typeof goldenSeeds === "number" ? 1 + goldenSeeds * 0.25 : 1;
        return deco * seeds;
    }

    function farmBasketCount() {
        return farmBasket.carrot + farmBasket.tomato;
    }

    function farmBasketValue() {
        let v = 0;
        for (const k in FARM_CROPS) v += farmBasket[k] * FARM_CROPS[k].sell;
        return Math.round(v * farmSellMultiplier());
    }

    function farmCount(type) {
        return farmPlots.filter(p => p && p.type === type).length;
    }

    function farmClickPlot (i) {
        if (i >= unlockedPlots) {
            farmToast("🔒 Unlock this plot first");
            return;
      }
      const p = farmPlots[i];
      if (!p) {
        const c = FARM_CROPS[farmSeed];
        if (coins < c.seed) {
            farmToast("Not enough coins for " + " seeds (" + c.seed + ")");
            return;
        }
        coins -= c.seed;
        farmPlots[i] = { type: farmSeed, planted: Date.now(), watered: false };

     } else {
        const info = farmInfo(p);
        if (info.progress >= 1) {
            farmBasket[p.type]++;
            farmPlots[i] = null;
        } else if (!p.watered) {
            const remaining = info.c.grow * 1000 - (Date.now() - p.planted);
            p.planted -= remaining * 0.5;
            p.watered = true;
        } else {
          farmToast("💧 Already watered");
          return;
        }
     } 
     update();
   }
   
   function farmBuildPlots() {
    const box = document.getElementById("plots");
    box.innerHTML = "";
    box.dataset.farm = "1";
    for (let i = 0; i < TOTAL_PLOTS; i++) {
        const title = document.createElement("div");
        title.className = "plot";
        title.innerHTML = '<span class="em"></span><span class ="tag"></span>';
        title.onpointerdown = () => farmClickPlot(i);
        box.appendChild(title);
      }   
    }
    
   function drawPlots() {
    const box = document.getElementById("plots");
    if (box.dataset.farm !== "1" || box.children.length !== TOTAL_PLOTS) farmBuildPlots();

    for (let i = 0; i < TOTAL_PLOTS; i++) {
        const title = box.children[i];
        const p = farmPlots[i];
        let cls = "plot";
        let icon = "";
        let tag = "";
        if (i >= unlockedPlots) {
            cls += " locked";
            icon = "🔒";
         } else if (p) {
            const info = farmInfo(p);
            if (info.progress >= 1) {
            cls += " ripe";
            icon = info.c.icon;
            tag = "Harvest!";
          } else {
            icon = info.progress < 0.4 ? "🌱" : "🌿";
            tag = info.left + "s";
        if (p.watered) cls += "watered";
       }
     } 
     title.className = cls;
     title.children[0].textContent = icon;
     title.children[1].textContent = tag;
     
   }
 
   document.getElementById("bk-carrot").textContent = farmBasket.carrot;
   document.getElementById("bk-tomato").textContent = farmBasket.tomato;
   document.getElementById("bk-value").textContent = farmBasketValue();
   document.getElementById("sell").disabled = farmBasketCount() === 0;

   const b1 = document.getElementById("buy");
   const b2 = document.getElementById("buy2");
   b1.textContent = "🥕 Carrot seed (" + FARM_CROPS.carrot.seed + ") - grows in " + FARM_CROPS.carrot.grow + "s";
   b2.textContent = "🍅 Tomato seed (" + FARM_CROPS.tomato.seed + ") - grows in " + FARM_CROPS.tomato.grow + "s";
   b1.disabled = false;
   b2.disabled = false;
   b1.classList.toggle("selected", farmSeed === "carrot");
   b2.classList.toggle("selected", farmSeed === "tomato");

   document.getElementById("crops").textContent = farmCount("carrot"); 
   document.getElementById("crops2").textContent = farmCount("tomato");

   farmSave();
}

document.getElementById("buy").onclick = () => { farmSeed = "carrot"; update(); };
document.getElementById("buy2").onclick = () => { farmSeed = "tomato"; update(); }; 

document.getElementById("sell").onclick = () => {
    const amount = farmBasketValue();
    if (amount === 0) return;
    coins += amount;
    farmBasket = { carrot: 0, tomato: 0 };
    farmToast("💰 Sold for " + amount + " coins");
    update();
};      
 
 farmLoad();
 update();



      
