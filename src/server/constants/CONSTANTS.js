export const API_CONFIG = {
  DURATION: 2, //LAST 2 days
  SOURCE: "VIIRS_SNPP_NRT",
  BASE_URL: "https://firms.modaps.eosdis.nasa.gov/api/area/csv",
};

const COUNTRY_BOUNDS = {
  // Europe
  western_europe: "36.0,-10.0,55.0,10.0",
  eastern_europe: "45.0,10.0,60.0,40.0",
  scandinavia: "55.0,5.0,71.0,30.0",
  southern_europe: "35.0,-5.0,47.0,25.0",
  uk_ireland: "50.0,-10.0,59.0,2.0",
  russia_west: "45.0,30.0,70.0,60.0",
};
export default COUNTRY_BOUNDS;
