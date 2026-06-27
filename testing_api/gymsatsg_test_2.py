import requests
import json

dataset_id = "d_b3ae090692ecf632116c9885cfbd3424"
url = "https://api-open.data.gov.sg/v1/public/api/datasets/" + dataset_id + "/poll-download"

response = requests.get(url)
json_data = response.json()
if json_data['code'] != 0:
    print(json_data['errMsg'])
    exit(1)

url = json_data['data']['url']
response = requests.get(url)

# Parse the GeoJSON
geojson = json.loads(response.text)

# Look at just the first gym
first_gym = geojson["features"][0]
print("Coordinates:", first_gym["geometry"]["coordinates"])
print("Description HTML:", first_gym["properties"]["Description"])