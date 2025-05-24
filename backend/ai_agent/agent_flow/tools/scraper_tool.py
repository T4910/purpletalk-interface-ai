from typing import Type

from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import asyncio
import os
from crawl4ai import AsyncWebCrawler,BrowserConfig
from crawl4ai.async_configs import CrawlerRunConfig


async def main(url: str) -> str:
        # Retrieve proxy credentials from environment variables
        proxy_username = "brd-customer-hl_1f8d9bef-zone-web_unlocker1"
        proxy_password = "r5kcre6hey8j"
        proxy_host = "brd.superproxy.io"
        proxy_port = 33335

        # Construct the proxy URL
        from crawl4ai import ProxyConfig

        proxy_config = ProxyConfig(
            server="brd.superproxy.io:33335",
            username="brd-customer-hl_1f8d9bef-zone-web_unlocker1",
            password="r5kcre6hey8j"
        )

        # Browser configuration
        browser_config = BrowserConfig(
            headless=True,
            proxy_config=proxy_config,
        )
        # Configure the crawler to use the proxy
        config = CrawlerRunConfig()

        # Initialize and run the crawler
        async with AsyncWebCrawler(config=browser_config) as crawler:
            result = await crawler.arun(url=url, config=config)
            return result.markdown



class ScraperToolInput(BaseModel):
    """Input schema for ScraperTool."""

    url: str = Field(..., description="The url of the website you want to scrape")


class ScraperTool(BaseTool):
    name: str = "Scraper tool"
    description: str = (
        "This tool takes in a url scrapes it and then returns results on the content of the url."
    )
    args_schema: Type[BaseModel] = ScraperToolInput



    def _run(self,url: str) -> str:
       scraped_content = asyncio.run(main(url))
       return scraped_content

