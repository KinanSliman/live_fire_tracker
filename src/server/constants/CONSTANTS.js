export const API_CONFIG = {
  DURATION: 1, //LAST 24 HOURS
  SOURCE: "VIIRS_SNPP_NRT",
  BASE_URL: "https://firms.modaps.eosdis.nasa.gov/api/area/csv",
};

const COUNTRY_BOUNDS = {
  // North America
  usa_west: "32.0,-125.0,49.0,-100.0",
  usa_east: "24.0,-100.0,50.0,-65.0",
  canada_west: "48.0,-141.0,70.0,-100.0",
  canada_east: "45.0,-100.0,70.0,-52.0",
  mexico: "14.0,-118.0,33.0,-86.0",
  alaska: "51.0,-180.0,72.0,-130.0",

  // Central America & Caribbean
  central_america: "7.0,-92.0,18.0,-77.0",
  caribbean: "10.0,-85.0,24.0,-60.0",

  // South America
  brazil_north: "-10.0,-75.0,5.0,-45.0",
  brazil_south: "-35.0,-60.0,-10.0,-40.0",
  andes: "-55.0,-80.0,10.0,-60.0",
  south_america_east: "-40.0,-60.0,-20.0,-35.0",

  // Europe
  western_europe: "36.0,-10.0,55.0,10.0",
  eastern_europe: "45.0,10.0,60.0,40.0",
  scandinavia: "55.0,5.0,71.0,30.0",
  southern_europe: "35.0,-5.0,47.0,25.0",
  uk_ireland: "50.0,-10.0,59.0,2.0",
  russia_west: "45.0,30.0,70.0,60.0",

  // Africa
  north_africa: "15.0,-20.0,38.0,50.0",
  west_africa: "5.0,-20.0,15.0,15.0",
  central_africa: "-10.0,10.0,10.0,30.0",
  east_africa: "-10.0,25.0,15.0,52.0",
  south_africa: "-35.0,10.0,-5.0,40.0",
  madagascar: "-26.0,43.0,-12.0,51.0",

  // Middle East
  middle_east: "12.0,35.0,42.0,60.0",
  arabian_peninsula: "12.0,35.0,30.0,60.0",

  // South Asia
  india: "8.0,68.0,35.0,97.0",
  pakistan_afghanistan: "23.0,60.0,38.0,75.0",

  // Southeast Asia
  indochina: "10.0,95.0,28.0,110.0",
  indonesia_malaysia: "-10.0,95.0,10.0,140.0",
  philippines: "5.0,115.0,20.0,130.0",

  // East Asia
  china_east: "20.0,105.0,45.0,125.0",
  china_west: "30.0,75.0,45.0,105.0",
  japan_korea: "30.0,125.0,45.0,145.0",
  mongolia: "40.0,85.0,55.0,120.0",

  // Russia & Central Asia
  russia_central: "50.0,60.0,70.0,120.0",
  russia_east: "50.0,120.0,70.0,180.0",
  central_asia: "35.0,45.0,55.0,75.0",

  // Oceania
  australia_east: "-40.0,140.0,-10.0,155.0",
  australia_west: "-35.0,113.0,-15.0,140.0",
  australia_north: "-20.0,120.0,-10.0,145.0",
  new_zealand: "-48.0,165.0,-34.0,180.0",
  papua_new_guinea: "-10.0,140.0,0.0,155.0",

  // Island Regions
  hawaii: "18.0,-160.0,23.0,-154.0",
  greenland: "60.0,-75.0,84.0,-10.0",
  iceland: "63.0,-25.0,67.0,-13.0",
  siberian_islands: "70.0,100.0,80.0,160.0",

  // Additional Critical Fire Regions
  california: "32.0,-125.0,42.0,-114.0",
  amazon_basin: "-15.0,-75.0,5.0,-50.0",
  congo_basin: "-5.0,15.0,5.0,30.0",
  borneo: "-5.0,110.0,10.0,120.0",
  sumatra: "-5.0,95.0,5.0,110.0",
};
export default COUNTRY_BOUNDS;

export const COUNTRY_BOUNDSS = {
  // North America
  usa_west: "32.0,-125.0,49.0,-100.0",
  usa_east: "24.0,-100.0,50.0,-65.0",
  canada_west: "48.0,-141.0,70.0,-100.0",
  canada_east: "45.0,-100.0,70.0,-52.0",
  mexico: "14.0,-118.0,33.0,-86.0",
  alaska: "51.0,-180.0,72.0,-130.0",

  // Central America & Caribbean
  central_america: "7.0,-92.0,18.0,-77.0",
  caribbean: "10.0,-85.0,24.0,-60.0",

  // South America
  brazil_north: "-10.0,-75.0,5.0,-45.0",
  brazil_south: "-35.0,-60.0,-10.0,-40.0",
  andes: "-55.0,-80.0,10.0,-60.0",
  south_america_east: "-40.0,-60.0,-20.0,-35.0",

  // Europe
  western_europe: "36.0,-10.0,55.0,10.0",
  eastern_europe: "45.0,10.0,60.0,40.0",
  scandinavia: "55.0,5.0,71.0,30.0",
  southern_europe: "35.0,-5.0,47.0,25.0",
  uk_ireland: "50.0,-10.0,59.0,2.0",
  russia_west: "45.0,30.0,70.0,60.0",

  // Africa
  north_africa: "15.0,-20.0,38.0,50.0",
  west_africa: "5.0,-20.0,15.0,15.0",
  central_africa: "-10.0,10.0,10.0,30.0",
  east_africa: "-10.0,25.0,15.0,52.0",
  south_africa: "-35.0,10.0,-5.0,40.0",
  madagascar: "-26.0,43.0,-12.0,51.0",

  // Middle East
  middle_east: "12.0,35.0,42.0,60.0",
  arabian_peninsula: "12.0,35.0,30.0,60.0",

  // South Asia
  india: "8.0,68.0,35.0,97.0",
  pakistan_afghanistan: "23.0,60.0,38.0,75.0",

  // Southeast Asia
  indochina: "10.0,95.0,28.0,110.0",
  indonesia_malaysia: "-10.0,95.0,10.0,140.0",
  philippines: "5.0,115.0,20.0,130.0",

  // East Asia
  china_east: "20.0,105.0,45.0,125.0",
  china_west: "30.0,75.0,45.0,105.0",
  japan_korea: "30.0,125.0,45.0,145.0",
  mongolia: "40.0,85.0,55.0,120.0",

  // Russia & Central Asia
  russia_central: "50.0,60.0,70.0,120.0",
  russia_east: "50.0,120.0,70.0,180.0",
  central_asia: "35.0,45.0,55.0,75.0",

  // Oceania
  australia_east: "-40.0,140.0,-10.0,155.0",
  australia_west: "-35.0,113.0,-15.0,140.0",
  australia_north: "-20.0,120.0,-10.0,145.0",
  new_zealand: "-48.0,165.0,-34.0,180.0",
  papua_new_guinea: "-10.0,140.0,0.0,155.0",

  // Island Regions
  hawaii: "18.0,-160.0,23.0,-154.0",
  greenland: "60.0,-75.0,84.0,-10.0",
  iceland: "63.0,-25.0,67.0,-13.0",
  siberian_islands: "70.0,100.0,80.0,160.0",

  // Additional Critical Fire Regions
  california: "32.0,-125.0,42.0,-114.0",
  amazon_basin: "-15.0,-75.0,5.0,-50.0",
  congo_basin: "-5.0,15.0,5.0,30.0",
  borneo: "-5.0,110.0,10.0,120.0",
  sumatra: "-5.0,95.0,5.0,110.0",
};
