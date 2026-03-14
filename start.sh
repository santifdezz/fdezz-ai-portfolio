#!/bin/bash

# fdezz AI Terminal Portfolio — Docker Launcher

set -e

echo "🚀 Starting fdezz AI Terminal Portfolio..."
echo ""

# Check if docker is installed
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker."
  exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo "❌ Docker Compose is not installed. Please install Docker Compose."
  exit 1
fi

# Parse arguments
MODE="${1:-dev}"

case "$MODE" in
  dev)
    echo "📦 Starting in development mode..."
    echo "   Port: http://localhost:3000"
    echo "   Hot reload: enabled"
    echo ""
    docker-compose up
    ;;
  dev-build)
    echo "🔨 Building and starting in development mode..."
    docker-compose up --build
    ;;
  prod)
    echo "🔒 Starting in production mode..."
    echo "   Port: http://localhost:3000"
    echo ""
    docker-compose -f docker-compose.prod.yml up -d
    echo "✅ Production container started (detached)"
    echo "   View logs: docker-compose -f docker-compose.prod.yml logs -f"
    ;;
  build)
    echo "🏗️  Building production image..."
    docker-compose -f docker-compose.prod.yml build
    echo "✅ Production image built"
    ;;
  stop)
    echo "⏹️  Stopping containers..."
    docker-compose down
    echo "✅ Containers stopped"
    ;;
  clean)
    echo "🧹 Cleaning Docker artifacts..."
    docker-compose down -v
    rm -rf .next node_modules
    echo "✅ Clean complete"
    ;;
  logs)
    echo "📜 Showing logs..."
    docker-compose logs -f web
    ;;
  *)
    echo "Usage: $0 [dev|dev-build|prod|build|stop|clean|logs]"
    echo ""
    echo "  dev         - Start development server"
    echo "  dev-build   - Rebuild and start development"
    echo "  prod        - Start production (background)"
    echo "  build       - Build production image"
    echo "  stop        - Stop containers"
    echo "  clean       - Remove all Docker artifacts"
    echo "  logs        - View container logs"
    exit 1
    ;;
esac
