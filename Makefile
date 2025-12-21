.PHONY: help
help:
	@grep -E '^[%/a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'
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
