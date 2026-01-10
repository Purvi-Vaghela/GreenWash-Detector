import httpx
from typing import List, Dict

async def search_news(company_name: str, api_key: str) -> str:
    """Search for environmental news about a company using Serper.dev API."""
    
    if not api_key:
        return "No external news data available (API key not configured)."
    
    url = "https://google.serper.dev/search"
    
    queries = [
        f"{company_name} environmental violations news",
        f"{company_name} pollution fines",
        f"{company_name} sustainability controversy",
    ]
    
    all_results = []
    
    async with httpx.AsyncClient() as client:
        for query in queries:
            try:
                response = await client.post(
                    url,
                    headers={"X-API-KEY": api_key, "Content-Type": "application/json"},
                    json={"q": query, "num": 5},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    organic = data.get("organic", [])
                    
                    for item in organic[:3]:
                        all_results.append({
                            "title": item.get("title", ""),
                            "snippet": item.get("snippet", ""),
                            "link": item.get("link", ""),
                        })
            except Exception as e:
                print(f"News search error: {e}")
                continue
    
    if not all_results:
        return "No relevant news articles found for this company."
    
    # Format results for the prompt
    formatted = []
    for i, result in enumerate(all_results[:10], 1):
        formatted.append(f"{i}. {result['title']}\n   {result['snippet']}\n   Source: {result['link']}")
    
    return "\n\n".join(formatted)
