from pydantic import BaseModel, Field


class CalculationRequest(BaseModel):
    expression: str = Field(..., min_length=1, description="Arithmetic expression to evaluate")


class CalculationResponse(BaseModel):
    expression: str
    result: float | int
