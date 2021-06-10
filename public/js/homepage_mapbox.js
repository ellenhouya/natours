const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiZWxsZW53MSIsImEiOiJja2owYnR0bWwxbzg3MnlwMmoyaWgzZms5In0.UVY0SAB1wIrnik2v88RxXQ';

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/ellenw1/ckoowsq3812yo17n1xto3fr98',
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  const el = document.createElement('div');
  el.className = 'marker';

  const card = document.createElement('div');
  card.className = 'tour-card';
  card.innerHTML = `
  <div class="card-img-con">
      <img src="img/tours/${loc.imageCover}" class='map-card-img'alt="">
    </div>
    <div class="card-text-con">
      <h4>${loc.duration}-DAY TOUR</h4>
      <p>${loc.summary}</p>
    </div>

    <div class="card-info-con">
      <div class="date-con">
        <i class="far fa-calendar-minus"></i>
        <span>${loc.startDates[0].slice(0, 10)}</span>
      </div>
      <div class="price-con">
        <i class="fas fa-dollar-sign"></i>
        <span>${loc.price} per person</span>
      </div>
      <div class="location-con">
        <i class="fas fa-map-marker-alt"></i>
        <span>${loc.startLocation.description}</span>
      </div>
    </div>
  `;

  new mapboxgl.Marker({
    element: el,

    anchor: 'bottom',
  })
    .setLngLat(loc.startLocation.coordinates)
    .addTo(map);

  new mapboxgl.Marker({
    element: card,

    anchor: 'bottom-left',
  })
    .setLngLat(loc.startLocation.coordinates)
    .addTo(map);

  new mapboxgl.Popup({
    offset: 35,
  })
    .setLngLat(loc.startLocation.coordinates)
    .setHTML(`<p>${loc.startLocation.description}</p>`)
    .addTo(map);

  bounds.extend(loc.startLocation.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 300,
    bottom: 150,
    left: 100,
    right: 100,
  },
});

function displayCard(e) {
  e.target.nextSibling.style.transition = 'all 0.5s';
  e.target.nextSibling.classList.toggle('active');
}

const markers = document.querySelectorAll('.marker');

markers.forEach((marker) => {
  marker.addEventListener('click', displayCard);
});
