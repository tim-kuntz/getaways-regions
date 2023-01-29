const REGIONS_URL = "./data/regions.json";

export default async function loadRegions() {
  const requestRegions = new Request(REGIONS_URL);
  const responseRegions = await fetch(requestRegions);
  return responseRegions.json();
}

