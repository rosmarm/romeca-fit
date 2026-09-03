package domain

// MealPlan representa la planificación semanal de comidas.
type MealPlan struct {
	WeekNumber int       `json:"week_number"`
	Days       []DayPlan `json:"days"`
}

// DayPlan representa las 3 comidas de un día.
type DayPlan struct {
	DayName     string `json:"day_name"`
	BreakfastID int    `json:"breakfast_id"`
	LunchID     int    `json:"lunch_id"`
	DinnerID    int    `json:"dinner_id"`
}

// GetDefaultMealPlan devuelve un plan semanal de ejemplo para 5 días (Lunes a Viernes).
func GetDefaultMealPlan() MealPlan {
	return MealPlan{
		WeekNumber: 1,
		Days: []DayPlan{
			{DayName: "Lunes", BreakfastID: 1, LunchID: 6, DinnerID: 11},
			{DayName: "Martes", BreakfastID: 2, LunchID: 7, DinnerID: 12},
			{DayName: "Miércoles", BreakfastID: 3, LunchID: 8, DinnerID: 13},
			{DayName: "Jueves", BreakfastID: 4, LunchID: 9, DinnerID: 14},
			{DayName: "Viernes", BreakfastID: 5, LunchID: 10, DinnerID: 15},
		},
	}
}
