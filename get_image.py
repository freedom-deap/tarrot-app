import requests
from bs4 import BeautifulSoup
import draw
import re
import os
import urllib

ROOT_URL = "https://ja.wikipedia.org/wiki/%E3%82%BF%E3%83%AD%E3%83%83%E3%83%88"

html = requests.get(ROOT_URL)
html_content = BeautifulSoup(html.content, "html.parser")

for b_tag in html_content.find_all("b"):
    if b_tag.text and \
        (re.fullmatch(r"[IVX]+", b_tag.text.split()[0]) or
        b_tag.text.split()[0] == "0"):
        print(b_tag.text)
        print(b_tag.a.get("href"))
        html = requests.get(
            "https://ja.wikipedia.org" +
            b_tag.a.get("href")
        )
        html_content = BeautifulSoup(html.content, "html.parser")
        image_url = "https:" + html_content.find("img", class_="thumbimage").get("src")
        response = requests.get(image_url, allow_redirects=False)
        # print(image_url)
        # print(response.status_code)
        # print(response.content)
        if response.status_code != 200:
            i = 0
            while(response.status_code != 200):
                print("%s回目" % str(++i))
                response = requests.get(image_url, allow_redirects=False)

        content_type = response.headers["content-type"]
        if 'image' not in content_type:
            e = Exception("Content-Type: " + content_type)
            raise e
        filepath = os.path.join("img", image_url.split("/")[-1].replace("220px-", ""))
        with open(filepath, "wb") as f:
            f.write(response.content)
        print(filepath)
    # if b_tag.text and \
    #    re.fullmatch(r"[12]*[0-9]", b_tag.text.split()[0]) or \
    #    b_tag.text.split()[0].isnumeric():
    #     print(b_tag)
