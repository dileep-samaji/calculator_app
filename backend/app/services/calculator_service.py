import ast
import operator


_ALLOWED_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
}


def evaluate_expression(expression: str) -> float | int:
    cleaned_expression = " ".join(expression.split())
    if not cleaned_expression:
        raise ValueError("Expression cannot be empty")

    try:
        tree = ast.parse(cleaned_expression, mode="eval")
    except SyntaxError as exc:
        raise ValueError("Invalid expression") from exc

    def _eval(node):
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return node.value

        if isinstance(node, ast.BinOp) and type(node.op) in _ALLOWED_OPERATORS:
            left = _eval(node.left)
            right = _eval(node.right)
            return _ALLOWED_OPERATORS[type(node.op)](left, right)

        if isinstance(node, ast.UnaryOp) and type(node.op) in _ALLOWED_OPERATORS:
            operand = _eval(node.operand)
            return _ALLOWED_OPERATORS[type(node.op)](operand)

        raise ValueError("Only basic arithmetic operations are supported")

    result = _eval(tree.body)

    if isinstance(result, float) and result.is_integer():
        return int(result)

    return result
