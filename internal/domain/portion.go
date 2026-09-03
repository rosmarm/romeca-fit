package domain

import "math"

// PortionProfile define un perfil de porciones con multiplicadores por categoría.
type PortionProfile struct {
	Name        string             `json:"name"`
	Label       string             `json:"label"`
	Icon        string             `json:"icon"`
	Multipliers map[string]float64 `json:"multipliers"` // Categoría → multiplicador
}

// GetPortionProfiles devuelve los perfiles disponibles de porciones.
func GetPortionProfiles() []PortionProfile {
	return []PortionProfile{
		{
			Name:  "mujer",
			Label: "Porción Mujer",
			Icon:  "🩷",
			Multipliers: map[string]float64{
				CatProteina: 1.0,
				CatGrano:    1.0,
				CatVerdura:  1.0,
				CatFruta:    1.0,
				CatGrasa:    1.0,
				CatEspecia:  1.0,
				CatLacteo:   1.0,
			},
		},
		{
			Name:  "hombre",
			Label: "Porción Hombre",
			Icon:  "💙",
			Multipliers: map[string]float64{
				CatProteina: 1.35, // 150g → ~200g
				CatGrano:    1.45, // 150g → ~220g
				CatVerdura:  1.15, // Un poco más de verdura
				CatFruta:    1.30, // Más fruta
				CatGrasa:    1.20, // Algo más de grasas saludables
				CatEspecia:  1.0,  // Misma cantidad de especias
				CatLacteo:   1.25, // Algo más de lácteos
			},
		},
	}
}

// ApplyPortionProfile ajusta las cantidades de ingredientes de un plato según el perfil.
func ApplyPortionProfile(dish Dish, profile PortionProfile, ingredients map[int]Ingredient) Dish {
	adjusted := Dish{
		ID:           dish.ID,
		Name:         dish.Name,
		Description:  dish.Description,
		MealType:     dish.MealType,
		PrepTimeMins: dish.PrepTimeMins,
		Instructions: dish.Instructions,
	}

	adjusted.IngredientAmounts = make([]DishIngredient, len(dish.IngredientAmounts))
	for i, di := range dish.IngredientAmounts {
		multiplier := 1.0
		if ing, ok := ingredients[di.IngredientID]; ok {
			if m, exists := profile.Multipliers[ing.Category]; exists {
				multiplier = m
			}
		}
		adjusted.IngredientAmounts[i] = DishIngredient{
			IngredientID: di.IngredientID,
			QuantityG:    math.Round(di.QuantityG * multiplier),
		}
	}

	return adjusted
}
