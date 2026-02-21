# --- Variables ---
DOCKER_COMPOSE = docker compose
NPM = npm
PRISMA = npx prisma

# --- Colors for Output ---
BLUE = \033[1;34m
GREEN = \033[1;32m
RESET = \033[0m

# --- Targets ---

all: install build-db dev

install:
	@echo "$(BLUE)Installing dependencies...$(RESET)"
	$(NPM) install

# Database Management
build-db:
	@echo "$(BLUE)Starting database container...$(RESET)"
	$(DOCKER_COMPOSE) up -d db
	@echo "$(BLUE)Pushing Prisma schema...$(RESET)"
	$(PRISMA) db push
	$(PRISMA) generate

# Development
dev:
	@echo "$(GREEN)Starting Next.js development server...$(RESET)"
	$(NPM) run dev

# Production Build & Start
build:
	@echo "$(BLUE)Building production application...$(RESET)"
	$(NPM) run build

start:
	@echo "$(GREEN)Starting production server...$(RESET)"
	$(NPM) run start

# Docker Commands
up:
	@echo "$(GREEN)Spinning up all services (Docker)...$(RESET)"
	$(DOCKER_COMPOSE) up --build -d

down:
	@echo "$(BLUE)Shutting down services...$(RESET)"
	$(DOCKER_COMPOSE) down

lint:
	@echo "$(BLUE)Running ESLint check...$(RESET)"
	$(NPM) run lint

# Cleanup
clean:
	@echo "$(BLUE)Cleaning up build artifacts...$(RESET)"
	rm -rf .next node_modules package-lock.json

fclean: clean
	@echo "$(BLUE)Complete reset: removing Docker volumes...$(RESET)"
	$(DOCKER_COMPOSE) down -v

re: fclean all

.PHONY: all install build-db dev build start up down clean fclean re