"""
Gemini API integration for resume transformation.
Uses the google-genai SDK.
"""

import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-flash-latest")

client = genai.Client(api_key=GOOGLE_API_KEY)

async def transform_resume(
    resume_text: str, template_text: str, template_filename: str = ""
) -> str:
    """Use Gemini to fill template with resume data. Returns LaTeX string."""

    is_tex_template = template_filename.lower().endswith(".tex")

    if is_tex_template:
        prompt = f"""You are a resume formatting assistant. You are given:
1. RESUME CONTENT extracted from a user's current resume.
2. A LATEX TEMPLATE that defines the desired format.

Your job: Fill the LATEX TEMPLATE with the data from the RESUME CONTENT.
- Keep ALL LaTeX commands, structure, and formatting from the template.
- Replace placeholder text in the template with actual resume data.
- If the template has sections not in the resume, remove them.
- If the resume has data not fitting any template section, skip it.
- Output ONLY the complete, compilable LaTeX document.
- Do NOT wrap output in markdown code fences.
- Do NOT add ```latex or ``` markers.

=== RESUME CONTENT ===
{resume_text}

=== LATEX TEMPLATE ===
{template_text}

Output the filled LaTeX document now:"""
    else:
        prompt = f"""You are a resume formatting assistant. You are given:
1. RESUME CONTENT extracted from a user's current resume.
2. A TEMPLATE STRUCTURE extracted from a DOCX file that shows the desired format.

Your job: Create a complete, compilable LaTeX document that:
- Matches the visual structure and layout of the template.
- Contains all the data from the resume content.
- Uses standard LaTeX packages (geometry, enumitem, titlesec, hyperref).
- Output ONLY the complete, compilable LaTeX document.
- Do NOT wrap output in markdown code fences.
- Do NOT add ```latex or ``` markers.

=== RESUME CONTENT ===
{resume_text}

=== TEMPLATE STRUCTURE ===
{template_text}

Output the filled LaTeX document now:"""

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )
        result = response.text

    except Exception as e:
        print(f"Gemini API call failed: {e}")
        # Fallback to REST API if SDK fails
        try:
            import httpx
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={GOOGLE_API_KEY}"
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

    return result

