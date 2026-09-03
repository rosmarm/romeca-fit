/* ═══════════════════════════════════════════════════════════════════════
   RECETARIO FIT 🌿 — Menú Saludable en Pareja
   Con medidas fáciles de cocina (tazas, cucharadas, unidades, filetes)
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
    document.documentElement.setAttribute('data-theme', this.state.theme);
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
        ls.classList.add('hidden');
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
  // Convierte gramos a medida casera legible
  formatKitchenQty(quantityG, ingredient) {
    if (!ingredient || !ingredient.kitchen_unit_g || ingredient.kitchen_unit_g <= 0) {
      return `${Math.round(quantityG)}g`;
    }

    const units = quantityG / ingredient.kitchen_unit_g;
    const fractionStr = this.formatFraction(units);
    const unitName = ingredient.kitchen_unit || 'porción';

    // Pluralizar unidades simples
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

  // Convierte número decimal a fracción legible
  formatFraction(n) {
    if (n <= 0) return '0';

    const whole = Math.floor(n);
    const frac = n - whole;

    // Fracciones comunes
    const fractions = [
      { val: 0,    str: '' },
      { val: 0.125, str: '⅛' },
      { val: 0.20, str: '⅕' },
      { val: 0.25, str: '¼' },
      { val: 0.33, str: '⅓' },
      { val: 0.50, str: '½' },
      { val: 0.67, str: '⅔' },
      { val: 0.75, str: '¾' },
    ];

    // Encontrar la fracción más cercana
    let closest = fractions[0];
    let minDiff = Infinity;
    for (const f of fractions) {
      const diff = Math.abs(frac - f.val);
      if (diff < minDiff) {
        minDiff = diff;
        closest = f;
      }
    }

    if (whole === 0 && closest.str === '') return '~1';
    if (whole === 0) return closest.str;
    if (closest.str === '') return `${whole}`;
    return `${whole}${closest.str}`;
  },

  // Formato para lista de compras (medida casera + gramos de referencia)
  formatShoppingQty(quantityG, ingredient) {
    const kitchenQty = this.formatKitchenQty(quantityG, ingredient);
    if (quantityG >= 1000) {
      return `${kitchenQty} (~${(quantityG / 1000).toFixed(1)} kg)`;
    }
    return `${kitchenQty} (~${Math.round(quantityG)}g)`;
  },

  // ── Tab Navigation ───────────────────────────────────────────────────
  switchTab(tabName) {
    this.state.activeTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.style.display = 'none';
    });
    const activePanel = document.getElementById(`panel-${tabName}`);
    if (activePanel) {
      activePanel.style.display = 'block';
      activePanel.classList.remove('animate-fadeIn');
      void activePanel.offsetWidth;
      activePanel.classList.add('animate-fadeIn');
    }
  },

  // ── Theme ────────────────────────────────────────────────────────────
  toggleTheme() {
    this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.state.theme);
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
      { value: this.state.dishes.length, label: 'Recetas' },
      { value: this.state.ingredients.length, label: 'Ingredientes' },
      { value: this.state.mealPlan ? this.state.mealPlan.days.length : 0, label: 'Días Planificados' },
      { value: this.state.shoppingList.length, label: 'Items de Compra' },
    ];
    container.innerHTML = stats.map(s => `
      <div class="stat-card animate-slideUp">
        <div class="stat-card__value">${s.value}</div>
        <div class="stat-card__label">${s.label}</div>
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
      { key: 'lunch_id', label: '☀️ Almuerzo' },
      { key: 'dinner_id', label: '🌙 Cena' },
    ];

    let html = '<div class="meal-grid__header" style="visibility:hidden;"></div>';
    days.forEach(day => {
      html += `<div class="meal-grid__header">${day.day_name}</div>`;
    });

    mealTypes.forEach(mt => {
      html += `<div class="meal-grid__label">${mt.label}</div>`;
      days.forEach(day => {
        const dishId = day[mt.key];
        const dish = this.state.dishes.find(d => d.id === dishId);
        if (!dish) {
          html += '<div class="meal-grid__cell"><span class="text-muted">—</span></div>';
          return;
        }
        const cals = Math.round(dish.nutrition.total_calories);
        const goitrogens = JSON.parse(getGoitrogenWarnings(dishId));
        const selenium = JSON.parse(getSeleniumSources(dishId));
        let badges = '';
        if (goitrogens && goitrogens.length > 0) badges += '<span class="badge badge--goitrogen" title="Contiene crucíferas - cocinar bien">🥦</span>';
        if (selenium && selenium.length > 0) badges += '<span class="badge badge--selenium" title="Rico en selenio">🌰</span>';

        html += `
          <div class="meal-grid__cell" onclick="App.openRecipeModal(${dishId})">
            <div class="meal-grid__dish-name">${dish.name}</div>
            <div class="meal-grid__dish-cals">${cals} kcal</div>
            <div class="meal-grid__badges">${badges}</div>
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
      return `
        <div class="day-total-card animate-slideUp" style="animation-delay: ${i * 80}ms;">
          <div class="day-total-card__day">${day.day_name}</div>
          <div class="day-total-card__cals">${Math.round(nutrition.total_calories)}</div>
          <div class="day-total-card__unit">kcal / pareja</div>
          <div style="margin-top: var(--sp-3);">
            ${this.renderNutritionBarsSmall(nutrition)}
          </div>
        </div>`;
    }).join('');
  },

  renderNutritionBarsSmall(nutrition) {
    const maxP = 200, maxC = 350, maxF = 120;
    return `
      <div class="nutrition-bars">
        <div class="nutrition-bar">
          <span class="nutrition-bar__label">Proteína</span>
          <div class="nutrition-bar__track"><div class="nutrition-bar__fill nutrition-bar__fill--protein" style="width: ${Math.min(100, (nutrition.total_protein_g / maxP) * 100)}%"></div></div>
          <span class="nutrition-bar__value">${nutrition.total_protein_g.toFixed(0)}g</span>
        </div>
        <div class="nutrition-bar">
          <span class="nutrition-bar__label">Carbos</span>
          <div class="nutrition-bar__track"><div class="nutrition-bar__fill nutrition-bar__fill--carbs" style="width: ${Math.min(100, (nutrition.total_carbs_g / maxC) * 100)}%"></div></div>
          <span class="nutrition-bar__value">${nutrition.total_carbs_g.toFixed(0)}g</span>
        </div>
        <div class="nutrition-bar">
          <span class="nutrition-bar__label">Grasa</span>
          <div class="nutrition-bar__track"><div class="nutrition-bar__fill nutrition-bar__fill--fat" style="width: ${Math.min(100, (nutrition.total_fat_g / maxF) * 100)}%"></div></div>
          <span class="nutrition-bar__value">${nutrition.total_fat_g.toFixed(0)}g</span>
        </div>
      </div>`;
  },

  // ══════════════════════════════════════════════════════════════════════
  // RECETAS
  // ══════════════════════════════════════════════════════════════════════
  renderRecipes() {
    const filterBar = document.getElementById('recipe-filter-bar');
    filterBar.innerHTML = `
      <button class="filter-btn active" data-meal="all" onclick="App.filterRecipes('all')">Todas</button>
      <button class="filter-btn" data-meal="desayuno" onclick="App.filterRecipes('desayuno')">🌅 Desayunos</button>
      <button class="filter-btn" data-meal="almuerzo" onclick="App.filterRecipes('almuerzo')">☀️ Almuerzos</button>
      <button class="filter-btn" data-meal="cena" onclick="App.filterRecipes('cena')">🌙 Cenas</button>
    `;
    this.renderRecipeCards();
  },

  renderRecipeCards() {
    const grid = document.getElementById('recipe-grid');
    let filtered = this.state.dishes;
    if (this.state.activeMealFilter !== 'all') {
      filtered = filtered.filter(d => d.meal_type === this.state.activeMealFilter);
    }

    grid.innerHTML = filtered.map((dish, i) => {
      const cals = Math.round(dish.nutrition.total_calories);
      return `
        <div class="card card--clickable animate-slideUp" style="animation-delay: ${i * 60}ms;" onclick="App.openRecipeModal(${dish.id})">
          <div class="card__header">
            <h3 class="card__title">${dish.name}</h3>
            <span class="badge badge--meal-${dish.meal_type}">${this.getMealLabel(dish.meal_type)}</span>
          </div>
          <p class="card__description">${dish.description}</p>
          <div class="card__footer">
            <div class="card__meta">
              <span>⏱ ${dish.prep_time_mins} min</span>
              <span class="badge badge--calories">👫 ${cals} kcal</span>
            </div>
          </div>
        </div>`;
    }).join('');
  },

  filterRecipes(mealType) {
    this.state.activeMealFilter = mealType;
    document.querySelectorAll('#recipe-filter-bar .filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.meal === mealType);
    });
    this.renderRecipeCards();
  },

  getMealLabel(type) {
    return { desayuno: '🌅', almuerzo: '☀️', cena: '🌙' }[type] || type;
  },

  // ══════════════════════════════════════════════════════════════════════
  // MODAL DE RECETA — Con medidas fáciles de cocina
  // ══════════════════════════════════════════════════════════════════════
  openRecipeModal(dishId) {
    let coupleDetails;
    try {
      coupleDetails = JSON.parse(getCoupleDishDetails(dishId));
    } catch (e) {
      console.error(e);
      return;
    }

    const dish = coupleDetails;
    const nutM = dish.nutrition_woman;
    const nutH = dish.nutrition_man;
    const totalCals = Math.round(nutM.total_calories + nutH.total_calories);
    const goitrogens = JSON.parse(getGoitrogenWarnings(dishId));
    const selenium = JSON.parse(getSeleniumSources(dishId));

    let alertsHtml = '';

    if (goitrogens && goitrogens.length > 0) {
      alertsHtml += `
        <div class="alert-box alert-box--warning">
          <span class="alert-box__icon">🥦</span>
          <div>
            <strong>Contiene crucíferas:</strong> ${goitrogens.join(', ')}.<br>
            <em>Cocinarlas al vapor o salteadas para reducir el efecto bociógeno.</em>
          </div>
        </div>`;
    }
    if (selenium && selenium.length > 0) {
      alertsHtml += `
        <div class="alert-box alert-box--success">
          <span class="alert-box__icon">🌰</span>
          <div>
            <strong>Rico en Selenio:</strong> ${selenium.join(', ')}.<br>
            <em>El selenio ayuda a la función tiroidea (conversión T4 → T3).</em>
          </div>
        </div>`;
    }

    // Tabla de ingredientes con medidas caseras
    const ingredientsRows = dish.ingredients_couple.map(item => {
      const ing = this.state.ingredients.find(ig => ig.id === item.ingredient_id);
      const totalKitchen = this.formatKitchenQty(item.total_qty_g, ing);
      return `
        <tr>
          <td class="fw-medium">${item.ingredient_name}</td>
          <td style="font-size: var(--fs-md); font-weight: var(--fw-bold); color: var(--clr-primary);">
            ${totalKitchen}
          </td>
          <td class="text-muted" style="font-size: var(--fs-xs);">${Math.round(item.total_qty_g)}g</td>
        </tr>`;
    }).join('');

    const content = document.getElementById('modal-content');
    content.innerHTML = `
      <div style="display: flex; gap: var(--sp-2); margin-bottom: var(--sp-3); flex-wrap: wrap;">
        <span class="badge badge--meal-${dish.meal_type}">${this.getMealLabel(dish.meal_type)}</span>
        <span class="badge badge--selenium">⏱ ${dish.prep_time_mins} min</span>
        <span class="badge badge--calories">👫 ${totalCals} kcal total</span>
      </div>
      <h2 class="modal__title">${dish.name}</h2>
      <p class="modal__description">${dish.description}</p>

      ${alertsHtml}

      <div class="modal__section">
        <h4 class="modal__section-title">🥗 Ingredientes — Medidas Fáciles</h4>
        <p style="font-size: var(--fs-xs); color: var(--clr-text-secondary); margin-bottom: var(--sp-3);">
          Estas son las cantidades <strong>totales para cocinar para los dos</strong>. Sin necesidad de pesar — usa tus tazas, cucharas y manos.
        </p>
        <div style="overflow-x: auto;">
          <table class="data-table" style="font-size: var(--fs-sm);">
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>📏 Medida de Cocina</th>
                <th>Referencia</th>
              </tr>
            </thead>
            <tbody>
              ${ingredientsRows}
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal__section">
        <h4 class="modal__section-title">📊 Información Nutricional (por pareja)</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-4);">
          <div style="background: var(--clr-surface-hover); padding: var(--sp-4); border-radius: var(--radius-md);">
            <div style="font-weight: var(--fw-semibold); color: var(--clr-primary); margin-bottom: var(--sp-2);">🩷 Tu plato</div>
            <div style="font-size: var(--fs-lg); font-weight: var(--fw-bold);">${Math.round(nutM.total_calories)} kcal</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-secondary); margin-top: var(--sp-1);">
              P: ${nutM.total_protein_g.toFixed(0)}g · C: ${nutM.total_carbs_g.toFixed(0)}g · G: ${nutM.total_fat_g.toFixed(0)}g
            </div>
          </div>
          <div style="background: var(--clr-surface-hover); padding: var(--sp-4); border-radius: var(--radius-md);">
            <div style="font-weight: var(--fw-semibold); color: var(--clr-accent); margin-bottom: var(--sp-2);">💙 Plato de él</div>
            <div style="font-size: var(--fs-lg); font-weight: var(--fw-bold);">${Math.round(nutH.total_calories)} kcal</div>
            <div style="font-size: var(--fs-xs); color: var(--clr-text-secondary); margin-top: var(--sp-1);">
              P: ${nutH.total_protein_g.toFixed(0)}g · C: ${nutH.total_carbs_g.toFixed(0)}g · G: ${nutH.total_fat_g.toFixed(0)}g
            </div>
          </div>
        </div>
      </div>

      <div class="modal__section">
        <h4 class="modal__section-title">👩‍🍳 Pasos de Preparación</h4>
        <div class="modal__instructions">${dish.instructions}</div>
      </div>
    `;

    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
  },

  // ══════════════════════════════════════════════════════════════════════
  // INGREDIENTES
  // ══════════════════════════════════════════════════════════════════════
  renderIngredients() {
    const filterBar = document.getElementById('ingredient-filter-bar');
    const categories = [
      { key: 'all', label: 'Todos' },
      { key: 'verdura', label: '🥬 Verduras' },
      { key: 'fruta', label: '🍓 Frutas' },
      { key: 'proteina', label: '🍗 Proteínas' },
      { key: 'grano', label: '🌾 Granos' },
      { key: 'especia', label: '🧂 Especias' },
      { key: 'grasa_semilla', label: '🥑 Grasas/Semillas' },
      { key: 'lacteo', label: '🥛 Lácteos' },
    ];
    filterBar.innerHTML = categories.map(c =>
      `<button class="filter-btn ${c.key === 'all' ? 'active' : ''}" data-cat="${c.key}" onclick="App.filterIngredients('${c.key}')">${c.label}</button>`
    ).join('');
    this.renderIngredientTable();
  },

  renderIngredientTable() {
    const tbody = document.getElementById('ingredient-tbody');
    let filtered = this.state.ingredients;
    if (this.state.activeFilter !== 'all') {
      filtered = filtered.filter(i => i.category === this.state.activeFilter);
    }

    tbody.innerHTML = filtered.map(ing => {
      let alertBadges = '';
      if (ing.is_goitrogen) alertBadges += '<span class="badge badge--goitrogen">🥦 Bociógeno</span> ';
      if (ing.selenium_rich) alertBadges += '<span class="badge badge--selenium">🌰 Selenio</span>';

      const kitchenRef = ing.kitchen_unit
        ? `1 ${ing.kitchen_unit} = ${ing.kitchen_unit_g}g`
        : '—';

      return `
        <tr>
          <td class="fw-medium">${ing.name}</td>
          <td style="color: var(--clr-primary); font-weight: var(--fw-medium);">${kitchenRef}</td>
          <td><span class="badge badge--${ing.category}">${this.getCategoryLabel(ing.category)}</span></td>
          <td>${ing.calories_per_100g}</td>
          <td>${ing.protein_g}g</td>
          <td>${alertBadges || '<span class="text-muted">—</span>'}</td>
        </tr>`;
    }).join('');
  },

  filterIngredients(category) {
    this.state.activeFilter = category;
    document.querySelectorAll('#ingredient-filter-bar .filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === category);
    });
    this.renderIngredientTable();
  },

  getCategoryLabel(cat) {
    return {
      verdura: '🥬 Verdura', fruta: '🍓 Fruta', proteina: '🍗 Proteína',
      grano: '🌾 Grano', especia: '🧂 Especia', grasa_semilla: '🥑 Grasa/Semilla', lacteo: '🥛 Lácteo',
    }[cat] || cat;
  },

  // ══════════════════════════════════════════════════════════════════════
  // LISTA DE COMPRAS — Con medidas caseras
  // ══════════════════════════════════════════════════════════════════════
  renderShoppingList() {
    const container = document.getElementById('shopping-list');
    const items = this.state.shoppingList;

    // Agrupar por categoría
    const grouped = {};
    items.forEach(item => {
      const cat = item.category_label || item.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    let html = '';
    Object.keys(grouped).sort().forEach(catLabel => {
      html += `
        <div class="shopping-category animate-slideUp">
          <h3 class="shopping-category__title">${catLabel}</h3>
          ${grouped[catLabel].map((item, i) => {
            const ing = this.state.ingredients.find(ig => ig.name === item.ingredient_name);
            const kitchenQty = this.formatKitchenQty(item.total_quantity_g, ing);
            const gramRef = item.total_quantity_g >= 1000
              ? `${(item.total_quantity_g / 1000).toFixed(1)} kg`
              : `${Math.round(item.total_quantity_g)}g`;

            return `
            <div class="shopping-item">
              <input type="checkbox" class="shopping-item__checkbox"
                     onchange="App.toggleShoppingItem(this)"
                     aria-label="Marcar ${item.ingredient_name}">
              <span class="shopping-item__name">${item.ingredient_name}</span>
              <span class="shopping-item__qty">
                <strong>${kitchenQty}</strong>
                <span class="text-muted" style="font-size: var(--fs-xs); margin-left: var(--sp-1);">(${gramRef})</span>
              </span>
            </div>`;
          }).join('')}
        </div>`;
    });

    container.innerHTML = html;
  },

  toggleShoppingItem(checkbox) {
    const item = checkbox.closest('.shopping-item');
    item.classList.toggle('checked', checkbox.checked);
  },

  // ── Toast ────────────────────────────────────────────────────────────
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
