# ═══════════════════════════════════════
# ai-template — Makefile
# ═══════════════════════════════════════

BACKEND_DIR := src/backend
FRONTEND_DIR := src/frontend

# ── Laravel ───────────────────────────

.PHONY: laravel-init
laravel-init: ## Initialize Laravel locally (install deps, env, key, migrate)
	cd $(BACKEND_DIR) && composer install
	cd $(BACKEND_DIR) && cp -n .env.example .env || true
	cd $(BACKEND_DIR) && php artisan key:generate
	cd $(BACKEND_DIR) && touch database/database.sqlite
	cd $(BACKEND_DIR) && php artisan migrate
	cd $(BACKEND_DIR) && php artisan ide-helper:generate
	cd $(BACKEND_DIR) && php artisan ide-helper:models -N
	cd $(BACKEND_DIR) && php artisan ide-helper:meta
	cd $(BACKEND_DIR) && php artisan boost:install
	@echo ""
	@echo "✓ Laravel ready — run 'make laravel-serve' to start"

.PHONY: laravel-serve
laravel-serve: ## Start Laravel dev server
	cd $(BACKEND_DIR) && php artisan serve

.PHONY: laravel-test
laravel-test: ## Run Pest tests
	cd $(BACKEND_DIR) && php artisan test

.PHONY: laravel-check
laravel-check: ## Run all checks (tests, pint, phpstan)
	cd $(BACKEND_DIR) && php artisan test
	cd $(BACKEND_DIR) && ./vendor/bin/pint --test
	cd $(BACKEND_DIR) && ./vendor/bin/phpstan analyse

.PHONY: laravel-fix
laravel-fix: ## Auto-fix code style with Pint
	cd $(BACKEND_DIR) && ./vendor/bin/pint

# ── Frontend ──────────────────────────

.PHONY: front-init
front-init: ## Install frontend dependencies
	cd $(FRONTEND_DIR) && npm install

.PHONY: front-dev
front-dev: ## Start Vite dev server
	cd $(FRONTEND_DIR) && npm run dev

.PHONY: front-check
front-check: ## Run all frontend checks (build, test, lint)
	cd $(FRONTEND_DIR) && npm run check

# ── All ───────────────────────────────

.PHONY: init
init: front-init laravel-init ## Initialize everything (frontend + Laravel)

.PHONY: check
check: front-check laravel-check ## Run all checks (frontend + Laravel)

# ── Help ──────────────────────────────

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
