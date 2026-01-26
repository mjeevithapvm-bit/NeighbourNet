"""
FastAPI application entry point.
- Includes routers from the `routes` package.
- All endpoints are JSON REST APIs (no HTML rendering here).
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.routes import user_routes, product_routes, service_routes, loan_routes, complaint_routes, emergency_routes, product_offer_routes

# Create app
app = FastAPI(title="NeighbourNet 2.0 - Prototype")

repo_root = Path(__file__).resolve().parents[1].parent
frontend_dir = repo_root / "frontend"

# Allow requests from local frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000", "http://localhost:8000", "http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers under /api
app.include_router(user_routes.router, prefix="/api/users")
app.include_router(product_routes.router, prefix="/api/products")
app.include_router(product_offer_routes.router, prefix="/api/product-offers")
app.include_router(service_routes.router, prefix="/api/services")
app.include_router(loan_routes.router, prefix="/api/loans")
app.include_router(complaint_routes.router, prefix="/api/complaints")
app.include_router(emergency_routes.router, prefix="/api/emergencies")


@app.get("/migrate")
def migrate_database():
    """Run database migrations"""
    try:
        from app.database import get_connection
        conn = get_connection()
        cursor = conn.cursor()

        # Create product_offers table if it doesn't exist
        create_offers_table = """
        CREATE TABLE IF NOT EXISTS product_offers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT NOT NULL,
          provider_id INT NOT NULL,
          status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_offer (product_id, provider_id)
        );
        """

        cursor.execute(create_offers_table)
        conn.commit()
        cursor.close()
        conn.close()

        return {"message": "Database migration completed successfully"}
    except Exception as e:
        return {"error": str(e)}


# Now mount the static frontend so the API routes above are matched first.
if frontend_dir.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")
else:
    print(f"Warning: frontend folder not found at {frontend_dir}")
