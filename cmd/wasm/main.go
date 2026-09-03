//go:build js && wasm

package main

import (
	"encoding/json"
	"syscall/js"

	"github.com/recetario-fit/internal/domain"
	"github.com/recetario-fit/internal/service"
)

var (
	ingredients     []domain.Ingredient
	dishes          []domain.Dish
	mealPlan        domain.MealPlan
	calculator      *service.NutritionCalculator
	planner         *service.PlannerService
	dishIndex       map[int]domain.Dish
	ingredientIndex map[int]domain.Ingredient
	profiles        []domain.PortionProfile
)

func init() {
	ingredients = domain.GetDefaultIngredients()
	dishes = domain.GetDefaultDishes()
	mealPlan = domain.GetDefaultMealPlan()
	calculator = service.NewNutritionCalculator(ingredients)
	planner = service.NewPlannerService(ingredients, dishes)
	profiles = domain.GetPortionProfiles()

	dishIndex = make(map[int]domain.Dish, len(dishes))
	for _, d := range dishes {
		dishIndex[d.ID] = d
	}

	ingredientIndex = make(map[int]domain.Ingredient, len(ingredients))
	for _, ing := range ingredients {
		ingredientIndex[ing.ID] = ing
	}
}

// toJSON serializa cualquier valor a JSON string.
func toJSON(v interface{}) string {
	b, err := json.Marshal(v)
	if err != nil {
		errObj := map[string]string{"error": err.Error()}
		eb, _ := json.Marshal(errObj)
		return string(eb)
	}
	return string(b)
}

// getProfileByName busca un perfil por nombre.
func getProfileByName(name string) domain.PortionProfile {
	for _, p := range profiles {
		if p.Name == name {
			return p
		}
	}
	return profiles[0] // Default: mujer
}

// adjustDish aplica el perfil de porción a un plato.
func adjustDish(dish domain.Dish, profileName string) domain.Dish {
	profile := getProfileByName(profileName)
	return domain.ApplyPortionProfile(dish, profile, ingredientIndex)
}

// ── Funciones expuestas a JavaScript ──────────────────────────────────

func getIngredients(_ js.Value, _ []js.Value) interface{} {
	return toJSON(ingredients)
}

// getDishes recibe opcionalmente un profileName ("mujer" o "hombre").
func getDishes(_ js.Value, args []js.Value) interface{} {
	profileName := "mujer"
	if len(args) > 0 && args[0].Type() == js.TypeString {
		profileName = args[0].String()
	}

	type DishWithNutrition struct {
		domain.Dish
		Nutrition service.NutritionSummary `json:"nutrition"`
	}

	result := make([]DishWithNutrition, len(dishes))
	for i, d := range dishes {
		adjusted := adjustDish(d, profileName)
		result[i] = DishWithNutrition{
			Dish:      adjusted,
			Nutrition: calculator.CalculateDishNutrition(adjusted),
		}
	}
	return toJSON(result)
}

func getMealPlan(_ js.Value, _ []js.Value) interface{} {
	return toJSON(mealPlan)
}

func getPortionProfiles(_ js.Value, _ []js.Value) interface{} {
	return toJSON(profiles)
}

// getDishNutrition recibe dishId y opcionalmente profileName.
func getDishNutrition(_ js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return toJSON(map[string]string{"error": "se requiere dishId"})
	}
	dishID := args[0].Int()
	dish, ok := dishIndex[dishID]
	if !ok {
		return toJSON(map[string]string{"error": "plato no encontrado"})
	}

	profileName := "mujer"
	if len(args) > 1 && args[1].Type() == js.TypeString {
		profileName = args[1].String()
	}

	adjusted := adjustDish(dish, profileName)
	return toJSON(calculator.CalculateDishNutrition(adjusted))
}

