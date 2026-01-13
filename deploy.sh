#!/bin/bash

set -e

echo "Starting deployment..."

DOCKER_IMAGE_NAME="laporan-bank-api"
CONTAINER_NAME="laporan-bank-api"
APP_PORT=${APP_PORT:-3000}

if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

cleanup_container() {
    echo "Cleaning up old container..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
}

main() {
    echo "Building Docker image..."
    docker build -t $DOCKER_IMAGE_NAME:latest .
    
    if [ $? -ne 0 ]; then
        echo "ERROR: Docker build failed"
        exit 1
    fi
    
    echo "Build successful"
    
    cleanup_container
    
    echo "Starting new container..."
    
    if [ -f "docker-compose.yml" ]; then
        $DOCKER_COMPOSE up -d
    else
        docker run -d \
            --name $CONTAINER_NAME \
            --restart unless-stopped \
            -p $APP_PORT:3000 \
            --env-file .env \
            -v $(pwd)/uploads:/app/uploads \
            $DOCKER_IMAGE_NAME:latest
    fi
    
    if [ $? -ne 0 ]; then
        echo "ERROR: Container start failed"
        exit 1
    fi
    
    echo "Waiting for container to be ready..."
    sleep 5
    
    echo "Running database migrations..."
    docker exec $CONTAINER_NAME npm run migration:run || echo "WARNING: Migration might be already applied"
    
    echo "Checking application health..."
    sleep 5
    
    HEALTH_CHECK=$(docker exec $CONTAINER_NAME curl -f http://localhost:3000/api/v1/health 2>/dev/null || echo "failed")
    
    if [ "$HEALTH_CHECK" = "failed" ]; then
        echo "ERROR: Health check failed"
        docker logs $CONTAINER_NAME --tail 50
        exit 1
    fi
    
    echo "Health check passed"
    
    echo ""
    echo "Container Status:"
    docker ps -a | grep $CONTAINER_NAME
    
    echo ""
    echo "Deployment completed successfully"
    echo ""
    echo "Application is running at: http://localhost:$APP_PORT"
    echo "API Documentation: http://localhost:$APP_PORT/api/docs"
    echo ""
    echo "Useful commands:"
    echo "  - View logs: docker logs -f $CONTAINER_NAME"
    echo "  - Stop app: docker stop $CONTAINER_NAME"
    echo "  - Restart app: docker restart $CONTAINER_NAME"
    echo "  - Remove app: docker rm -f $CONTAINER_NAME"
}

main
