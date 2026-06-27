import requests
import json
import pandas as pd
from bs4 import BeautifulSoup

dataset_id = "d_b3ae090692ecf632116c9885cfbd3424"
url = "https://api-open.data.gov.sg/v1/public/api/datasets/" + dataset_id + "/poll-download"

response = requests.get(url)
json_data = response.json()
if json_data['code'] != 0:
    print(json_data['errMsg'])
    exit(1)

url = json_data['data']['url']
response = requests.get(url)
geojson = json.loads(response.text)

# Parse each gym into a clean dictionary
gyms = []
for feature in geojson["features"]:
    # Get coordinates
    lon, lat = feature["geometry"]["coordinates"][:2]
    
    # Parse the HTML description
    soup = BeautifulSoup(feature["properties"]["Description"], "html.parser")
    rows = soup.find_all("tr")
    
    gym = {"latitude": lat, "longitude": lon}
    for row in rows:
        cols = row.find_all("td")
        if len(cols) == 2:
            key = row.find("th").text.strip()
            value = cols[1].text.strip()
            gym[key] = value
    
    gyms.append(gym)

# Display as a table
df = pd.DataFrame(gyms)
print(df.to_string())