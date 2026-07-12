from fastapi import HTTPException

from app.models.calculator_model import CalculationRequest, CalculationResponse
from app.services.calculator_service import evaluate_expression


def calculate_expression(payload: CalculationRequest) -> CalculationResponse:
    try:
        result = evaluate_expression(payload.expression)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return CalculationResponse(expression=payload.expression, result=result)
