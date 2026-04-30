"""
LaTeX compilation proxy — sends LaTeX source to LaTeX.Online and returns PDF bytes.
"""

import urllib.parse
import httpx


async def compile_latex(latex_string: str) -> bytes:
    """Compile LaTeX to PDF using free online services."""

    errors = []

    # Method 1: LaTeX.Online via POST
    # Note: Using POST avoids URL length limits for long LaTeX code
    try:
        async with httpx.AsyncClient(timeout=150.0, follow_redirects=True) as client:
            resp = await client.post(
                "https://latexonline.cc/compile",
                data={"text": latex_string, "command": "pdflatex"}
            )

            if resp.status_code == 200 and resp.headers.get(
                "content-type", ""
            ).startswith("application/pdf"):
                return resp.content
            else:
                errors.append(f"latexonline.cc: status={resp.status_code}")
    except Exception as e:
        errors.append(f"latexonline.cc: {e}")

    # Method 2: ytotech LaTeX API (Fallback)
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

            if resp.status_code == 200 and len(resp.content) > 100:
                return resp.content
            else:
                errors.append(
                    f"ytotech: status={resp.status_code}"
                )
    except Exception as e:
        errors.append(f"ytotech: {e}")

    raise Exception(f"All LaTeX compilers failed: {'; '.join(errors)}. The online compilers might be down or your LaTeX code has errors.")
