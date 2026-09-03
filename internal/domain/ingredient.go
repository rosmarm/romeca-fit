package domain

// Ingredient representa un ingrediente con su información nutricional por cada 100g
// y su equivalencia en medidas caseras de cocina.
type Ingredient struct {
	ID             int     `json:"id"`
	Name           string  `json:"name"`
	Category       string  `json:"category"`
	CaloriesPer100 float64 `json:"calories_per_100g"`
	ProteinG       float64 `json:"protein_g"`
	CarbsG         float64 `json:"carbs_g"`
	FatG           float64 `json:"fat_g"`
	IsGoitrogen    bool    `json:"is_goitrogen"`
	SeleniumRich   bool    `json:"selenium_rich"`
	Notes          string  `json:"notes"`
	// ── Medidas Caseras ──
	KitchenUnit  string  `json:"kitchen_unit"`   // nombre de la unidad casera: "taza", "unidad", "cucharada", etc.
	KitchenUnitG float64 `json:"kitchen_unit_g"` // cuántos gramos equivale 1 unidad casera
}

// Categorías de ingredientes.
const (
	CatVerdura  = "verdura"
	CatFruta    = "fruta"
	CatProteina = "proteina"
	CatGrano    = "grano"
	CatEspecia  = "especia"
	CatGrasa    = "grasa_semilla"
	CatLacteo   = "lacteo"
)

// CategoryLabels devuelve las etiquetas en español para cada categoría.
var CategoryLabels = map[string]string{
	CatVerdura:  "🥬 Verdura",
	CatFruta:    "🍓 Fruta",
	CatProteina: "🍗 Proteína",
	CatGrano:    "🌾 Grano / Legumbre",
	CatEspecia:  "🧂 Especia / Condimento",
	CatGrasa:    "🥑 Grasa Saludable / Semilla",
	CatLacteo:   "🥛 Lácteo / Alternativa",
}

