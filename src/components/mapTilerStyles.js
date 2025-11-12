import config from "../../config";

export const MAPTILER_KEY = config.MAPTILER_KEY;

export const MAPTILER_STYLES = [
  // 2D Styles
  {
    value: "collored_3d",
    label: " 3D ",
    url: `https://demotiles.maplibre.org/globe.json`,
    type: "3d",
  },

  {
    value: "satellite",
    label: "Satellite",
    url: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`,
    type: "2d",
  },
  {
    value: "streets",
    label: "Streets",
    url: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    type: "2d",
  },
  {
    value: "dark",
    label: "Dark",
    url: `https://api.maptiler.com/maps/darkmatter/style.json?key=${MAPTILER_KEY}`,
    type: "2d",
  },
  {
    value: "basic",
    label: "Basic",
    url: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,
    type: "2d",
  },
];