// getDayNutrition recibe dayIndex y opcionalmente profileName.
func getDayNutrition(_ js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return toJSON(map[string]string{"error": "se requiere dayIndex"})
	}
	dayIdx := args[0].Int()
	if dayIdx < 0 || dayIdx >= len(mealPlan.Days) {
		return toJSON(map[string]string{"error": "índice de día fuera de rango"})
	}

	profileName := "mujer"
	if len(args) > 1 && args[1].Type() == js.TypeString {
		profileName = args[1].String()
	}

	// Crear un dishIndex ajustado
	adjustedDishes := make(map[int]domain.Dish, len(dishes))
	for _, d := range dishes {
		adj := adjustDish(d, profileName)
		adjustedDishes[adj.ID] = adj
	}

	return toJSON(calculator.CalculateDayNutrition(mealPlan.Days[dayIdx], adjustedDishes))
}

// getShoppingList recibe opcionalmente "ambos" para calcular para 2 personas.
func getShoppingList(_ js.Value, args []js.Value) interface{} {
	mode := "mujer"
	if len(args) > 0 && args[0].Type() == js.TypeString {
		mode = args[0].String()
	}

	if mode == "ambos" {
		// Generar lista combinada para mujer + hombre
		profileMujer := getProfileByName("mujer")
		profileHombre := getProfileByName("hombre")

		// Crear platos ajustados para mujer
		dishesMujer := make([]domain.Dish, len(dishes))
		for i, d := range dishes {
			dishesMujer[i] = domain.ApplyPortionProfile(d, profileMujer, ingredientIndex)
		}
		plannerM := service.NewPlannerService(ingredients, dishesMujer)
		listM := plannerM.GenerateShoppingList(mealPlan)

		// Crear platos ajustados para hombre
		dishesHombre := make([]domain.Dish, len(dishes))
		for i, d := range dishes {
			dishesHombre[i] = domain.ApplyPortionProfile(d, profileHombre, ingredientIndex)
		}
		plannerH := service.NewPlannerService(ingredients, dishesHombre)
		listH := plannerH.GenerateShoppingList(mealPlan)

		// Combinar ambas listas
		combined := make(map[string]service.ShoppingItem)
		for _, item := range listM {
			combined[item.IngredientName] = item
		}
		for _, item := range listH {
			if existing, ok := combined[item.IngredientName]; ok {
				existing.TotalQuantityG += item.TotalQuantityG
				combined[item.IngredientName] = existing
			} else {
				combined[item.IngredientName] = item
			}
		}

		var result []service.ShoppingItem
		for _, item := range combined {
			result = append(result, item)
		}

		// Ordenar
		return toJSON(result)
	}

	// Modo individual
	profile := getProfileByName(mode)
	adjustedDishes := make([]domain.Dish, len(dishes))
	for i, d := range dishes {
		adjustedDishes[i] = domain.ApplyPortionProfile(d, profile, ingredientIndex)
	}
	p := service.NewPlannerService(ingredients, adjustedDishes)
	return toJSON(p.GenerateShoppingList(mealPlan))
}

func getGoitrogenWarnings(_ js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return toJSON(map[string]string{"error": "se requiere dishId"})
	}
	dishID := args[0].Int()
	dish, ok := dishIndex[dishID]
	if !ok {
		return toJSON(map[string]string{"error": "plato no encontrado"})
	}
	return toJSON(calculator.HasGoitrogens(dish))
}

func getSeleniumSources(_ js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return toJSON(map[string]string{"error": "se requiere dishId"})
	}
	dishID := args[0].Int()
	dish, ok := dishIndex[dishID]
	if !ok {
		return toJSON(map[string]string{"error": "plato no encontrado"})
	}
	return toJSON(calculator.GetSeleniumSources(dish))
}

func saveMealPlan(_ js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return toJSON(map[string]string{"error": "se requiere JSON del plan"})
	}
	jsonStr := args[0].String()
	var newPlan domain.MealPlan
	if err := json.Unmarshal([]byte(jsonStr), &newPlan); err != nil {
		return toJSON(map[string]string{"error": "JSON inválido: " + err.Error()})
	}
	mealPlan = newPlan
	return toJSON(map[string]string{"status": "ok"})
}

