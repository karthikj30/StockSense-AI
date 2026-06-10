from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def indicators_health():
    return {"status": "indicators ready"}
