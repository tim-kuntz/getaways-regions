# getaways-regions
Tool used to see what regions Getaways deals are associated with and experiment with region changes.

Uses [Leaflet](https://leafletjs.com/) for render and working with the map.

## running
It's a single page app so run any local web server you want serving this repository and open the index.html page; for example,

```
git clone git@github.com:timkuntz/getaways-regions.git
cd getaways-regions
python3 -m http.server
```
http://localhost:8000/index.html

## data

The [regions.json](https://github.com/timkuntz/getaways-regions/blob/main/data/regions.json) is manually curated to correspond to the Getaways navigation.

The [getaways.json](https://github.com/timkuntz/getaways-regions/blob/main/data/getaways.json) is pulled directly from the production ElasticSearch instance using the following query.

```
curl --location --request POST 'http://localhost:9200/deals-read/_search' \
--header 'Authorization: Basic <secret> \
--header 'Content-Type: application/json' \
--data-raw '{
    "from": 0,
    "size": 1062,
    "query": {
        "term": {
            "dealOptions.inventoryServiceId": {
                "value": "getaways"
            }
        }
    },
    "_source": [
        "uuid",
        "permalink",
        "locations.geoPoint",
        "locations.geoTaxonomy.places.placeTree"
    ]
}'
```

## functionality

* Regions show as standard markers of different colors
* Deals show as circles of the same color of the region they are associated with (see below)
* Clicking the regions or deals will show a popup with a permalink and lat/lng data
* The region markers are draggable and will update the deals after moving
* The deals are of 2 colors
    * the inner color shows the region the deal is a associated with in the system and never changes
    * the border color shows the region the deal would be likely be associated with after changing the region lat/lng

