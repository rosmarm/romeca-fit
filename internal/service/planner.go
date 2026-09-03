package service

import (
	"math"
	"sort"

	"github.com/recetario-fit/internal/domain"
)

// ShoppingItem representa un artículo en la lista de compras del supermercado.
type ShoppingItem struct {
	IngredientName string  `json:"ingredient_name"`
	Category       string  `json:"category"`
	CategoryLabel  string  `json:"category_label"`
	TotalQuantityG float64 `json:"total_quantity_g"`
}

// PlannerService genera la lista de compras a partir del plan semanal.
type PlannerService struct {
	ingredients map[int]domain.Ingredient
	dishes      map[int]domain.Dish
}

// NewPlannerService crea un nuevo servicio de planificación.
func NewPlannerService(ingredients []domain.Ingredient, dishes []domain.Dish) *PlannerService {
	ingIdx := make(map[int]domain.Ingredient, len(ingredients))
	for _, ing := range ingredients {
		ingIdx[ing.ID] = ing
	}
	dishIdx := make(map[int]domain.Dish, len(dishes))
	for _, d := range dishes {
		dishIdx[d.ID] = d
	}
	return &PlannerService{ingredients: ingIdx, dishes: dishIdx}
}

// GenerateShoppingList agrega todos los ingredientes necesarios para el plan semanal,
// agrupados por categoría y ordenados alfabéticamente.
func (ps *PlannerService) GenerateShoppingList(plan domain.MealPlan) []ShoppingItem {
	// Acumulador: ingredientID → gramos totales
	totals := make(map[int]float64)

	for _, day := range plan.Days {
		for _, dishID := range []int{day.BreakfastID, day.LunchID, day.DinnerID} {
			dish, ok := ps.dishes[dishID]
			if !ok {
				continue
			}
			for _, di := range dish.IngredientAmounts {
				totals[di.IngredientID] += di.QuantityG
			}
		}
	}

	// Construir la lista de compras
	var items []ShoppingItem
	for ingID, totalG := range totals {
		ing, ok := ps.ingredients[ingID]
		if !ok {
			continue
		}
		label := domain.CategoryLabels[ing.Category]
		items = append(items, ShoppingItem{
			IngredientName: ing.Name,
			Category:       ing.Category,
			CategoryLabel:  label,
			TotalQuantityG: math.Round(totalG*10) / 10,
		})
	}

	// Ordenar por categoría y luego por nombre
	sort.Slice(items, func(i, j int) bool {
		if items[i].Category != items[j].Category {
			return items[i].Category < items[j].Category
		}
		return items[i].IngredientName < items[j].IngredientName
	})

	return items
}
