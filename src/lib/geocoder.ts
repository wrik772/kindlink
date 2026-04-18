/**
 * Utility to convert location strings into GeoJSON coordinates [longitude, latitude]
 * using the free OpenStreetMap Nominatim API.
 */

export async function geocodeLocation(locationString: string): Promise<[number, number] | null> {
  if (!locationString) return null;

  try {
    // Nominatim requires a user-agent for fair use
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationString)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'KindLink/1.0 (Contact: admin@kindlink.org)',
        },
      }
    );

    if (!response.ok) {
      console.error("Geocoding failed with status:", response.status);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      // MongoDB GeoJSON format is [longitude, latitude]
      const lon = parseFloat(data[0].lon);
      const lat = parseFloat(data[0].lat);
      return [lon, lat];
    }

    return null;
  } catch (error) {
    console.error("Geocoding request error:", error);
    return null;
  }
}
