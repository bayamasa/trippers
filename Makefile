.PHONY: help
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'
	@echo ''

.PHONY: up
up: ## Run docker-compose up
	docker compose up -d
	
.PHONY: down
down: ## Run docker-compose down
	docker compose down

.PHONY: db
db: ## Run docker-compose up -d db
	docker compose up -d db

.PHONY: db-reset
db-reset: ## Reset database (remove volume and recreate)
	@echo "Stopping existing PostgreSQL containers on port 5432..."
	@docker ps --filter "publish=5432" --format "{{.ID}}" | xargs docker stop 2>/dev/null || true
	@docker compose down db 2>/dev/null || true
	@echo "Removing database volume..."
	@docker volume rm trippers_db-data 2>/dev/null || true
	@echo "Starting database..."
	@docker compose up -d db
	@echo "Waiting for database to be ready..."
	@sleep 5
	@echo "Applying schema..."
	@echo "n" | pnpm run db:push || true
	@echo "Seeding database..."
	@pnpm run db:seed
	
.PHONY: db-down
db-down: ## Run docker-compose down db
	docker compose down db

.PHONY: db-studio
db-studio: ## Run Drizzle Studio
	pnpm run db:studio

# OpenAPI commands
.PHONY: generate-types
generate-types: ## Generate TypeScript types from OpenAPI spec
	@echo "Generating TypeScript types from OpenAPI spec..."
	@npx openapi-typescript http://localhost:3001/doc -o frontend/api/generated.ts
	@echo "✅ Types generated successfully"

# Development commands
.PHONY: dev
dev: ## Start all services (DB + Backend + Frontend)
	@echo "Gracefully stopping processes using ports 3000 and 3001..."
	@lsof -ti:3000 | xargs kill -15 2>/dev/null || true
	@lsof -ti:3001 | xargs kill -15 2>/dev/null || true
	@sleep 1
	@echo "Starting all services..."
	@make db
	@echo "Waiting for database to be ready..."
	@sleep 3
	@echo "Starting backend and frontend..."
	@echo "Backend: http://localhost:3001"
	@echo "Frontend: http://localhost:3000"
	@echo ""
	@pnpm dev

.PHONY: dev-front
dev-front: ## Start frontend only
	@echo "Gracefully stopping process using port 3000..."
	@lsof -ti:3000 | xargs kill -15 2>/dev/null || true
	@sleep 1
	@echo "Starting frontend..."
	@pnpm dev:frontend

.PHONY: dev-back
dev-back: ## Start backend only (with DB)
	@echo "Gracefully stopping process using port 3001..."
	@lsof -ti:3001 | xargs kill -15 2>/dev/null || true
	@sleep 1
	@echo "Starting database..."
	@make db
	@echo "Waiting for database to be ready..."
	@sleep 3
	@echo "Starting backend..."
	@pnpm dev:backend

.PHONY: dev-db
dev-db: ## Start database only
	@make db

.PHONY: stop
stop: ## Stop all services
	@echo "Stopping all services..."
	@make down
