# Simple runner for the FastAPI app (development only)
# Run: python run.py

import uvicorn

if __name__ == "__main__":
    # Default host/port for local testing
    host = "127.0.0.1"
    port = 8000
    print(f"Starting NeighbourNet backend + frontend at http://{host}:{port}/")
    print("API docs available at http://127.0.0.1:8000/docs")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
