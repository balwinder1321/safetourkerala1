// static/js/journey.js
document.addEventListener('DOMContentLoaded', ()=>{
  const shareBtn = document.getElementById('share_location');
  const locInfo = document.getElementById('loc_info');
  const nearby = document.getElementById('nearby_links');
  const alertsBox = document.getElementById('alerts_box');
  const saveBtn = document.getElementById('save_journey');

  shareBtn?.addEventListener('click', ()=>{
    if (!navigator.geolocation) { locInfo.innerText = 'Geolocation not supported'; return; }
    locInfo.innerText = 'Getting location...';
    navigator.geolocation.getCurrentPosition(async (pos)=>{
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      locInfo.innerHTML = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;

      // build google maps search links
      const q = encodeURIComponent('hotels near me');
      const mbase = `https://www.google.com/maps/search/`;
      nearby.innerHTML = `
        <p>Nearby: 
          <a target="_blank" href="${mbase}${encodeURIComponent('hotels near ' + lat + ',' + lng)}">Hotels</a> |
          <a target="_blank" href="${mbase}${encodeURIComponent('restaurants near ' + lat + ',' + lng)}">Restaurants</a> |
          <a target="_blank" href="${mbase}${encodeURIComponent('police station near ' + lat + ',' + lng)}">Police</a> |
          <a target="_blank" href="${mbase}${encodeURIComponent('hospital near ' + lat + ',' + lng)}">Hospitals</a>
        </p>
        <p>Ride apps: 
          <a target="_blank" href="https://www.olacabs.com/search?lat=${lat}&lng=${lng}">Ola</a> |
          <a target="_blank" href="https://m.uber.com/ul/?action=setPickup&client_id=default&pickup[latitude]=${lat}&pickup[longitude]=${lng}">Uber</a> |
          <a target="_blank" href="${mbase}${encodeURIComponent('Rapido near ' + lat + ',' + lng)}">Rapido</a>
        </p>
      `;

      // fetch alerts from server
      const r = await fetch(`/api/get_alerts?lat=${lat}&lng=${lng}`);
      const j = await r.json();
      if (j.alerts && j.alerts.length){
        alertsBox.innerHTML = j.alerts.map(a=>`<div style="padding:8px;border-left:4px solid #ef4444;margin-bottom:8px"><strong>${a.type}</strong><div>${a.text}</div></div>`).join('');
      } else {
        alertsBox.innerText = 'No current alerts for your location.';
      }

    }, (err)=>{
      locInfo.innerText = 'Error getting location: ' + err.message;
    });
  });

  saveBtn?.addEventListener('click', async ()=>{
    const start_place = document.getElementById('start_place').value;
    const dest_place = document.getElementById('dest_place').value;
    const start_date = document.getElementById('start_date').value;
    const end_date = document.getElementById('end_date').value;
    let lat=null, lng=null;
    try {
      const pos = await new Promise((res,rej)=> navigator.geolocation.getCurrentPosition(res,rej));
      lat = pos.coords.latitude; lng = pos.coords.longitude;
    } catch(e){ console.warn('no geo'); }
    const payload = { start_place, dest_place, start_date, end_date, lat, lng };
    const resp = await fetch('/api/save_journey', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    if (resp.ok) {
      alert('Journey saved.');
    } else {
      alert('Failed to save journey.');
    }
  });
});
