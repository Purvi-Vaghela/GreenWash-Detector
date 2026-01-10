import json
import re
from openai import AsyncOpenAI
from ..prompts import MASTER_SYSTEM_PROMPT, build_analysis_prompt
from ..models import AnalysisResult

async def analyze_with_ai(pdf_text: str, news_data: str, api_key: str) -> AnalysisResult:
    """Send the PDF text and news data to GPT-4o for analysis."""
    
    client = AsyncOpenAI(api_key=api_key)
    
    user_prompt = build_analysis_prompt(pdf_text, news_data)
    
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": MASTER_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.3,
        max_tokens=2000,
    )
    
    content = response.choices[0].message.content.strip()
    
    # Clean up the response - remove markdown code blocks if present
    if content.startswith("```"):
        content = re.sub(r'^```(?:json)?\n?', '', content)
        content = re.sub(r'\n?```$', '', content)
    
    # Parse JSON
    try:
        result_dict = json.loads(content)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse AI response as JSON: {e}\nResponse: {content[:500]}")
    
    # Validate and return
    return AnalysisResult(**result_dict)
