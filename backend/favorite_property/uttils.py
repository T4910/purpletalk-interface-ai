import asyncio
import os
from crawl4ai import AsyncWebCrawler
# from crawl4ai.async_configs import CrawlerRunConfig
from dotenv import load_dotenv
from crawl4ai.extraction_strategy import JsonXPathExtractionStrategy
from crawl4ai import LLMConfig
import json
from urllib.parse import urlparse
from pathlib import Path
from crawl4ai import (
    RegexExtractionStrategy,
    BrowserConfig,
    CrawlerRunConfig,
    ProxyConfig
)

load_dotenv()

# Retrieve proxy credentials from environment variables
proxy_username = os.environ.get('PROXY_USERNAME')
proxy_password = os.environ.get('PROXY_PASSWORD')
proxy_host = os.environ.get('PROXY_HOST')
proxy_port = os.environ.get('PROXY_PORT')

# OpenAI envs
openai_key = os.environ.get('OPENAI_API_KEY')
openai_model = os.environ.get('OPENAI_MODEL_NAME')

# Construct the proxy URL
proxy_config = ProxyConfig(
    server=f"{proxy_host}:{proxy_port}",
    username=proxy_username,
    password=proxy_password
)

# Browser configuration
browser_config = BrowserConfig(
    headless=True,
    proxy_config=proxy_config,
)
# Configure the crawler to use the proxy

config = CrawlerRunConfig(js_code=True)

def get_host_from_url(url):
    parsed_url = urlparse(url)
    host = parsed_url.netloc
    return host.replace('.', '-')

def scrape_and_store(user, url):
    print(user)
    print(url)

# def _run(self,url: str) -> str:
#     scraped_content = asyncio.run(main(url))
#     return scraped_content

# async def main(url: str) -> str:
#         # Initialize and run the crawler
#         async with AsyncWebCrawler(config=browser_config) as crawler:
#             result = await crawler.arun(url=url, config=config)
#             html = result.fit_html
#             # result.markdown

#         xpath_schema = JsonXPathExtractionStrategy.generate_schema(
#             html,
#             schema_type="xpath",
#             llm_config = LLMConfig(provider="ollama/llama3.3", api_token=None)  # Not needed for Ollama
#         )

#         strategy = JsonXPathExtractionStrategy(xpath_schema)


async def extract_with_generated_pattern(url: str):
    host = get_host_from_url(url)
    pattern_file = Path(f"./pattern_cache/{host}_price_pattern.json")

    # 1. Generate or load pattern
    if pattern_file.exists():
        pattern = json.load(pattern_file.open())
        return pattern
        print(f"Using cached pattern: {pattern}")
    else:
        print("Generating pattern via LLM...")
        cache_dir = Path("./pattern_cache")
        cache_dir.mkdir(exist_ok=True)
        new_pattern_file = cache_dir / f"{host}_price_pattern.json"

        # Configure LLM
        llm_config = LLMConfig(provider="ollama/llama3.3", api_token=None)
        # (
        #     provider=openai_model,
        #     api_token=openai_key
        # )

        # Get sample HTML for context
        async with AsyncWebCrawler() as crawler:
            result = await crawler.arun(url)
            html = result.fit_html

        # Generate pattern (one-time LLM usage)
        pattern = RegexExtractionStrategy.generate_pattern(
            label="price",
            html=html,
            query="Product prices in USD format",
            llm_config=llm_config,
        )

        # Cache pattern for future use
        json.dump(pattern, new_pattern_file.open("w"), indent=2)
        return pattern

    # 2. Use pattern for extraction (no LLM calls)
    strategy = RegexExtractionStrategy(custom=pattern)
    config = CrawlerRunConfig(extraction_strategy=strategy)

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://example.com/products",
            config=config
        )

        if result.success:
            data = json.loads(result.extracted_content)
            for item in data[:10]:
                print(f"Extracted: {item['value']}")
            print(f"Total matches: {len(data)}")

# asyncio.run(extract_with_generated_pattern())
extract_with_generated_pattern('https://www.jamesedition.com/vacation-rentals/marbella-spain/award-winning-luxury-property-agency-exceptional-frontline-beach-villa-with-breathtaking-sea-views-15494011')