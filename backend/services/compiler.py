"""
LaTeX compilation proxy - sends LaTeX source to online compilers and returns PDF bytes.
"""

import httpx


def _is_pdf_response(resp: httpx.Response) -> bool:
    content_type = resp.headers.get("content-type", "").lower()
    return resp.content.startswith(b"%PDF-") or content_type.startswith("application/pdf")


async def compile_latex(latex_string: str) -> bytes:
    """Compile LaTeX to PDF using free online services."""

    errors = []

    # LaTeX.Online expects the source in the text query parameter.
    try:
        async with httpx.AsyncClient(timeout=150.0, follow_redirects=True) as client:
            resp = await client.get(
                "https://latexonline.cc/compile",
                params={"text": latex_string, "command": "pdflatex", "force": "true"},
            )

            if 200 <= resp.status_code < 300 and _is_pdf_response(resp):
                return resp.content

            error_text = resp.text[:800].replace("\n", " ")
            errors.append(f"latexonline.cc: status={resp.status_code}, body={error_text}")
    except Exception as e:
        errors.append(f"latexonline.cc: {e}")

    # Fallback service.
    try:
        async with httpx.AsyncClient(timeout=150.0, follow_redirects=True) as client:
            payload = {
                "compiler": "pdflatex",
                "resources": [{"main": True, "content": latex_string}],
            }
            resp = await client.post(
                "https://latex.ytotech.com/builds/sync",
                json=payload,
            )

            if 200 <= resp.status_code < 300 and _is_pdf_response(resp):
                return resp.content

            error_text = resp.text[:800].replace("\n", " ")
            errors.append(f"ytotech: status={resp.status_code}, body={error_text}")
    except Exception as e:
        errors.append(f"ytotech: {e}")

    raise Exception(
        "All LaTeX compilers failed: "
        f"{'; '.join(errors)}. The online compilers might be down or your LaTeX code has errors."
    )
