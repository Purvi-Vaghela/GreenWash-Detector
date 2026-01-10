import json
import re
from openai import AsyncOpenAI
from ..prompts import MASTER_SYSTEM_PROMPT, build_analysis_prompt
from ..models import AnalysisResult

async def analyze_with_ai(pdf_text: str, news_data: str, api_key: str) -> AnalysisResult:
    """
    Send the PDF text and news data to GPT-4o for ESG forensic analysis.
    
    The AI calculates Trust Score using: T = (0.40 × S) + (0.35 × C) + (0.25 × V)
    Where S=Specificity, C=Consistency, V=Verification
    """
    
    client = AsyncOpenAI(api_key=api_key)
    
    user_prompt = build_analysis_prompt(pdf_text, news_data)
    
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": MASTER_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.2,
        max_tokens=2500,
        response_format={"type": "json_object"}
    )
    
    content = response.choices[0].message.content.strip()
    
    # Clean up markdown code blocks if present
    if content.startswith("```"):
        content = re.sub(r'^```(?:json)?\n?', '', content)
        content = re.sub(r'\n?```$', '', content)
    
    # Parse JSON
    try:
        result_dict = json.loads(content)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse AI response as JSON: {e}\nResponse: {content[:500]}") from e
    
    # Validate and recalculate the scoring formula
    scores = result_dict.get("scores", {})
    s = scores.get("specificity", 0)
    c = scores.get("consistency", 0)
    v = scores.get("verification", 0)
    
    # T_score = (0.40 × S) + (0.35 × C) + (0.25 × V)
    calculated_score = round((0.40 * s) + (0.35 * c) + (0.25 * v), 1)
    scores["final_trust_score"] = calculated_score
    
    # Traffic light based on score thresholds
    if calculated_score < 40:
        scores["traffic_light"] = "RED"
    elif calculated_score < 75:
        scores["traffic_light"] = "YELLOW"
    else:
        scores["traffic_light"] = "GREEN"
    
    result_dict["scores"] = scores
    
    return AnalysisResult(**result_dict)
