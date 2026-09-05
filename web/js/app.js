/* ═══════════════════════════════════════════════════════════════════════
   ROMECA-FIT 🌿 — El Universo de las Recetas Saludables
   app.js: Controlador UI — consume la API Go/WASM, renderiza con Tailwind
   BACKEND: Go/WASM (cmd/wasm/main.go) — NO se modifica
   FRONTEND: Este archivo solo maneja UI y DOM
   ═══════════════════════════════════════════════════════════════════════ */

const App = {
  state: {
    activeTab: 'plan',
    theme: localStorage.getItem('rf-theme') || 'light',
    ingredients: [],
    dishes: [],
    mealPlan: null,
    shoppingList: [],
    activeFilter: 'all',
    activeMealFilter: 'all',
  },

  // ── Inicialización ───────────────────────────────────────────────────
  init() {
    if (this.state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    this.updateThemeIcon();

    if (window.wasmReady) {
      this.onWasmLoaded();
    } else {
      document.addEventListener('wasm-ready', () => this.onWasmLoaded());
    }

    this.bindEvents();
  },

  onWasmLoaded() {
    try {
      this.state.ingredients = JSON.parse(getIngredients());
      this.state.dishes = JSON.parse(getDishes('ambos'));
      this.state.mealPlan = JSON.parse(getMealPlan());
      this.state.shoppingList = JSON.parse(getShoppingList('ambos'));

      this.renderAll();

      setTimeout(() => {
        const ls = document.getElementById('loading-screen');
        ls.style.opacity = '0';
        ls.style.pointerEvents = 'none';
        setTimeout(() => ls.remove(), 500);
      }, 400);
    } catch (err) {
      console.error('Error inicializando datos:', err);
    }
  },

  renderAll() {
    this.renderStats();
    this.renderMealPlan();
    this.renderRecipes();
    this.renderIngredients();
    this.renderShoppingList();
  },

  bindEvents() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  },

  // ── MEDIDAS DE COCINA ────────────────────────────────────────────────
  formatKitchenQty(quantityG, ingredient) {
    if (!ingredient || !ingredient.kitchen_unit_g || ingredient.kitchen_unit_g <= 0) {
      return `${Math.round(quantityG)}g`;
    }
    const units = quantityG / ingredient.kitchen_unit_g;
    const fractionStr = this.formatFraction(units);
    const unitName = ingredient.kitchen_unit || 'porción';

    let displayUnit = unitName;
    if (units > 1 && !unitName.includes(' ')) {
      const plurals = {
        'taza': 'tazas', 'cucharada': 'cucharadas', 'cucharadita': 'cucharaditas',
        'unidad': 'unidades', 'filete': 'filetes', 'pechuga': 'pechugas',
        'lata': 'latas', 'nuez': 'nueces', 'diente': 'dientes',
        'tallo': 'tallos', 'pizca': 'pizcas', 'puñado': 'puñados',
      };
      displayUnit = plurals[unitName] || unitName;
    }

    return `${fractionStr} ${displayUnit}`;
  },

  formatFraction(n) {
    if (n <= 0) return '0';
    const whole = Math.floor(n);
    const frac = n - whole;
    const fractions = [
      { val: 0,    str: '' },
      { val: 0.125, str: '⅛' },
      { val: 0.20,  str: '⅕' },
      { val: 0.25,  str: '¼' },
      { val: 0.33,  str: '⅓' },
      { val: 0.50,  str: '½' },
      { val: 0.67,  str: '⅔' },
      { val: 0.75,  str: '¾' },
    ];
    let closest = fractions[0];
    let minDiff = Infinity;
    for (const f of fractions) {
      const diff = Math.abs(frac - f.val);
      if (diff < minDiff) { minDiff = diff; closest = f; }
    }
    if (whole === 0 && closest.str === '') return '~1';
    if (whole === 0) return closest.str;
    if (closest.str === '') return `${whole}`;
    return `${whole}${closest.str}`;
  },

  // ── Tab Navigation ───────────────────────────────────────────────────
  switchTab(tabName) {
    this.state.activeTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const isActive = btn.dataset.tab === tabName;
      btn.className = isActive
        ? 'tab-btn flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-fit-600 text-white shadow-md'
        : 'tab-btn flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200';
    });
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.add('hidden'));
    const activePanel = document.getElementById(`panel-${tabName}`);
    if (activePanel) {
      activePanel.classList.remove('hidden');
      activePanel.style.animation = 'none';
      void activePanel.offsetWidth;
      activePanel.style.animation = '';
    }
  },

  // ── Theme ────────────────────────────────────────────────────────────
  toggleTheme() {
    this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', this.state.theme === 'dark');
    localStorage.setItem('rf-theme', this.state.theme);
    this.updateThemeIcon();
  },

  updateThemeIcon() {
    const btn = document.getElementById('theme-toggle');
    btn.textContent = this.state.theme === 'light' ? '🌙' : '☀️';
  },

  // ── Stats ────────────────────────────────────────────────────────────
  renderStats() {
    const container = document.getElementById('stats-row');
    const stats = [
      { emoji: '🍳', value: this.state.dishes.length, label: 'Recetas' },
      { emoji: '🥗', value: this.state.ingredients.length, label: 'Ingredientes' },
      { emoji: '📅', value: this.state.mealPlan ? this.state.mealPlan.days.length : 0, label: 'Días' },
      { emoji: '🛒', value: this.state.shoppingList.length, label: 'Compras' },
    ];
    container.innerHTML = stats.map((s, i) => `
      <div class="bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm border border-white dark:border-gray-800 rounded-xl p-3 sm:p-4 text-center animate-slide-up" style="animation-delay:${i*60}ms">
        <div class="text-xl sm:text-2xl mb-1">${s.emoji}</div>
        <div class="text-2xl sm:text-3xl font-extrabold text-fit-700 dark:text-fit-400 leading-none">${s.value}</div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">${s.label}</div>
      </div>
    `).join('');
  },

  // ══════════════════════════════════════════════════════════════════════
  // PLAN SEMANAL
  // ══════════════════════════════════════════════════════════════════════
  renderMealPlan() {
    if (!this.state.mealPlan) return;
    const grid = document.getElementById('meal-grid');
    const days = this.state.mealPlan.days;
    const mealTypes = [
      { key: 'breakfast_id', label: '🌅 Desayuno' },
      { key: 'lunch_id',     label: '☀️ Almuerzo' },
      { key: 'dinner_id',    label: '🌙 Cena' },
    ];

    let html = '<div class="meal-label"></div>';
    days.forEach(day => {
      html += `<div class="meal-header">${day.day_name}</div>`;
    });

    mealTypes.forEach(mt => {
      html += `<div class="meal-label">${mt.label}</div>`;
      days.forEach(day => {
        const dishId = day[mt.key];
        const dish = this.state.dishes.find(d => d.id === dishId);
        if (!dish) {
          html += '<div class="meal-cell flex items-center justify-center text-gray-300 dark:text-gray-700 text-xs">—</div>';
          return;
        }
        const cals = Math.round(dish.nutrition.total_calories);
        const goitrogens = JSON.parse(getGoitrogenWarnings(dishId));
        const selenium = JSON.parse(getSeleniumSources(dishId));
        let badges = '';
        if (goitrogens && goitrogens.length > 0)
          badges += '<span title="Crucífera — cocinar bien" class="text-xs">🥦</span>';
        if (selenium && selenium.length > 0)
          badges += '<span title="Rico en selenio" class="text-xs">🌰</span>';

        html += `
          <div class="meal-cell" onclick="App.openRecipeModal(${dishId})">
            <div class="font-semibold text-gray-800 dark:text-gray-100 leading-tight mb-1.5 line-clamp-2">${dish.name}</div>
            <div class="text-amber-500 font-bold text-xs mb-1">👫 ${cals} kcal</div>
            <div class="flex gap-1">${badges}</div>
          </div>`;
      });
    });

    grid.innerHTML = html;
    this.renderDayTotals();
  },

  renderDayTotals() {
    const container = document.getElementById('day-totals');
    const days = this.state.mealPlan.days;
    container.innerHTML = days.map((day, i) => {
      const nutrition = JSON.parse(getDayNutrition(i, 'ambos'));
      const maxP = 200, maxC = 350, maxF = 120;
      return `
        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-center shadow-sm animate-slide-up" style="animation-delay:${i*70}ms">
          <div class="text-xs font-bold text-fit-600 dark:text-fit-400 mb-1">${day.day_name}</div>
          <div class="text-2xl font-extrabold text-gray-800 dark:text-gray-100">${Math.round(nutrition.total_calories)}</div>
          <div class="text-xs text-gray-400 dark:text-gray-500 mb-3">kcal / pareja</div>
          <div class="space-y-1.5">
            ${this.renderBar('P', nutrition.total_protein_g, maxP, 'bg-orange-400')}
            ${this.renderBar('C', nutrition.total_carbs_g, maxC, 'bg-amber-400')}
            ${this.renderBar('G', nutrition.total_fat_g, maxF, 'bg-emerald-400')}
          </div>
        </div>`;
    }).join('');
  },

  renderBar(label, value, max, colorClass) {
    const pct = Math.min(100, (value / max) * 100);
    return `
      <div class="flex items-center gap-2 text-xs">
        <span class="text-gray-400 dark:text-gray-500 w-3 font-medium">${label}</span>
        <div class="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div class="bar-fill h-full ${colorClass} rounded-full" style="width:${pct}%"></div>
        </div>
        <span class="text-gray-500 dark:text-gray-400 w-7 text-right">${value.toFixed(0)}g</span>
      </div>`;
  },

  // ══════════════════════════════════════════════════════════════════════
  // RECETAS
  // ══════════════════════════════════════════════════════════════════════
  renderRecipes() {
    const filterBar = document.getElementById('recipe-filter-bar');
    filterBar.innerHTML = [
      { key: 'all',      label: 'Todas' },
      { key: 'desayuno', label: '🌅 Desayunos' },
      { key: 'almuerzo', label: '☀️ Almuerzos' },
      { key: 'cena',     label: '🌙 Cenas' },
    ].map(f => `
      <button class="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
        ${f.key === 'all' ? 'bg-fit-600 text-white border-fit-600' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-fit-400 hover:text-fit-600'}"
        data-meal="${f.key}" onclick="App.filterRecipes('${f.key}')">${f.label}</button>
    `).join('');
    this.renderRecipeCards();
  },

  renderRecipeCards() {
    const grid = document.getElementById('recipe-grid');
    const mealColors = { desayuno: 'text-amber-500', almuerzo: 'text-fit-600', cena: 'text-purple-500' };
    let filtered = this.state.dishes;
    if (this.state.activeMealFilter !== 'all') {
      filtered = filtered.filter(d => d.meal_type === this.state.activeMealFilter);
    }

    grid.innerHTML = filtered.map((dish, i) => {
      const cals = Math.round(dish.nutrition.total_calories);
      const mealEmoji = { desayuno: '🌅', almuerzo: '☀️', cena: '🌙' }[dish.meal_type] || '🍽️';
      const mealLabel = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena' }[dish.meal_type] || dish.meal_type;
      return `
        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm
                    hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group animate-slide-up"
             style="animation-delay:${i*50}ms"
             onclick="App.openRecipeModal(${dish.id})">
          <div class="flex items-start justify-between gap-3 mb-3">
            <h3 class="font-bold text-gray-800 dark:text-gray-100 leading-tight group-hover:text-fit-700 dark:group-hover:text-fit-400 transition-colors">${dish.name}</h3>
            <span class="shrink-0 text-xs font-semibold ${mealColors[dish.meal_type] || 'text-gray-500'} bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-full">${mealEmoji}</span>
          </div>
          <p class="text-sm text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2 mb-4">${dish.description}</p>
          <div class="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
            <span class="text-xs text-gray-400 dark:text-gray-500">⏱ ${dish.prep_time_mins} min</span>
            <span class="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">👫 ${cals} kcal</span>
          </div>
        </div>`;
    }).join('');
  },

  filterRecipes(mealType) {
    this.state.activeMealFilter = mealType;
    document.querySelectorAll('#recipe-filter-bar .filter-btn').forEach(btn => {
      const isActive = btn.dataset.meal === mealType;
      btn.className = `filter-btn px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
        isActive
          ? 'bg-fit-600 text-white border-fit-600'
          : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-fit-400 hover:text-fit-600'
      }`;
    });
    this.renderRecipeCards();
  },

  // ══════════════════════════════════════════════════════════════════════
  // MODAL DE RECETA
  // ══════════════════════════════════════════════════════════════════════
  openRecipeModal(dishId) {
    let coupleDetails;
    try {
      coupleDetails = JSON.parse(getCoupleDishDetails(dishId));
    } catch (e) { console.error(e); return; }

    const dish = coupleDetails;
    const nutM = dish.nutrition_woman;
    const nutH = dish.nutrition_man;
    const totalCals = Math.round(nutM.total_calories + nutH.total_calories);
    const goitrogens = JSON.parse(getGoitrogenWarnings(dishId));
    const selenium = JSON.parse(getSeleniumSources(dishId));
    const mealEmoji = { desayuno: '🌅', almuerzo: '☀️', cena: '🌙' }[dish.meal_type] || '🍽️';

    let alertsHtml = '';
    if (goitrogens && goitrogens.length > 0) {
      alertsHtml += `
        <div class="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl mb-4 text-sm">
          <span class="text-lg shrink-0">🥦</span>
          <div class="text-amber-800 dark:text-amber-300">
            <strong>Contiene crucíferas:</strong> ${goitrogens.join(', ')}.<br>
            <em class="text-amber-600 dark:text-amber-400 text-xs">Cocinarlas al vapor o salteadas para reducir el efecto bociógeno.</em>
          </div>
        </div>`;
    }
    if (selenium && selenium.length > 0) {
      alertsHtml += `
        <div class="flex items-start gap-3 p-4 bg-fit-50 dark:bg-fit-900/20 border border-fit-200 dark:border-fit-800/50 rounded-xl mb-4 text-sm">
          <span class="text-lg shrink-0">🌰</span>
          <div class="text-fit-800 dark:text-fit-300">
            <strong>Rico en Selenio:</strong> ${selenium.join(', ')}.<br>
            <em class="text-fit-600 dark:text-fit-400 text-xs">El selenio ayuda a la función tiroidea (conversión T4 → T3).</em>
          </div>
        </div>`;
    }

    const ingredientsRows = dish.ingredients_couple.map(item => {
      const ing = this.state.ingredients.find(ig => ig.id === item.ingredient_id);
      const totalKitchen = this.formatKitchenQty(item.total_qty_g, ing);
      return `
        <tr class="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          <td class="py-2.5 px-3 font-medium text-gray-700 dark:text-gray-300 text-sm">${item.ingredient_name}</td>
          <td class="py-2.5 px-3 font-bold text-fit-700 dark:text-fit-400 text-sm">${totalKitchen}</td>
          <td class="py-2.5 px-3 text-gray-400 dark:text-gray-600 text-xs">${Math.round(item.total_qty_g)}g</td>
        </tr>`;
    }).join('');

    document.getElementById('modal-content').innerHTML = `
      <div class="flex flex-wrap gap-2 mb-3">
        <span class="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full">${mealEmoji} ${dish.meal_type}</span>
        <span class="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full">⏱ ${dish.prep_time_mins} min</span>
        <span class="text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full">👫 ${totalCals} kcal</span>
      </div>
      <h2 class="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 leading-tight pr-8">${dish.name}</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">${dish.description}</p>

      ${alertsHtml}

      <!-- Ingredientes -->
      <div class="mb-5">
        <h4 class="text-xs font-bold text-fit-700 dark:text-fit-400 uppercase tracking-wider mb-2">🥗 Ingredientes — Medidas Fáciles</h4>
        <p class="text-xs text-gray-400 dark:text-gray-500 mb-3">Cantidades <strong>totales para cocinar para los dos</strong>. Usa tazas, cucharas y manos.</p>
        <div class="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
          <table class="w-full text-sm">
            <thead class="bg-fit-50 dark:bg-fit-900/20">
              <tr>
                <th class="text-left px-3 py-2 text-xs font-semibold text-fit-700 dark:text-fit-400">Ingrediente</th>
                <th class="text-left px-3 py-2 text-xs font-semibold text-fit-700 dark:text-fit-400">📏 Medida</th>
                <th class="text-left px-3 py-2 text-xs font-semibold text-fit-700 dark:text-fit-400">Ref.</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900">${ingredientsRows}</tbody>
          </table>
        </div>
      </div>

      <!-- Nutrición por persona -->
      <div class="mb-5">
        <h4 class="text-xs font-bold text-fit-700 dark:text-fit-400 uppercase tracking-wider mb-3">📊 Nutrición por persona</h4>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-pink-50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/30 rounded-xl p-4">
            <div class="text-xs font-bold text-pink-600 dark:text-pink-400 mb-1">🩷 Tu plato</div>
            <div class="text-xl font-extrabold text-gray-800 dark:text-gray-100">${Math.round(nutM.total_calories)} kcal</div>
            <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">P: ${nutM.total_protein_g.toFixed(0)}g · C: ${nutM.total_carbs_g.toFixed(0)}g · G: ${nutM.total_fat_g.toFixed(0)}g</div>
          </div>
          <div class="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4">
            <div class="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">💙 Plato de él</div>
            <div class="text-xl font-extrabold text-gray-800 dark:text-gray-100">${Math.round(nutH.total_calories)} kcal</div>
            <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">P: ${nutH.total_protein_g.toFixed(0)}g · C: ${nutH.total_carbs_g.toFixed(0)}g · G: ${nutH.total_fat_g.toFixed(0)}g</div>
          </div>
        </div>
      </div>

      <!-- Instrucciones -->
      <div>
        <h4 class="text-xs font-bold text-fit-700 dark:text-fit-400 uppercase tracking-wider mb-2">👩‍🍳 Preparación</h4>
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">${dish.instructions}</div>
      </div>
    `;

    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('recipe-modal');
    overlay.classList.remove('opacity-0', 'invisible');
    overlay.classList.add('opacity-100', 'visible');
    modal.classList.remove('scale-95');
    modal.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('recipe-modal');
    overlay.classList.remove('opacity-100', 'visible');
    overlay.classList.add('opacity-0', 'invisible');
    modal.classList.remove('scale-100');
    modal.classList.add('scale-95');
    document.body.style.overflow = '';
  },

  // ══════════════════════════════════════════════════════════════════════
  // INGREDIENTES
  // ══════════════════════════════════════════════════════════════════════
  renderIngredients() {
    const filterBar = document.getElementById('ingredient-filter-bar');
    const categories = [
      { key: 'all',          label: 'Todos' },
      { key: 'verdura',      label: '🥬 Verduras' },
      { key: 'fruta',        label: '🍓 Frutas' },
      { key: 'proteina',     label: '🍗 Proteínas' },
      { key: 'grano',        label: '🌾 Granos' },
      { key: 'especia',      label: '🧂 Especias' },
      { key: 'grasa_semilla',label: '🥑 Grasas' },
      { key: 'lacteo',       label: '🥛 Lácteos' },
    ];
    filterBar.innerHTML = categories.map(c => `
      <button class="filter-btn px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
        ${c.key === 'all' ? 'bg-fit-600 text-white border-fit-600' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-fit-400 hover:text-fit-600'}"
        data-cat="${c.key}" onclick="App.filterIngredients('${c.key}')">${c.label}</button>
    `).join('');
    this.renderIngredientTable();
  },

  renderIngredientTable() {
    const tbody = document.getElementById('ingredient-tbody');
    let filtered = this.state.ingredients;
    if (this.state.activeFilter !== 'all') {
      filtered = filtered.filter(i => i.category === this.state.activeFilter);
    }

    const catColors = {
      verdura:      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      fruta:        'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
      proteina:     'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      grano:        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      especia:      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      grasa_semilla:'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400',
      lacteo:       'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
    };

    tbody.innerHTML = filtered.map(ing => {
      const kitchenRef = ing.kitchen_unit ? `1 ${ing.kitchen_unit} = ${ing.kitchen_unit_g}g` : '—';
      const catLabel = { verdura:'🥬 Verdura', fruta:'🍓 Fruta', proteina:'🍗 Proteína', grano:'🌾 Grano', especia:'🧂 Especia', grasa_semilla:'🥑 Grasa', lacteo:'🥛 Lácteo' }[ing.category] || ing.category;
      let alerts = '';
      if (ing.is_goitrogen) alerts += '<span class="inline-flex items-center text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full mr-1">🥦 Bociógeno</span>';
      if (ing.selenium_rich) alerts += '<span class="inline-flex items-center text-xs font-medium bg-fit-100 dark:bg-fit-900/30 text-fit-700 dark:text-fit-400 px-2 py-0.5 rounded-full">🌰 Selenio</span>';

      return `
        <tr>
          <td class="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 text-sm">${ing.name}</td>
          <td class="px-4 py-3 text-fit-700 dark:text-fit-400 font-medium text-sm">${kitchenRef}</td>
          <td class="px-4 py-3"><span class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${catColors[ing.category] || 'bg-gray-100 text-gray-600'}">${catLabel}</span></td>
          <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">${ing.calories_per_100g}</td>
          <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">${ing.protein_g}g</td>
          <td class="px-4 py-3">${alerts || '<span class="text-gray-300 dark:text-gray-700 text-xs">—</span>'}</td>
        </tr>`;
    }).join('');
  },

  filterIngredients(category) {
    this.state.activeFilter = category;
    document.querySelectorAll('#ingredient-filter-bar .filter-btn').forEach(btn => {
      const isActive = btn.dataset.cat === category;
      btn.className = `filter-btn px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
        isActive
          ? 'bg-fit-600 text-white border-fit-600'
          : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-fit-400 hover:text-fit-600'
      }`;
    });
    this.renderIngredientTable();
  },

  // ══════════════════════════════════════════════════════════════════════
  // LISTA DE COMPRAS
  // ══════════════════════════════════════════════════════════════════════
  renderShoppingList() {
    const container = document.getElementById('shopping-list');
    const items = this.state.shoppingList;

    const grouped = {};
    items.forEach(item => {
      const cat = item.category_label || item.category || 'Otros';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    const catEmojis = {
      'Verduras': '🥬', 'Frutas': '🍓', 'Proteínas': '🍗',
      'Granos': '🌾', 'Especias': '🧂', 'Grasas/Semillas': '🥑',
      'Lácteos': '🥛', 'Otros': '📦',
    };

    let html = '';
    Object.keys(grouped).sort().forEach(catLabel => {
      const emoji = catEmojis[catLabel] || '🛒';
      html += `
        <div class="mb-6 animate-slide-up">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-lg">${emoji}</span>
            <h3 class="font-bold text-gray-700 dark:text-gray-300 text-sm">${catLabel}</h3>
            <div class="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
            <span class="text-xs text-gray-400 dark:text-gray-600">${grouped[catLabel].length} items</span>
          </div>
          <div class="space-y-2">
            ${grouped[catLabel].map(item => {
              const ing = this.state.ingredients.find(ig => ig.name === item.ingredient_name);
              const kitchenQty = this.formatKitchenQty(item.total_quantity_g, ing);
              const gramRef = item.total_quantity_g >= 1000
                ? `${(item.total_quantity_g / 1000).toFixed(1)} kg`
                : `${Math.round(item.total_quantity_g)}g`;
              return `
                <div class="shopping-row flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-fit-200 dark:hover:border-fit-800 transition-all duration-150">
                  <input type="checkbox" class="shopping-check w-5 h-5 border-2 border-gray-200 dark:border-gray-700 rounded-md flex-shrink-0"
                    onchange="App.toggleShoppingItem(this)" aria-label="Marcar ${item.ingredient_name}">
                  <span class="item-name flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">${item.ingredient_name}</span>
                  <span class="text-sm font-bold text-fit-700 dark:text-fit-400">${kitchenQty}</span>
                  <span class="text-xs text-gray-400 dark:text-gray-600">(${gramRef})</span>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    });

    container.innerHTML = html;
  },

  toggleShoppingItem(checkbox) {
    const row = checkbox.closest('.shopping-row');
    row.classList.toggle('item-checked', checkbox.checked);
  },

  // ── Toast ────────────────────────────────────────────────────────────
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const colors = {
      success: 'bg-fit-600 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
    };
    toast.className = `${colors[type] || colors.success} px-4 py-3 rounded-xl text-sm font-medium shadow-lg toast-enter flex items-center gap-2`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease-in forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
