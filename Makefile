.PHONY: help dev dev-build prod build up down logs clean test lint type-check

help:
	@echo "AI Terminal Portfolio — Docker Commands"
	@echo "========================================"
	@echo "  make dev          - Start development environment"
	@echo "  make dev-build    - Rebuild dev container"
	@echo "  make prod         - Start production environment"
	@echo "  make build        - Build production image"
	@echo "  make up           - Start (uses docker-compose.yml)"
	@echo "  make down         - Stop all containers"
	@echo "  make logs         - View container logs"
	@echo "  make clean        - Remove containers and volumes"
	@echo "  make lint         - Run ESLint in container"
	@echo "  make type-check   - Run TypeScript type-check in container"
	@echo "  make test         - Run tests in container"

dev:
	docker-compose up

dev-build:
	docker-compose up --build

prod:
	docker-compose -f docker-compose.prod.yml up -d

build:
	docker-compose -f docker-compose.prod.yml build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f web

clean:
	docker-compose down -v
	rm -rf .next node_modules

lint:
	docker-compose exec web npm run lint

type-check:
	docker-compose exec web npm run type-check

test:
	docker-compose exec web npm test
