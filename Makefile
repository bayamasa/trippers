.PHONY: help
help:
	@grep -E '^[%/a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'
	@echo ''

.PHONY: fmt
fmt: ## Run go fmt
	go fmt ./...

.PHONY: up
up: ## Run docker-compose up
	docker compose up -d
	
.PHONY: down
down: ## Run docker-compose down
	docker compose down
