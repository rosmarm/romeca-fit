.PHONY: build-wasm serve clean

# Ruta de Go (ajusta si Go está en otra ubicación)
GO := $(HOME)/go-local/go/bin/go

# Compilar Go a WebAssembly
build-wasm:
	@echo "🔨 Compilando Go a WebAssembly..."
	GOOS=js GOARCH=wasm $(GO) build -o web/main.wasm ./cmd/wasm/
	@echo "✅ web/main.wasm generado correctamente"
	@ls -lh web/main.wasm

# Copiar wasm_exec.js del SDK de Go
copy-wasm-exec:
	@echo "📋 Copiando wasm_exec.js..."
	cp "$$($(GO) env GOROOT)/misc/wasm/wasm_exec.js" web/js/wasm_exec.js
	@echo "✅ wasm_exec.js copiado"

# Servidor local de desarrollo (requiere Go)
serve: build-wasm
	@echo "🚀 Servidor local en http://localhost:8080"
	@cd web && python3 -m http.server 8080

# Servidor alternativo con Go
serve-go: build-wasm
	@echo "🚀 Servidor local en http://localhost:8080"
	@$(GO) run ./scripts/server.go

# Limpiar artefactos
clean:
	rm -f web/main.wasm
	@echo "🧹 Limpio"

# Construir todo
all: copy-wasm-exec build-wasm
	@echo "🎉 Proyecto listo. Ejecuta 'make serve' para probarlo."
