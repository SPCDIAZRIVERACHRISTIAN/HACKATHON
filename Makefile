.PHONY: setup rebuild migrate superuser start stop restart logs

setup: rebuild migrate ## Sets up development environment
	docker compose run client npm install

rebuild: ## Rebuilds the docker containers
	docker compose pull
	bash -c "docker compose build --build-arg UID=$$(id -u)"

migrate: ## Run Django migrations
	docker compose run server python manage.py migrate

superuser: ## Create a superuser
	docker compose run server python manage.py createsuperuser

start: ## Starts the docker containers
	@echo "[+] App is starting..."
	docker compose up -d
	@echo "[+] APP HOSTED AT ->  http://localhost:8000"

stop: ## Stops the docker containers
	@echo "[-] STOPPING APP..."
	docker compose down
	@echo "[-] APP Has been stopped"

restart: ## Restarts the docker containers
	@echo "[*] RESTARTING APP..."
	docker compose down
	@echo "[+] Botting app back up!"
	docker compose up -d --build

logs: ## Shows docker logs
	docker compose logs -f