// GetDefaultIngredients devuelve la base de datos completa de ingredientes
// con valores nutricionales reales por cada 100g y medidas caseras.
func GetDefaultIngredients() []Ingredient {
	return []Ingredient{
		// ── Verduras ──────────────────────────────────────────────
		{ID: 1, Name: "Espinaca", Category: CatVerdura, CaloriesPer100: 23, ProteinG: 2.9, CarbsG: 3.6, FatG: 0.4, IsGoitrogen: true, Notes: "Cocinar al vapor o salteada para reducir bociógenos", KitchenUnit: "taza", KitchenUnitG: 30},
		{ID: 2, Name: "Brócoli", Category: CatVerdura, CaloriesPer100: 34, ProteinG: 2.8, CarbsG: 7.0, FatG: 0.4, IsGoitrogen: true, Notes: "Cocinar al vapor o salteado para reducir bociógenos", KitchenUnit: "taza de floretes", KitchenUnitG: 90},
		{ID: 3, Name: "Calabacín", Category: CatVerdura, CaloriesPer100: 17, ProteinG: 1.2, CarbsG: 3.1, FatG: 0.3, KitchenUnit: "unidad mediana", KitchenUnitG: 200},
		{ID: 4, Name: "Zanahoria", Category: CatVerdura, CaloriesPer100: 41, ProteinG: 0.9, CarbsG: 9.6, FatG: 0.2, KitchenUnit: "unidad mediana", KitchenUnitG: 80},
		{ID: 5, Name: "Tomate", Category: CatVerdura, CaloriesPer100: 18, ProteinG: 0.9, CarbsG: 3.9, FatG: 0.2, KitchenUnit: "unidad mediana", KitchenUnitG: 150},
		{ID: 6, Name: "Pepino", Category: CatVerdura, CaloriesPer100: 15, ProteinG: 0.7, CarbsG: 3.6, FatG: 0.1, KitchenUnit: "unidad", KitchenUnitG: 300},
		{ID: 7, Name: "Pimiento Rojo", Category: CatVerdura, CaloriesPer100: 31, ProteinG: 1.0, CarbsG: 6.0, FatG: 0.3, KitchenUnit: "unidad", KitchenUnitG: 150},
		{ID: 8, Name: "Espárragos", Category: CatVerdura, CaloriesPer100: 20, ProteinG: 2.2, CarbsG: 3.9, FatG: 0.1, KitchenUnit: "tallo", KitchenUnitG: 16},
		{ID: 9, Name: "Champiñones", Category: CatVerdura, CaloriesPer100: 22, ProteinG: 3.1, CarbsG: 3.3, FatG: 0.3, KitchenUnit: "taza rebanados", KitchenUnitG: 70},
		{ID: 10, Name: "Repollo Morado", Category: CatVerdura, CaloriesPer100: 31, ProteinG: 1.4, CarbsG: 7.4, FatG: 0.2, IsGoitrogen: true, Notes: "Cocinar bien para reducir bociógenos", KitchenUnit: "taza picado", KitchenUnitG: 90},
		{ID: 11, Name: "Rúcula", Category: CatVerdura, CaloriesPer100: 25, ProteinG: 2.6, CarbsG: 3.7, FatG: 0.7, KitchenUnit: "taza", KitchenUnitG: 20},
		{ID: 12, Name: "Calabaza", Category: CatVerdura, CaloriesPer100: 26, ProteinG: 1.0, CarbsG: 6.5, FatG: 0.1, KitchenUnit: "taza en cubos", KitchenUnitG: 130},
		{ID: 13, Name: "Cebolla", Category: CatVerdura, CaloriesPer100: 40, ProteinG: 1.1, CarbsG: 9.3, FatG: 0.1, KitchenUnit: "unidad mediana", KitchenUnitG: 110},
		{ID: 14, Name: "Camote / Batata", Category: CatVerdura, CaloriesPer100: 86, ProteinG: 1.6, CarbsG: 20.1, FatG: 0.1, KitchenUnit: "unidad mediana", KitchenUnitG: 130},
		// ── Frutas ────────────────────────────────────────────────
		{ID: 15, Name: "Arándanos", Category: CatFruta, CaloriesPer100: 57, ProteinG: 0.7, CarbsG: 14.5, FatG: 0.3, KitchenUnit: "puñado", KitchenUnitG: 40},
		{ID: 16, Name: "Fresas", Category: CatFruta, CaloriesPer100: 32, ProteinG: 0.7, CarbsG: 7.7, FatG: 0.3, KitchenUnit: "unidad grande", KitchenUnitG: 25},
		{ID: 17, Name: "Manzana Verde", Category: CatFruta, CaloriesPer100: 52, ProteinG: 0.3, CarbsG: 13.8, FatG: 0.2, KitchenUnit: "unidad", KitchenUnitG: 180},
		{ID: 18, Name: "Banano", Category: CatFruta, CaloriesPer100: 89, ProteinG: 1.1, CarbsG: 22.8, FatG: 0.3, KitchenUnit: "unidad", KitchenUnitG: 120},
		{ID: 19, Name: "Aguacate", Category: CatFruta, CaloriesPer100: 160, ProteinG: 2.0, CarbsG: 8.5, FatG: 14.7, KitchenUnit: "unidad", KitchenUnitG: 150},
		{ID: 20, Name: "Limón", Category: CatFruta, CaloriesPer100: 29, ProteinG: 1.1, CarbsG: 9.3, FatG: 0.3, KitchenUnit: "unidad", KitchenUnitG: 50},
		// ── Proteínas ─────────────────────────────────────────────
		{ID: 21, Name: "Pechuga de Pollo", Category: CatProteina, CaloriesPer100: 165, ProteinG: 31.0, CarbsG: 0, FatG: 3.6, KitchenUnit: "pechuga", KitchenUnitG: 200},
		{ID: 22, Name: "Pechuga de Pavo", Category: CatProteina, CaloriesPer100: 135, ProteinG: 30.0, CarbsG: 0, FatG: 1.0, KitchenUnit: "pechuga", KitchenUnitG: 200},
		{ID: 23, Name: "Salmón", Category: CatProteina, CaloriesPer100: 208, ProteinG: 20.0, CarbsG: 0, FatG: 13.0, SeleniumRich: true, Notes: "Excelente fuente de selenio y omega-3", KitchenUnit: "filete", KitchenUnitG: 170},
		{ID: 24, Name: "Merluza", Category: CatProteina, CaloriesPer100: 90, ProteinG: 18.0, CarbsG: 0, FatG: 1.3, KitchenUnit: "filete", KitchenUnitG: 170},
		{ID: 25, Name: "Atún", Category: CatProteina, CaloriesPer100: 130, ProteinG: 29.0, CarbsG: 0, FatG: 1.0, SeleniumRich: true, Notes: "Rico en selenio", KitchenUnit: "lata", KitchenUnitG: 170},
		{ID: 26, Name: "Huevo", Category: CatProteina, CaloriesPer100: 155, ProteinG: 13.0, CarbsG: 1.1, FatG: 11.0, SeleniumRich: true, Notes: "Fuente de selenio y colina", KitchenUnit: "unidad", KitchenUnitG: 55},
		{ID: 27, Name: "Tilapia", Category: CatProteina, CaloriesPer100: 96, ProteinG: 20.1, CarbsG: 0, FatG: 1.7, Notes: "Pescado blanco suave, alto en proteína", KitchenUnit: "filete", KitchenUnitG: 170},
		{ID: 28, Name: "Camarones", Category: CatProteina, CaloriesPer100: 99, ProteinG: 24.0, CarbsG: 0.2, FatG: 0.3, SeleniumRich: true, Notes: "Rico en selenio y yodo", KitchenUnit: "taza", KitchenUnitG: 150},
		// ── Granos y Legumbres ────────────────────────────────────
		{ID: 29, Name: "Avena", Category: CatGrano, CaloriesPer100: 389, ProteinG: 16.9, CarbsG: 66.3, FatG: 6.9, KitchenUnit: "taza", KitchenUnitG: 80},
		{ID: 30, Name: "Quinua", Category: CatGrano, CaloriesPer100: 120, ProteinG: 4.4, CarbsG: 21.3, FatG: 1.9, Notes: "Valores para quinua cocida", KitchenUnit: "taza cocida", KitchenUnitG: 185},
		{ID: 31, Name: "Arroz Integral", Category: CatGrano, CaloriesPer100: 123, ProteinG: 2.7, CarbsG: 25.6, FatG: 1.0, Notes: "Valores para arroz cocido", KitchenUnit: "taza cocido", KitchenUnitG: 195},
		{ID: 32, Name: "Lentejas", Category: CatGrano, CaloriesPer100: 116, ProteinG: 9.0, CarbsG: 20.1, FatG: 0.4, Notes: "Valores para lentejas cocidas", KitchenUnit: "taza cocidas", KitchenUnitG: 200},
		{ID: 33, Name: "Garbanzos", Category: CatGrano, CaloriesPer100: 164, ProteinG: 8.9, CarbsG: 27.4, FatG: 2.6, Notes: "Valores para garbanzos cocidos", KitchenUnit: "taza cocidos", KitchenUnitG: 164},
		// ── Especias y Condimentos ────────────────────────────────
		{ID: 34, Name: "Canela", Category: CatEspecia, CaloriesPer100: 247, ProteinG: 4.0, CarbsG: 80.6, FatG: 1.2, Notes: "Ayuda a regular azúcar en sangre", KitchenUnit: "cucharadita", KitchenUnitG: 3},
		{ID: 35, Name: "Cúrcuma", Category: CatEspecia, CaloriesPer100: 354, ProteinG: 8.0, CarbsG: 64.9, FatG: 10.0, Notes: "Antiinflamatorio natural", KitchenUnit: "cucharadita", KitchenUnitG: 3},
		{ID: 36, Name: "Jengibre", Category: CatEspecia, CaloriesPer100: 80, ProteinG: 1.8, CarbsG: 17.8, FatG: 0.8, KitchenUnit: "cucharadita rallado", KitchenUnitG: 5},
		{ID: 37, Name: "Pimienta Negra", Category: CatEspecia, CaloriesPer100: 251, ProteinG: 10.4, CarbsG: 38.7, FatG: 3.3, Notes: "Mejora absorción de cúrcuma", KitchenUnit: "pizca", KitchenUnitG: 1},
		{ID: 38, Name: "Orégano Seco", Category: CatEspecia, CaloriesPer100: 265, ProteinG: 9.0, CarbsG: 68.9, FatG: 4.3, KitchenUnit: "cucharadita", KitchenUnitG: 2},
		{ID: 39, Name: "Ajo", Category: CatEspecia, CaloriesPer100: 149, ProteinG: 6.4, CarbsG: 33.1, FatG: 0.5, KitchenUnit: "diente", KitchenUnitG: 5},
		// ── Grasas Saludables y Semillas ──────────────────────────
		{ID: 40, Name: "Aceite de Oliva Extra Virgen", Category: CatGrasa, CaloriesPer100: 884, ProteinG: 0, CarbsG: 0, FatG: 100.0, Notes: "Grasa monoinsaturada saludable", KitchenUnit: "cucharada", KitchenUnitG: 14},
		{ID: 41, Name: "Nuez de Brasil", Category: CatGrasa, CaloriesPer100: 659, ProteinG: 14.3, CarbsG: 11.7, FatG: 67.1, SeleniumRich: true, Notes: "1-2 nueces al día cubren el 100% del selenio diario", KitchenUnit: "nuez", KitchenUnitG: 5},
		{ID: 42, Name: "Semillas de Chía", Category: CatGrasa, CaloriesPer100: 486, ProteinG: 17.0, CarbsG: 42.1, FatG: 30.7, Notes: "Ricas en omega-3 y fibra", KitchenUnit: "cucharada", KitchenUnitG: 10},
		{ID: 43, Name: "Semillas de Calabaza", Category: CatGrasa, CaloriesPer100: 559, ProteinG: 30.0, CarbsG: 10.7, FatG: 49.1, Notes: "Ricas en zinc y magnesio", KitchenUnit: "cucharada", KitchenUnitG: 10},
		{ID: 44, Name: "Semillas de Girasol", Category: CatGrasa, CaloriesPer100: 584, ProteinG: 20.8, CarbsG: 20.0, FatG: 51.5, SeleniumRich: true, Notes: "Buena fuente de selenio y vitamina E", KitchenUnit: "cucharada", KitchenUnitG: 10},
		{ID: 45, Name: "Aceitunas", Category: CatGrasa, CaloriesPer100: 115, ProteinG: 0.8, CarbsG: 6.3, FatG: 10.7, KitchenUnit: "unidad", KitchenUnitG: 4},
		// ── Lácteos y Alternativas ────────────────────────────────
		{ID: 46, Name: "Yogur Griego Natural", Category: CatLacteo, CaloriesPer100: 59, ProteinG: 10.0, CarbsG: 3.6, FatG: 0.7, Notes: "Sin azúcar añadida", KitchenUnit: "taza", KitchenUnitG: 245},
	}
}
