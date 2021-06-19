export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoicmFpem8iLCJhIjoiY2twdGFrcDR4MGhtMDJ2bm8wYnk2M252byJ9.xsbO-rDTmytwiQ7oVGiXng";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/raizo/ckptc130829zs18ntfjf2dorg",
    scrollZoom: false,
    //   center: [78.9629, 20.5937],
    //   zoom: 4,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement("div");
    el.className = "marker";

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend the map bound to include current lpcation
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
