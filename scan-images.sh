# Docker Configuration for Music Service

## Prerequisites
- Docker installed
- Docker Compose installed
- Docker Hub account (for image publishing)

## Quick Start

1. **Copy environment configuration:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your credentials.

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - API: http://localhost:4000
   - PostgreSQL: localhost:5432

## Building Images Separately

### Build application image:
```bash
docker build -t music-service-app .
```

### Build PostgreSQL image:
```bash
docker build -f Dockerfile.postgres -t music-service-postgres .
```

## Vulnerability Scanning

Run security scan on images:
```bash
chmod +x scan-images.sh
./scan-images.sh
```

Or manually:
```bash
docker scan music-service-app:latest
docker scan music-service-postgres:latest
```

## Publishing to Docker Hub

1. **Login to Docker Hub:**
   ```bash
   docker login
   ```

2. **Tag your images:**
   ```bash
   docker tag music-service-app:latest <your-dockerhub-username>/music-service-app:latest
   docker tag music-service-postgres:latest <your-dockerhub-username>/music-service-postgres:latest
   ```

3. **Push images:**
   ```bash
   docker push <your-dockerhub-username>/music-service-app:latest
   docker push <your-dockerhub-username>/music-service-postgres:latest
   ```

## Useful Commands

- **View logs:**
  ```bash
  docker-compose logs -f
  ```

- **Stop services:**
  ```bash
  docker-compose down
  ```

- **Stop and remove volumes:**
  ```bash
  docker-compose down -v
  ```

- **Access PostgreSQL console:**
  ```bash
  docker exec -it music-service-postgres psql -U postgres -d music_service
  ```

## Notes

- Database data is persisted in Docker volume `postgres_data`
- Application logs are stored in `./logs` directory
- Network `music-service-network` is created for container communication
