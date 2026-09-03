package service

import "github.com/recetario-fit/internal/domain"

// NutritionSummary contiene el resumen nutricional calculado.
type NutritionSummary struct {
	TotalCalories float64 `json:"total_calories"`
	TotalProteinG float64 `json:"total_protein_g"`
	TotalCarbsG   float64 `json:"total_carbs_g"`
	TotalFatG     float64 `json:"total_fat_g"`
}

// NutritionCalculator es el servicio de cálculo nutricional.
type NutritionCalculator struct {
	ingredients map[int]domain.Ingredient
}

// NewNutritionCalculator crea un nuevo calculador indexando los ingredientes por ID.
func NewNutritionCalculator(ingredients []domain.Ingredient) *NutritionCalculator {
	idx := make(map[int]domain.Ingredient, len(ingredients))
	for _, ing := range ingredients {
		idx[ing.ID] = ing
	}
	return &NutritionCalculator{ingredients: idx}
}

// CalculateDishNutrition calcula el total de calorías y macronutrientes de un plato.
func (nc *NutritionCalculator) CalculateDishNutrition(dish domain.Dish) NutritionSummary {
	var summary NutritionSummary
	for _, di := range dish.IngredientAmounts {
		ing, ok := nc.ingredients[di.IngredientID]
		if !ok {
			continue
		}
		factor := di.QuantityG / 100.0
		summary.TotalCalories += ing.CaloriesPer100 * factor
		summary.TotalProteinG += ing.ProteinG * factor
		summary.TotalCarbsG += ing.CarbsG * factor
		summary.TotalFatG += ing.FatG * factor
	}
	return summary
}

// CalculateDayNutrition calcula la nutrición total de un día (desayuno + almuerzo + cena).
func (nc *NutritionCalculator) CalculateDayNutrition(dayPlan domain.DayPlan, dishes map[int]domain.Dish) NutritionSummary {
	var total NutritionSummary
	for _, dishID := range []int{dayPlan.BreakfastID, dayPlan.LunchID, dayPlan.DinnerID} {
		if dish, ok := dishes[dishID]; ok {
			s := nc.CalculateDishNutrition(dish)
			total.TotalCalories += s.TotalCalories
			total.TotalProteinG += s.TotalProteinG
			total.TotalCarbsG += s.TotalCarbsG
			total.TotalFatG += s.TotalFatG
		}
	}
	return total
}

// HasGoitrogens devuelve los nombres de ingredientes bociógenos presentes en un plato.
func (nc *NutritionCalculator) HasGoitrogens(dish domain.Dish) []string {
	var names []string
	for _, di := range dish.IngredientAmounts {
		if ing, ok := nc.ingredients[di.IngredientID]; ok && ing.IsGoitrogen {
			names = append(names, ing.Name)
		}
	}
	return names
}

// GetSeleniumSources devuelve los nombres de ingredientes ricos en selenio presentes en un plato.
func (nc *NutritionCalculator) GetSeleniumSources(dish domain.Dish) []string {
	var names []string
	for _, di := range dish.IngredientAmounts {
		if ing, ok := nc.ingredients[di.IngredientID]; ok && ing.SeleniumRich {
			names = append(names, ing.Name)
		}
	}
	return names
}
