package domain

// Dish representa un plato / receta con sus ingredientes y cantidades.
type Dish struct {
	ID                int              `json:"id"`
	Name              string           `json:"name"`
	Description       string           `json:"description"`
	MealType          string           `json:"meal_type"`
	PrepTimeMins      int              `json:"prep_time_mins"`
	Instructions      string           `json:"instructions"`
	IngredientAmounts []DishIngredient `json:"ingredient_amounts"`
}

// DishIngredient representa la cantidad de un ingrediente en un plato.
type DishIngredient struct {
	IngredientID int     `json:"ingredient_id"`
	QuantityG    float64 `json:"quantity_g"`
}

// Tipos de comida.
const (
	MealBreakfast = "desayuno"
	MealLunch     = "almuerzo"
	MealDinner    = "cena"
)

// MealTypeLabels devuelve las etiquetas de tipo de comida.
var MealTypeLabels = map[string]string{
	MealBreakfast: "🌅 Desayuno",
	MealLunch:     "☀️ Almuerzo",
	MealDinner:    "🌙 Cena",
}

// GetDefaultDishes devuelve las 15 recetas pre-cargadas adaptadas para hipotiroidismo.
func GetDefaultDishes() []Dish {
	return []Dish{
		// ══════════════════════════════════════════════════════════
		// DESAYUNOS
		// ══════════════════════════════════════════════════════════
		{
			ID:           1,
			Name:         "Omelette de Espinacas y Aguacate",
			Description:  "Omelette esponjoso con espinacas salteadas y medio aguacate. Rico en selenio y grasas saludables.",
			MealType:     MealBreakfast,
			PrepTimeMins: 12,
			Instructions: "1. Batir 2 huevos con sal y pimienta.\n2. Saltear 60g de espinacas en aceite de oliva hasta que se marchiten (desactiva bociógenos).\n3. Verter los huevos en sartén antiadherente a fuego medio.\n4. Agregar las espinacas salteadas sobre la mitad del omelette.\n5. Doblar y servir con medio aguacate en rodajas.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 26, QuantityG: 100}, // 2 Huevos (~50g c/u)
				{IngredientID: 1, QuantityG: 60},   // Espinaca (salteada)
				{IngredientID: 19, QuantityG: 70},   // Aguacate (medio)
				{IngredientID: 40, QuantityG: 5},    // Aceite de oliva
				{IngredientID: 37, QuantityG: 1},    // Pimienta negra
			},
		},
		{
			ID:           2,
			Name:         "Avena con Huevo y Aguacate",
			Description:  "Avena cremosa con chía y canela, acompañada de 1 huevo pochado y rodajas de aguacate. El desayuno más completo.",
			MealType:     MealBreakfast,
			PrepTimeMins: 12,
			Instructions: "1. Cocinar 40g de avena en 200ml de agua a fuego medio por 5 min.\n2. Agregar 10g de semillas de chía y espolvorear canela.\n3. Mientras, calentar agua en una ollita y pochar 1 huevo por 3 min.\n4. Servir la avena en un bowl, colocar el huevo pochado encima.\n5. Acompañar con rodajas de aguacate y arándanos al lado.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 29, QuantityG: 40},  // Avena
				{IngredientID: 26, QuantityG: 55},  // 1 Huevo pochado
				{IngredientID: 19, QuantityG: 70},  // Aguacate (medio)
				{IngredientID: 42, QuantityG: 10},  // Semillas de chía
				{IngredientID: 34, QuantityG: 2},   // Canela
				{IngredientID: 15, QuantityG: 40},  // Arándanos
			},
		},
		{
			ID:           3,
			Name:         "Huevos Revueltos con Tomate",
			Description:  "Huevos revueltos suaves con tomate fresco en cubos y medio aguacate.",
			MealType:     MealBreakfast,
			PrepTimeMins: 8,
			Instructions: "1. Picar 80g de tomate en cubos pequeños.\n2. Batir 2 huevos con una pizca de sal.\n3. Saltear el tomate en aceite de oliva por 2 min.\n4. Agregar los huevos y revolver suavemente a fuego bajo.\n5. Servir con medio aguacate.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 26, QuantityG: 100}, // 2 Huevos
				{IngredientID: 5, QuantityG: 80},   // Tomate
				{IngredientID: 19, QuantityG: 70},   // Aguacate
				{IngredientID: 40, QuantityG: 5},    // Aceite de oliva
			},
		},
		{
			ID:           4,
			Name:         "Bowl de Yogur con Huevo y Frutos Rojos",
			Description:  "Yogur griego con fresas y arándanos, acompañado de 1 huevo duro y rodajas de aguacate. Desayuno rápido y muy completo.",
			MealType:     MealBreakfast,
			PrepTimeMins: 10,
			Instructions: "1. Cocinar 1 huevo duro en agua hirviendo por 8 min. Enfriar y pelar.\n2. Servir 150g de yogur griego en un bowl.\n3. Agregar fresas cortadas y arándanos.\n4. Espolvorear semillas de girasol y un toque de canela.\n5. Servir el huevo duro partido y rodajas de aguacate al lado.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 46, QuantityG: 150}, // Yogur griego
				{IngredientID: 26, QuantityG: 55},  // 1 Huevo duro
				{IngredientID: 19, QuantityG: 50},  // Aguacate (¼ unidad)
				{IngredientID: 16, QuantityG: 60},  // Fresas
				{IngredientID: 15, QuantityG: 40},  // Arándanos
				{IngredientID: 44, QuantityG: 15},  // Semillas de girasol
				{IngredientID: 34, QuantityG: 1},   // Canela
			},
		},
		{
			ID:           5,
			Name:         "Panqueques de Avena con Aguacate",
			Description:  "Panqueques de avena y huevo, servidos con frutos rojos y acompañados de aguacate. Desayuno de viernes especial.",
			MealType:     MealBreakfast,
			PrepTimeMins: 15,
			Instructions: "1. Licuar 40g de avena, 2 huevos enteros y canela hasta formar una mezcla homogénea.\n2. Cocinar en sartén antiadherente a fuego medio-bajo con unas gotas de aceite.\n3. Voltear cuando aparezcan burbujas en la superficie.\n4. Servir con fresas, arándanos y medio aguacate en rodajas al lado.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 29, QuantityG: 40},  // Avena
				{IngredientID: 26, QuantityG: 110}, // 2 Huevos enteros
				{IngredientID: 19, QuantityG: 70},  // Aguacate (medio)
				{IngredientID: 34, QuantityG: 2},   // Canela
				{IngredientID: 16, QuantityG: 50},  // Fresas
				{IngredientID: 15, QuantityG: 30},  // Arándanos
			},
		},
		// ══════════════════════════════════════════════════════════
		// ALMUERZOS
		// ══════════════════════════════════════════════════════════
		{
			ID:           6,
			Name:         "Pollo a la Plancha con Quinua y Ensalada",
			Description:  "Pechuga de pollo jugosa con quinua y ensalada fresca de pepino, tomate y aceite de oliva.",
			MealType:     MealLunch,
			PrepTimeMins: 25,
			Instructions: "1. Sazonar 150g de pechuga de pollo con orégano, ajo y pimienta.\n2. Cocinar a la plancha 6-7 min por cada lado.\n3. Cocinar 60g de quinua (peso seco) según instrucciones.\n4. Preparar ensalada con pepino, tomate y aceite de oliva.\n5. Servir todo junto.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 21, QuantityG: 150}, // Pechuga de pollo
				{IngredientID: 30, QuantityG: 150}, // Quinua cocida
				{IngredientID: 6, QuantityG: 60},   // Pepino
				{IngredientID: 5, QuantityG: 60},   // Tomate
				{IngredientID: 40, QuantityG: 10},   // Aceite de oliva
				{IngredientID: 38, QuantityG: 1},   // Orégano
				{IngredientID: 39, QuantityG: 3},   // Ajo
			},
		},
		{
			ID:           7,
			Name:         "Pavo con Ensalada de Garbanzos",
			Description:  "Filete de pavo al sartén con ensalada de garbanzos, pimiento rojo y aderezo de limón.",
			MealType:     MealLunch,
			PrepTimeMins: 20,
			Instructions: "1. Cocinar 140g de pavo en sartén con aceite de oliva, 5 min por lado.\n2. Mezclar garbanzos cocidos con pimiento rojo picado.\n3. Aliñar con jugo de limón y aceite de oliva.\n4. Servir el pavo sobre la ensalada de garbanzos.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 22, QuantityG: 140}, // Pechuga de pavo
				{IngredientID: 33, QuantityG: 120}, // Garbanzos cocidos
				{IngredientID: 7, QuantityG: 60},   // Pimiento rojo
				{IngredientID: 20, QuantityG: 20},  // Limón
				{IngredientID: 40, QuantityG: 10},   // Aceite de oliva
			},
		},
		{
			ID:           8,
			Name:         "Salmón con Brócoli y Arroz Integral",
			Description:  "Salmón a la plancha con brócoli al vapor (bien cocido) y arroz integral. Alto en selenio y omega-3.",
			MealType:     MealLunch,
			PrepTimeMins: 25,
			Instructions: "1. Cocinar 150g de salmón a la plancha con limón y pimienta, 4-5 min por lado.\n2. Cocer 100g de brócoli al vapor por 7-8 min (IMPORTANTE: cocinar bien para reducir bociógenos).\n3. Preparar 130g de arroz integral cocido.\n4. Servir juntos con un chorrito de aceite de oliva.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 23, QuantityG: 150}, // Salmón
				{IngredientID: 2, QuantityG: 100},  // Brócoli (cocido)
				{IngredientID: 31, QuantityG: 130}, // Arroz integral cocido
				{IngredientID: 20, QuantityG: 15},  // Limón
				{IngredientID: 40, QuantityG: 5},    // Aceite de oliva
			},
		},
		{
			ID:           9,
			Name:         "Lentejas Guisadas con Verduras",
			Description:  "Guiso reconfortante de lentejas con zanahoria, calabacín y pimiento rojo. Alto en proteína vegetal.",
			MealType:     MealLunch,
			PrepTimeMins: 30,
			Instructions: "1. Sofreír cebolla y ajo picados en aceite de oliva.\n2. Agregar zanahoria y calabacín en cubos.\n3. Añadir 150g de lentejas cocidas, cúrcuma y pimienta.\n4. Cocinar por 15 min con caldo de verduras.\n5. Servir caliente con pimiento rojo en tiras.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 32, QuantityG: 150}, // Lentejas cocidas
				{IngredientID: 4, QuantityG: 60},   // Zanahoria
				{IngredientID: 3, QuantityG: 80},   // Calabacín
				{IngredientID: 7, QuantityG: 40},   // Pimiento rojo
				{IngredientID: 13, QuantityG: 30},  // Cebolla
				{IngredientID: 39, QuantityG: 5},   // Ajo
				{IngredientID: 35, QuantityG: 2},   // Cúrcuma
				{IngredientID: 40, QuantityG: 8},    // Aceite de oliva
			},
		},
		{
			ID:           10,
			Name:         "Ensalada Mediterránea con Pollo",
			Description:  "Ensalada completa con pollo, quinua, aceitunas, pepino y espinacas salteadas.",
			MealType:     MealLunch,
			PrepTimeMins: 20,
			Instructions: "1. Cocinar 140g de pechuga de pollo a la plancha.\n2. Saltear espinacas por 3 min en aceite de oliva (desactiva bociógenos).\n3. Mezclar quinua cocida, pepino en rodajas y aceitunas.\n4. Cortar el pollo en tiras y colocar sobre la ensalada.\n5. Aliñar con aceite de oliva y limón.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 21, QuantityG: 140}, // Pechuga de pollo
				{IngredientID: 30, QuantityG: 100}, // Quinua cocida
				{IngredientID: 1, QuantityG: 50},   // Espinacas (salteadas)
				{IngredientID: 6, QuantityG: 50},   // Pepino
				{IngredientID: 45, QuantityG: 20},  // Aceitunas
				{IngredientID: 40, QuantityG: 10},   // Aceite de oliva
				{IngredientID: 20, QuantityG: 10},  // Limón
			},
		},
		// ══════════════════════════════════════════════════════════
		// CENAS
		// ══════════════════════════════════════════════════════════
		{
			ID:           11,
			Name:         "Merluza al Horno con Espárragos y Camote",
			Description:  "Merluza al horno con espárragos asados y camote al vapor. Ligera y nutritiva.",
			MealType:     MealDinner,
			PrepTimeMins: 30,
			Instructions: "1. Precalentar horno a 200°C.\n2. Colocar 150g de merluza en bandeja con limón y ajo.\n3. Agregar espárragos alrededor con aceite de oliva.\n4. Hornear 18-20 min.\n5. Servir con 100g de camote al vapor.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 24, QuantityG: 150}, // Merluza
				{IngredientID: 8, QuantityG: 100},  // Espárragos
				{IngredientID: 14, QuantityG: 100}, // Camote
				{IngredientID: 20, QuantityG: 15},  // Limón
				{IngredientID: 39, QuantityG: 3},   // Ajo
				{IngredientID: 40, QuantityG: 8},    // Aceite de oliva
			},
		},
		{
			ID:           12,
			Name:         "Salteado de Tilapia con Verduras",
			Description:  "Tilapia dorada en trozos salteada con calabacín, zanahoria y champiñones. Ligera y alta en proteína.",
			MealType:     MealDinner,
			PrepTimeMins: 20,
			Instructions: "1. Cortar 150g de filete de tilapia en trozos medianos y sazonar con sal y pimienta.\n2. Dorar los trozos de tilapia en sartén con aceite de oliva por 3 min por lado. Retirar.\n3. En la misma sartén, saltear calabacín, zanahoria y champiñones por 5 min.\n4. Agregar jengibre rallado y ajo.\n5. Volver a añadir la tilapia y mezclar suavemente.\n6. Servir caliente.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 27, QuantityG: 150}, // Tilapia
				{IngredientID: 3, QuantityG: 80},   // Calabacín
				{IngredientID: 4, QuantityG: 50},   // Zanahoria
				{IngredientID: 9, QuantityG: 60},   // Champiñones
				{IngredientID: 36, QuantityG: 5},   // Jengibre
				{IngredientID: 39, QuantityG: 3},   // Ajo
				{IngredientID: 40, QuantityG: 8},    // Aceite de oliva
			},
		},
		{
			ID:           13,
			Name:         "Crema de Calabaza con Pollo Desmenuzado",
			Description:  "Crema de calabaza y zanahoria con semillas de calabaza tostadas y pollo desmenuzado.",
			MealType:     MealDinner,
			PrepTimeMins: 25,
			Instructions: "1. Cocinar 200g de calabaza y 60g de zanahoria con cebolla hasta que estén suaves.\n2. Licuar todo hasta obtener crema suave.\n3. Desmenuzar 100g de pechuga de pollo previamente cocida.\n4. Servir la crema con el pollo encima y semillas de calabaza tostadas.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 12, QuantityG: 200}, // Calabaza
				{IngredientID: 4, QuantityG: 60},   // Zanahoria
				{IngredientID: 13, QuantityG: 30},  // Cebolla
				{IngredientID: 21, QuantityG: 100}, // Pechuga de pollo
				{IngredientID: 43, QuantityG: 10},  // Semillas de calabaza
				{IngredientID: 40, QuantityG: 5},    // Aceite de oliva
			},
		},
		{
			ID:           14,
			Name:         "Pechuga a la Plancha con Puré de Camote y Rúcula",
			Description:  "Pechuga de pollo jugosa con puré de camote dulce y ensalada de rúcula y tomates cherry.",
			MealType:     MealDinner,
			PrepTimeMins: 25,
			Instructions: "1. Sazonar 140g de pechuga con ajo, orégano y pimienta.\n2. Cocinar a la plancha 6 min por lado.\n3. Hacer puré con 120g de camote cocido.\n4. Preparar ensalada de rúcula con tomates y aceite de oliva.\n5. Servir todo junto.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 21, QuantityG: 140}, // Pechuga de pollo
				{IngredientID: 14, QuantityG: 120}, // Camote
				{IngredientID: 11, QuantityG: 40},  // Rúcula
				{IngredientID: 5, QuantityG: 50},   // Tomate
				{IngredientID: 40, QuantityG: 8},    // Aceite de oliva
				{IngredientID: 38, QuantityG: 1},   // Orégano
				{IngredientID: 39, QuantityG: 3},   // Ajo
			},
		},
		{
			ID:           15,
			Name:         "Tortilla de Champiñones con Ensalada",
			Description:  "Tortilla francesa de 2 huevos con champiñones y ensalada de repollo morado bien salteado.",
			MealType:     MealDinner,
			PrepTimeMins: 15,
			Instructions: "1. Saltear 80g de champiñones en aceite de oliva.\n2. Batir 2 huevos y verter sobre los champiñones.\n3. Cocinar a fuego medio hasta que cuaje.\n4. Saltear 60g de repollo morado por 5-6 min (IMPORTANTE: cocinar bien para reducir bociógenos).\n5. Servir la tortilla con el repollo salteado.",
			IngredientAmounts: []DishIngredient{
				{IngredientID: 26, QuantityG: 100}, // 2 Huevos
				{IngredientID: 9, QuantityG: 80},   // Champiñones
				{IngredientID: 10, QuantityG: 60},  // Repollo morado (salteado)
				{IngredientID: 40, QuantityG: 8},    // Aceite de oliva
				{IngredientID: 37, QuantityG: 1},   // Pimienta negra
			},
		},
	}
}
