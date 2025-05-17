const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
script.async = true;
script.defer = true;
document.head.appendChild(script);
window.initMap = function () {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 14.477234, lng: 78.804932 },
    zoom: 8,
    mapTypeId: "terrain",
  });
  new google.maps.Marker({
    position: { lat: 14.477234, lng: 78.804932 },
    map: map,
    label: "A",
    title: "Kadapa",
    animation: google.maps.Animation.DROP,
  });
};