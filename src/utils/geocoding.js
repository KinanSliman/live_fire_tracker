// Cache to avoid repeated API calls for same coordinates
const geocodingCache = new Map();

export const reverseGeocode = async (lat, lng) => {
  const cacheKey = `${Number(lat).toFixed(4)},${Number(lng).toFixed(4)}`;

  if (geocodingCache.has(cacheKey)) {
    return geocodingCache.get(cacheKey);
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.address) {
      const { address } = data;

      const locationInfo = {
        country: address.country,
        city:
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          address.county,
        state: address.state || address.region,
        displayName: data.display_name,
        rawAddress: address,
      };

      geocodingCache.set(cacheKey, locationInfo);
      return locationInfo;
    }

    return null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
};
