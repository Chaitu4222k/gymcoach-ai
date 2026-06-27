from fastapi import FastAPI

app = FastAPI(
    title="GymCoach AI Service",
    version="1.0.0"
)


@app.get("/")
def health():
    return {
        "status": "healthy",
        "service": "GymCoach AI Service"
    }