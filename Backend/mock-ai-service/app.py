from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class RecommendRequest(BaseModel):
    category: str
    query: str
    top_n: int = 3

@app.post("/recommend")
def recommend(req: RecommendRequest):
    return [
        {
            "name": "Kawah Putih",
            "category": req.category,
            "rating": 4.6,
            "total_reviews": 12000,
            "semantic_similarity": 0.85,
            "final_score": 0.92
        },
        {
            "name": "Tangkuban Perahu",
            "category": req.category,
            "rating": 4.4,
            "total_reviews": 8000,
            "semantic_similarity": 0.78,
            "final_score": 0.85
        }
    ]

@app.get("/")
def health():
    return {"status": "ok"}