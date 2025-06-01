import os
import json
import asyncio
from crawl4ai import (
    AsyncWebCrawler,
    CrawlerRunConfig,
    LLMExtractionStrategy,
    LLMConfig,
    ProxyConfig,
    BrowserConfig,
    CacheMode,
)
from urllib.parse import urlparse
from pydantic import BaseModel, Field
from typing import List, Optional


# Define the data model for extraction using Pydantic
class PropertyListing(BaseModel):
    location: Optional[str] = Field(None, description="The location of the house")
    image_url: Optional[str] = Field(None, description="Image of the house as scraped")
    details_url: Optional[str] = Field(
        None, description="URL to page to find more info on the house"
    )
    description: Optional[str] = Field(None, description="Description of the house")
    title: Optional[str] = Field(None, description="Title given to the house")
    bedroom: Optional[int] = Field(None, description="Number of bedrooms")
    bathrooms: Optional[int] = Field(None, description="Number of bathrooms")
    price: Optional[str] = Field(None, description="Price of the property")
    listing: Optional[str] = Field(None, description="When the house was listed")
    phonenumber: Optional[str] = Field(None, description="Phone number of the agent")
    amenities: Optional[List[str]] = Field(
        None, description="List of amenities like swimming pool, parking, etc."
    )
    property_type: Optional[str] = Field(
        None, description="Type of property (house/apartment/land)"
    )


# Retrieve proxy credentials from environment variables
proxy_username = os.environ.get("PROXY_USERNAME")
proxy_password = os.environ.get("PROXY_PASSWORD")
proxy_host = os.environ.get("PROXY_HOST")
proxy_port = os.environ.get("PROXY_PORT")


async def extract_listing_data(url: str) -> List[PropertyListing]:
    """
    Extract property listing data from the given URL using LLMExtractionStrategy.

    Args:
        url (str): The URL of the property listing page.

    Returns:
        List[PropertyListing]: A list of extracted property listings.
    """

    # Construct the proxy configuration

    proxy_config = ProxyConfig(
        username=proxy_username,
        password=proxy_password,
        server=f"{proxy_host}:{proxy_port}",
    )

    print(proxy_config)
    # Browser configuration with proxy
    browser_config = BrowserConfig(
        headless=True,
        proxy_config=proxy_config,
    )

    # Configure LLM
    llm_config = LLMConfig(
        provider=os.environ.get("OPENAI_MODEL_NAME"),
        api_token=os.environ.get("OPENAI_API_KEY"),
    )

    # Define the extraction strategy
    extraction_strategy = LLMExtractionStrategy(
        llm_config=llm_config,
        schema=PropertyListing.model_json_schema(),
        extraction_type="schema",
        instruction="Extract property listings with the specified fields.",
    )

    # Crawler run configuration
    run_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        extraction_strategy=extraction_strategy,
        wait_until="domcontentloaded",
        page_timeout=180000,
        # screenshot=True
    )

    # Perform the extraction
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url, config=run_config)

    if not result.success:
        raise ValueError(f"Failed to extract data from {url}: {result.error_message}")

    try:
        extracted_data = json.loads(result.extracted_content)
        listings = [PropertyListing(**item) for item in extracted_data]
    except Exception as e:
        raise ValueError(f"Failed to parse extracted content: {e}")

    return listings


def extract_listing_data_sync(url: str) -> List[PropertyListing]:
    """
    Synchronous wrapper for the asynchronous extract_listing_data function.

    Args:
        url (str): The URL of the property listing page.

    Returns:
        List[PropertyListing]: A list of extracted property listings.
    """
    return asyncio.run(extract_listing_data(url))
