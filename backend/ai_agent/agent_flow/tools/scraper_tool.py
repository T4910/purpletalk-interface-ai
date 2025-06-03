from typing import Type
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import asyncio
import os
from crawl4ai import AsyncWebCrawler, BrowserConfig
from crawl4ai.async_configs import CrawlerRunConfig
from dotenv import load_dotenv

load_dotenv()


async def main(url: str) -> str:
    # Retrieve proxy credentials from environment variables
    proxy_username = os.environ.get("PROXY_USERNAME")
    proxy_password = os.environ.get("PROXY_PASSWORD")
    proxy_host = os.environ.get("PROXY_HOST")
    proxy_port = os.environ.get("PROXY_PORT")

    # Construct the proxy URL
    from crawl4ai import ProxyConfig

    proxy_config = ProxyConfig(
        server=f"{proxy_host}:{proxy_port}",
        username=proxy_username,
        password=proxy_password,
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
    description: str = "This tool takes in a url scrapes it and then returns results on the content of the url."
    args_schema: Type[BaseModel] = ScraperToolInput

    def _run(self, url: str) -> str:
        scraped_content = asyncio.run(main(url))

        endpoint = os.getenv("AZURE_ENDPOINT")
        model_name = os.getenv("MODEL_NAME")
        api = os.getenv("AZURE_API")

        client = ChatCompletionsClient(
            endpoint=endpoint,
            credential=AzureKeyCredential(api),
            api_version="2024-05-01-preview",
        )

        response = client.complete(
            messages=[
                SystemMessage(
                    content="You are a helpful assistant. You are are going to receive scraped data from the user, your job is to streamline the scraped data showing inportant info (e.g property info .. etc) "
                ),
                UserMessage(content=f"Help me streamline {scraped_content}"),
            ],
            model=model_name,
        )

        return response.choices[0].message.content
