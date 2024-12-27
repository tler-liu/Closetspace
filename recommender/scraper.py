import asyncio
import json
from typing import Dict, List
from urllib.parse import parse_qs, urlencode, urlparse
import os
from dotenv import load_dotenv

from nested_lookup import nested_lookup
from scrapfly import ScrapeConfig, ScrapflyClient, ScrapeApiResponse

import pickle

load_dotenv()
SCRAPFLY_KEY = os.getenv('SCRAPFLY_API')

SCRAPFLY = ScrapflyClient(key=SCRAPFLY_KEY)


def find_hidden_data(result: ScrapeApiResponse) -> dict:
    """extract hidden web cache from page html"""
    # use XPath to find script tag with data
    data = result.selector.xpath("//script[contains(.,'__INITIAL_CONFIG__')]/text()").get()
    data = data.split("=", 1)[-1].strip().strip(";")
    data = json.loads(data)
    return data


def update_url_parameter(url, **params):
    """update url query parameter of an url with new values"""
    current_params = parse_qs(urlparse(url).query)
    updated_query_params = urlencode({**current_params, **params}, doseq=True)
    return url[: url.find("?")] + "?" + updated_query_params


async def scrape_search(url: str, max_pages: int = 10) -> List[Dict]:
    """Scrape StockX search"""
    print(f"scraping first search page: {url}")
    first_page = await SCRAPFLY.async_scrape(
        ScrapeConfig(
            url=url,
            country="US",
            asp=True,
            debug=True,
            cache=True,
        )
    )
    # parse first page for product search data and total amount of pages:
    data = find_hidden_data(first_page)
    _first_page_results = nested_lookup("productResults", data)[0]
    products = list(_first_page_results["productsById"].values())
    paging_info = _first_page_results["query"]
    total_pages = paging_info['pageCount']

    if max_pages and max_pages < total_pages:
        total_pages = max_pages

    # then scrape other pages concurrently:
    print(f"  scraping remaining {total_pages - 1} search pages")
    _other_pages = [
        ScrapeConfig(
            url=update_url_parameter(url, page=page),
            country="US",
            asp=True,
        )
        for page in range(2, total_pages + 1)
    ]
    async for result in SCRAPFLY.concurrent_scrape(_other_pages):
        data = find_hidden_data(result)
        data = nested_lookup("productResults", data)[0]
        products.extend(list(data["productsById"].values()))
    return products


products = asyncio.run(scrape_search("https://www.nordstrom.com/sr?origin=keywordsearch&keyword=shorts", max_pages=5))
print(products)
with open('shorts.pkl', 'wb') as file:
    pickle.dump(products, file)