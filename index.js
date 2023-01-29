import loadRegions from './modules/regions.js';
import loadDeals from './modules/deals.js';
import haversine from './modules/haversine.js';

const DEFAULT_COLOR = "#000000";

let regions;
let deals;

async function populate() {
  regions = await loadRegions();
  deals = await loadDeals(regions);

  populateRegions(regions);
  populateDeals(deals);

  // calculate and store distances
  // between the deal and the region
  deals.forEach(deal => deal.distance = distanceBetween(deal.region, deal));

  console.log(deals);
}

function populateRegions(regions) {
  Object.entries(regions).forEach(([key, value]) => addRegionMarker(value));
}

function addRegionMarker(region) {
  let coords = region.geoPoint;
  let marker = L.marker([coords.latitude, coords.longitude], {
    draggable: true
  }).addTo(map);
  marker.bindPopup(label(region.name, region.geoPoint)).openPopup();
  marker._icon.style.filter = `hue-rotate(${region.hueRotate})`


  marker.on('dragend', function(event) {
    let position = marker.getLatLng();
    marker.region.geoPoint = {
      latitude: position.lat,
      longitude: position.lng
    };
    recalcRegions(marker.region);
    marker._popup.setContent(label(region.name, region.geoPoint));
  });

  marker.region = region;
  region.marker = marker;
}

function populateDeals(deals) {
    deals.forEach(deal => addDealMarker(deal));
}

function addDealMarker(deal) {
  let coords = deal.geoPoint;
  let color = lookupColor(deal.region);

  let marker = L.circle([coords.latitude, coords.longitude], {
    color: color,
    fillColor: color,
    fillOpacity: 0.65,
    radius: 1609 * 3
  }).addTo(map);
  marker.bindPopup(label(deal.permalink, deal.geoPoint)).openPopup();

  marker.deal = deal;
  deal.marker = marker;
}

function label(label, geoPoint) {
  if (label.startsWith("ga-")) {
    return `<a href="https://www.groupon.com/deals/${label}">${label}</a><br/>${geoPoint.latitude},${geoPoint.longitude}`;
  } else {
    return `<b>${label}</b><br/>${geoPoint.latitude},${geoPoint.longitude}`;
  }
}

function lookupColor(region) {
  return region ? region.color : DEFAULT_COLOR;
}

function recalcRegions(region) {
  // TODO be smarter than this
  for (let deal of deals) {
    // update the distance for any deal associated
    // with the region that changed location
    if (region === deal.region) {
      deal.distance = distanceBetween(region, deal);
    }
    // go through all regions to see which
    // is now the closest
    for (let property in regions) {
      let region = regions[property];
      let distance = distanceBetween(region, deal);
      if (distance < deal.distance) {
        deal.distance = distance;
        deal.region = region;
        deal.marker.setStyle({color: region.color});
      }
    }
  }
}

function distanceBetween(region, deal) {
  if (deal.geoPoint && region && region.geoPoint) {
    return haversine(deal.geoPoint, region.geoPoint);
  }
  return undefined;
}

populate();

