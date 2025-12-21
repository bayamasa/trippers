.PHONY: help
help:
	@grep -E '^[%/a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'
	@echo ''

.PHONY: fmt
fmt: ## Run go fmt
	cd backend && go fmt ./...

.PHONY: up
up: ## Run docker-compose up
	docker compose -f infrastructure/docker-compose.yaml up -d
	
.PHONY: down
down: ## Run docker-compose down
	docker compose -f infrastructure/docker-compose.yaml down

.PHONY: db
db: ## Run docker-compose up -d db
	docker compose -f infrastructure/docker-compose.yaml up -d db
	
.PHONY: db-down
db-down: ## Run docker-compose down db
	docker compose -f infrastructure/docker-compose.yaml down db

.PHONY: db-studio
db-studio: ## Run docker-compose up -d db-studio
	docker compose -f infrastructure/docker-compose.yaml up -d db-studio

.PHONY: db-studio-down
db-studio-down: ## Run docker-compose down db-studio
	docker compose -f infrastructure/docker-compose.yaml down db-studio
