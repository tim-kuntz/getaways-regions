const GETAWAYS_URL = "./data/getaways-compact.json";

export default async function loadDeals(regions) {
  const requestDeals = new Request(GETAWAYS_URL);
  const responseDeals = await fetch(requestDeals);
  return reformatDeals(await responseDeals.json(), regions);
}

function reformatDeals(json, regions) {
  let deals = json.hits.hits.
    map(deal => deal._source).
    map(deal => ({
      permalink: deal.permalink,
      uuid: deal.uuid,
      geoPoint: {
        latitude: deal.locations[0].geoPoint.lat,
        longitude: deal.locations[0].geoPoint.lon
      },
      region: lookupRegion(extractRegion(deal), regions)
    }))

  // keep track of the region we define in the service
  deals.forEach(deal => deal.originalRegion = deal.region);

  return deals;
}

function extractRegion(deal) {
  let geoTaxonomy = deal.locations[0].geoTaxonomy;
  if (geoTaxonomy == undefined) {
    console.log(`Undefined geoTaxonomy for ${deal.permalink}`);
    return;
  }

  //TODO handle the Lat Am sales-continental issue
  return geoTaxonomy.places.
    map(place => place.placeTree).
    flatMap(place => place).
    find(place => place.type == "sales-region" || place.type == "sales-global_region");
}

function lookupRegion(region, regions) {
  return (region && regions[region.permalink]) ?
    regions[region.permalink] : region;
}
