from fastapi import APIRouter

from app.controllers.calculator_controller import calculate_expression
from app.models.calculator_model import CalculationRequest

router = APIRouter()


@router.post("/calculate")
def calculate(payload: CalculationRequest):
    return calculate_expression(payload)


@router.get("/health")
def health_check():
    return {"status": "ok"}