func getCategoryLabels(_ js.Value, _ []js.Value) interface{} {
	return toJSON(domain.CategoryLabels)
}

func getMealTypeLabels(_ js.Value, _ []js.Value) interface{} {
	return toJSON(domain.MealTypeLabels)
}

func getCoupleDishDetails(_ js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return toJSON(map[string]string{"error": "se requiere dishId"})
	}
	dishID := args[0].Int()
	dish, ok := dishIndex[dishID]
	if !ok {
		return toJSON(map[string]string{"error": "plato no encontrado"})
	}

	dishM := adjustDish(dish, "mujer")
	dishH := adjustDish(dish, "hombre")

	type IngredientCouple struct {
		IngredientID   int     `json:"ingredient_id"`
		IngredientName string  `json:"ingredient_name"`
		QtyWomanG      float64 `json:"qty_woman_g"`
		QtyManG        float64 `json:"qty_man_g"`
		TotalQtyG      float64 `json:"total_qty_g"`
	}

	ingMap := make(map[int]*IngredientCouple)

	for _, di := range dishM.IngredientAmounts {
		ingName := ""
		if ing, exists := ingredientIndex[di.IngredientID]; exists {
			ingName = ing.Name
		}
		ingMap[di.IngredientID] = &IngredientCouple{
			IngredientID:   di.IngredientID,
			IngredientName: ingName,
			QtyWomanG:      di.QuantityG,
			TotalQtyG:      di.QuantityG,
		}
	}

	for _, di := range dishH.IngredientAmounts {
		if item, exists := ingMap[di.IngredientID]; exists {
			item.QtyManG = di.QuantityG
			item.TotalQtyG += di.QuantityG
		}
	}

	var items []IngredientCouple
	for _, di := range dishM.IngredientAmounts {
		if item, exists := ingMap[di.IngredientID]; exists {
			items = append(items, *item)
		}
	}

	nutM := calculator.CalculateDishNutrition(dishM)
	nutH := calculator.CalculateDishNutrition(dishH)

	result := map[string]interface{}{
		"dish_id":               dish.ID,
		"name":                  dish.Name,
		"description":           dish.Description,
		"meal_type":             dish.MealType,
		"prep_time_mins":        dish.PrepTimeMins,
		"instructions":          dish.Instructions,
		"ingredients_couple":    items,
		"nutrition_woman":       nutM,
		"nutrition_man":         nutH,
		"total_calories_couple": nutM.TotalCalories + nutH.TotalCalories,
	}

	return toJSON(result)
}

func main() {
	js.Global().Set("getIngredients", js.FuncOf(getIngredients))
	js.Global().Set("getDishes", js.FuncOf(getDishes))
	js.Global().Set("getMealPlan", js.FuncOf(getMealPlan))
	js.Global().Set("getPortionProfiles", js.FuncOf(getPortionProfiles))
	js.Global().Set("getDishNutrition", js.FuncOf(getDishNutrition))
	js.Global().Set("getDayNutrition", js.FuncOf(getDayNutrition))
	js.Global().Set("getShoppingList", js.FuncOf(getShoppingList))
	js.Global().Set("getGoitrogenWarnings", js.FuncOf(getGoitrogenWarnings))
	js.Global().Set("getSeleniumSources", js.FuncOf(getSeleniumSources))
	js.Global().Set("saveMealPlan", js.FuncOf(saveMealPlan))
	js.Global().Set("getCategoryLabels", js.FuncOf(getCategoryLabels))
	js.Global().Set("getMealTypeLabels", js.FuncOf(getMealTypeLabels))
	js.Global().Set("getCoupleDishDetails", js.FuncOf(getCoupleDishDetails))

	// Notificar a JavaScript que WASM está listo
	js.Global().Call("eval", `if(window.onWasmReady) window.onWasmReady()`)

	select {}
}
