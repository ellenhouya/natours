export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZWxsZW53MSIsImEiOiJja2owYnR0bWwxbzg3MnlwMmoyaWgzZms5In0.UVY0SAB1wIrnik2v88RxXQ';

  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ellenw1/ckoowsq3812yo17n1xto3fr98',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,

      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 35,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

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
