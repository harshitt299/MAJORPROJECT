document.addEventListener("DOMContentLoaded", ()=>{
    const map = L.map('map').setView(mapCords, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

   const marker = L.marker(mapCords).addTo(map).bindPopup(`<b> ${mapTitle} </b> <p> Exact location provided after booking </p>`).openPopup();


    })
    
   