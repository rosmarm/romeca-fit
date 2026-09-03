# 🌿 Recetario Fit — Planificador de Comidas Saludable

Aplicación web de planificación de comidas y recetario, optimizada para una **dieta balanceada con hipotiroidismo**. Construida con **Go (WebAssembly)** y desplegada en **GitHub Pages** — 100% gratuita, sin servidores externos.

## ✨ Características

- 📋 **Plan Semanal de 5 Días** — Desayuno, almuerzo y cena organizados
- 🍳 **15 Recetas Pre-Cargadas** — Adaptadas para hipotiroidismo
- 🥗 **46 Ingredientes Clasificados** — Con datos nutricionales reales por 100g
- 📊 **Cálculo Automático de Macros** — Calorías, proteínas, carbos y grasas
- 🥦 **Alertas de Bociógenos** — Identifica crucíferas que deben cocinarse
- 🌰 **Indicador de Selenio** — Destaca alimentos ricos en selenio (clave para T4→T3)
- 🛒 **Lista de Compras Automática** — Agrupada por categoría de ingrediente
- 🌙 **Modo Oscuro** — Interfaz premium con tema claro/oscuro
- ⚡ **100% Offline** — Funciona sin conexión a internet después de la primera carga

## 🚀 Despliegue en GitHub Pages

### 1. Crea el repositorio en GitHub

Ve a [github.com/new](https://github.com/new) y crea un repositorio llamado `recetario-fit` (público).

### 2. Sube el código

```bash
cd recetario-fit
git init
git add .
git commit -m "🌿 Recetario Fit - primera versión"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/recetario-fit.git
git push -u origin main
```

### 3. Activa GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. En **Source**, selecciona **"GitHub Actions"**
4. ¡Listo! El workflow se ejecutará automáticamente y tu app estará disponible en:

```
https://TU-USUARIO.github.io/recetario-fit/
```

## 🛠️ Desarrollo Local

### Requisitos
- [Go 1.23+](https://go.dev/dl/)
- Python 3 (para servidor local) o cualquier servidor HTTP estático

### Compilar y probar

```bash
# Compilar Go a WebAssembly
make build-wasm

# Copiar el runtime de WASM (solo la primera vez)
make copy-wasm-exec

# Iniciar servidor local
make serve
# → Abre http://localhost:8080
```

## 📁 Estructura del Proyecto

```
recetario-fit/
├── cmd/wasm/main.go          # Punto de entrada WASM
├── internal/
│   ├── domain/               # Modelos (Ingrediente, Plato, PlanSemanal)
│   └── service/              # Lógica (Calculadora Nutricional, Planificador)
├── web/                      # Frontend (se despliega en GitHub Pages)
│   ├── index.html
│   ├── css/styles.css        # Design System
│   ├── css/components.css    # Componentes UI
│   ├── js/app.js             # Aplicación cliente
│   ├── js/wasm_exec.js       # Runtime Go WASM
│   └── main.wasm             # Binario compilado
├── .github/workflows/        # CI/CD automático
├── Makefile
└── README.md
```

## 🏗️ Arquitectura

```
Navegador → HTML/CSS/JS (Frontend) → Go WASM (Lógica) → LocalStorage (Datos)
```

- **Frontend**: HTML5 semántico + Vanilla CSS (Design System) + JavaScript ES6+
- **Backend/Motor**: Go compilado a WebAssembly — se ejecuta 100% en el navegador
- **Persistencia**: LocalStorage del navegador (datos privados, sin servidor)
- **Despliegue**: GitHub Pages (archivos estáticos) via GitHub Actions

## ⚠️ Aviso de Salud

Esta herramienta es de **referencia informativa**. Siempre consulta con tu médico endocrinólogo antes de modificar tu dieta, especialmente si tienes hipotiroidismo u otra condición médica.

## 📄 Licencia

MIT
