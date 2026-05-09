"""
Gemini API integration for resume transformation.
Uses the google-genai SDK.
"""

import os
from dotenv import load_dotenv
from google import genai

async def transform_resume(
    resume_text: str, template_text: str, template_filename: str = ""
) -> str:
    """Use Gemini to fill template with resume data. Returns LaTeX string."""
    load_dotenv(override=True)
    google_api_key = os.getenv("GOOGLE_API_KEY")
    model_name = os.getenv("MODEL_NAME", "gemini-flash-latest")
    
    client = genai.Client(api_key=google_api_key)

    is_tex_template = template_filename.lower().endswith(".tex")

    if is_tex_template:
        prompt = f"""You are an expert LaTeX and resume formatting assistant. You are given:
1. RESUME CONTENT extracted from a user's current resume.
2. A LATEX TEMPLATE that defines the desired format.

Your job: Fill the LATEX TEMPLATE with the data from the RESUME CONTENT.

CRITICAL RULES:
- YOU MUST NOT CHANGE any commands, macros, packages, lengths, variables, spacing, widths, line heights, margins, font sizes, or formatting definitions from the template.
- Treat commands and definitions near the top of the template (for example custom section commands, line-height settings, width values, geometry, spacing, and header/footer definitions) as locked. Copy them exactly.
- Only replace placeholder/resume content and place the extracted information into the matching sections neatly.
- Do not rename commands, remove commands, simplify commands, or rewrite the template structure unless the document cannot compile without that exact minimal fix.
- If the template uses a custom class like \\documentclass{{resume}}, convert it ONLY to \\documentclass{{article}} if it's necessary for compilation, but INLINE any required styling so the layout remains EXACT.
- Place the extracted resume text into the corresponding sections of the template.
- ESCAPE special LaTeX characters in the data (e.g., replace '&' with '\\&', '%' with '\\%', '$' with '\\$', '_' with '\\_').
- Ensure the output is a COMPLETE, COMPILABLE LaTeX document.
- Output ONLY the raw LaTeX code without markdown fences.

=== RESUME CONTENT ===
{resume_text}

=== LATEX TEMPLATE ===
{template_text}

Output the filled LaTeX document now:"""
    else:
        prompt = f"""You are an expert LaTeX and resume formatting assistant. You are given:
1. RESUME CONTENT extracted from a user's current resume.
2. A TEMPLATE STRUCTURE extracted from a DOCX file that shows the desired format.

Your job: Create a complete, compilable LaTeX document that matches the EXACT visual structure and formatting of the template.

CRITICAL RULES:
- DO NOT change any commands, margins, font sizes, spacing variables, line heights, widths, section definitions, or top-level formatting values from the template structure.
- Treat any commands or layout definitions at the top as locked; keep them as-is and only place the resume information into the appropriate locations neatly.
- Use standard packages: geometry, enumitem, titlesec, hyperref, fontawesome5.
- ESCAPE special LaTeX characters in the data (e.g., replace '&' with '\\&', '%' with '\\%', '$' with '\\$', '_' with '\\_').
- The document MUST start with \\documentclass and end with \\end{{document}}.
- Output ONLY the raw LaTeX code.

=== RESUME CONTENT ===
{resume_text}

=== TEMPLATE STRUCTURE ===
{template_text}

Output the filled LaTeX document now:"""

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
        )
        result = response.text

    except Exception as e:
        print(f"Gemini API call failed: {e}")
        # Fallback to REST API if SDK fails
        try:
            import httpx
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={google_api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.2},
            }
            async with httpx.AsyncClient(timeout=120.0) as http_client:
                resp = await http_client.post(url, json=payload)
                if resp.status_code != 200:
                    raise Exception(f"Gemini REST API error {resp.status_code}: {resp.text}")
                data = resp.json()
                result = data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e_inner:
            raise Exception(f"All Gemini API methods failed. Error: {e_inner}")

    # Clean up markdown fences if Gemini added them
    result = result.strip()
    if result.startswith("```latex"):
        result = result[len("```latex") :].strip()
    elif result.startswith("```"):
        result = result[3:].strip()
    
    if result.endswith("```"):
        result = result[:-3].strip()

    # Basic post-processing: escape & if not already escaped
    # Simple regex-less check for common resume characters
    # (In a production app, we'd use a more robust LaTeX parser/escaper)
    import re
    # Match & that is not preceded by \
    result = re.sub(r'(?<!\\)&', r'\&', result)

    return result

