const sources = [
  { id: 'ESRI-IMAGERY', name: 'World Imagery', publisher: 'Esri', coverage: 'Globalna satelitska podloga', freshness: 'Prema servisu izdavača', licence: 'Atribucija u karti', url: 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9', direct: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer', crs: 'Web Mercator', cadence: 'Prema servisu izdavača' },
  { id: 'OPEN-METEO', name: 'Trenutačno vrijeme i vlaga tla', publisher: 'Open-Meteo', coverage: 'Globalni prognostički model · točka polja', freshness: 'Trenutačna prognozna vrijednost', licence: 'Prema uvjetima Open-Meteo', url: 'https://open-meteo.com/en/docs', direct: 'https://api.open-meteo.com/v1/forecast', crs: 'WGS84', cadence: 'Ažurira se pri odabiru polja' },
  { id: 'BIOPORTAL-STANISTA', name: 'Karta kopnenih nešumskih staništa RH 2016', publisher: 'Bioportal / Zavod za zaštitu okoliša i prirode', coverage: 'Hrvatska · mjerilo 1:25 000 · najmanja jedinica 1,56 ha', freshness: 'Karta 2016.', licence: 'Licenca nije navedena u katalogu', url: 'https://bioportal.hr/istrazi-prirodu/karta-stanista-rh/', direct: 'https://services.bioportal.hr/wms', crs: 'EPSG:3857 / EPSG:3765', cadence: 'Prema objavi izdavača' },
  { id: 'ARKOD-PARCELE', name: 'ARKOD parcele', publisher: 'Agencija za plaćanja u poljoprivredi, ribarstvu i ruralnom razvoju', coverage: 'Hrvatska · vektorizirane poljoprivredne parcele', freshness: 'Trenutačno stanje, osvježavanje tjedno', licence: 'Prema uvjetima Agencije', url: 'https://www.apprrr.hr/prostorni-podaci-servisi/', direct: 'https://servisi.apprrr.hr/NIPP/wms?service=WMS&request=GetCapabilities', crs: 'EPSG:3765 / CRS:84', cadence: 'Tjedno' },
  { id: 'JRC-EUCROPMAP-2022', name: 'EU Crop Map 2022', publisher: 'Europska komisija / JRC', coverage: 'EU i Ukrajina · klasifikacija usjeva 10 m', freshness: '2022.', licence: 'Otvoreni podaci Europske komisije', url: 'https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/EUCROPMAP/2022/', direct: 'https://jeodpp.jrc.ec.europa.eu/jeodpp/services/ows/wms/landcover/eucropmap', crs: 'EPSG:4326', cadence: 'Referentna godina' },
  { id: 'DGU-ORTO', name: 'Digitalni ortofoto 2021./2022.', publisher: 'Državna geodetska uprava', coverage: 'Hrvatska · WMS raster', freshness: 'Službeni WMS sloj', licence: 'Otvorena dozvola', url: 'https://data.gov.hr/ckan/hr/dataset/digitalni-ortofoto-u-mjerilu-1-5000-2021-godina', direct: 'https://geoportal.dgu.hr/services/inspire/orthophoto_2021_2022/wms', crs: 'EPSG:4326 / EPSG:3765', cadence: 'Prema objavi DGU-a' },
  { id: 'DGU-HIDRO', name: 'Hidrografija INSPIRE', publisher: 'Državna geodetska uprava', coverage: 'Hrvatska · prostorni sloj', freshness: 'Katalog izmijenjen 14. 10. 2026.', licence: 'Otvorena dozvola', url: 'https://data.gov.hr/ckan/hr/dataset/hidrografija-inspire', direct: 'https://geoportal.dgu.hr/services/atom/xml', crs: 'HTRS96/TM · dostupne INSPIRE GML snimke', cadence: 'Nije navedena' },
  { id: 'DGU-VISINE', name: 'Visine – INSPIRE', publisher: 'Državna geodetska uprava', coverage: 'Hrvatska · WMS/ATOM', freshness: 'Katalog izmijenjen 22. 10. 2026.', licence: 'Otvorena dozvola', url: 'https://data.gov.hr/ckan/hr/dataset/visine-inspire', direct: 'https://geoportal.dgu.hr/services/atom/xml', crs: 'HTRS96/TM · INSPIRE GML 3.2.1', cadence: 'Nije navedena' },
  { id: 'DZS-USJEVI', name: 'Žetvena površina, proizvodnja i prirod oraničnih usjeva', publisher: 'Državni zavod za statistiku', coverage: 'RH i NUTS 2', freshness: 'Katalog izmijenjen 20. 7. 2026.', licence: 'Javni skup · provjeriti uvjete serije', url: 'https://data.gov.hr/ckan/hr/dataset/etvena-povr-ina-u-hektarima', direct: 'https://data.gov.hr/ckan/hr/dataset/etvena-povr-ina-u-hektarima', crs: 'Nije prostorni zapis', cadence: 'Godišnje' },
  { id: 'NATURA', name: 'Ekološka mreža Natura 2000 Republike Hrvatske – INSPIRE', publisher: 'Državna geodetska uprava / nadležno ministarstvo', coverage: 'Hrvatska · WFS/WMS', freshness: 'Katalog izmijenjen 13. 3. 2026.', licence: 'Nije navedena u katalogu', url: 'https://data.gov.hr/ckan/hr/dataset/ekoloka-mrea-natura-2000-republike-hrvatske-inspire', direct: 'https://data.gov.hr/ckan/hr/dataset/ekoloka-mrea-natura-2000-republike-hrvatske-inspire', crs: 'Provjeriti GetCapabilities prije učitavanja', cadence: 'Po potrebi' },
  { id: 'KATALOG', name: 'Nacionalni katalog otvorenih podataka', publisher: 'data.gov.hr', coverage: 'Nacionalni katalog', freshness: 'Snimka kataloga 8. 11. 2026.', licence: 'Katalog metapodataka', url: 'https://data.gov.hr/', direct: 'data/data-gov-hr-catalogue-2026-11-08.csv', crs: 'Nije primjenjivo', cadence: 'Ovisi o izdavaču' }
];
let liveMap;
let imageryOverlay;
let draftingLine;
let drawingPoints = [];
let isDrawing = false;
let activeFieldId = null;
let habitatLoadSequence = 0;
let cropResultMarker;
let fieldSummaryRequest = 0;
const weatherByField = new Map();
const fieldOverlays = new Map();
const dataOverlays = {};
const defaultFields = [];
let fieldRecords = JSON.parse(localStorage.getItem('kuna-fields-v2') || 'null') || defaultFields;

const findings = [
  { title: 'Granice uporabe zemljišta', text: 'ARKOD prikazuje prijavljene neprekinute poljoprivredne površine, a ne vlasništvo ni katastarske čestice.', source: 'ARKOD-PARCELE', confidence: 'srednje', kind: 'data' },
  { title: 'Stanište u okolici polja', text: 'Bioportalova karta staništa prikazuje kartirane tipove staništa u mjerilu 1:25 000. Nije popis autohtonih vrsta po čestici.', source: 'BIOPORTAL-STANISTA', confidence: 'srednje', kind: 'data' },
  { title: 'Usjev / pokrov 2022.', text: 'JRC karta ima mrežu od 10 m; klik na kartu vraća klasifikaciju za odabranu točku.', source: 'JRC-EUCROPMAP-2022', confidence: 'srednje', kind: 'data' },
  { title: 'Vrijeme za polje', text: 'Prognoza se računa za geometrijsko središte aktivnog polja i prikazuje se u pregledu polja, ne kao kartografski sloj.', source: 'OPEN-METEO', confidence: 'srednje', kind: 'data' }
];

const baseScenarios = [
  { crop: 'Kukuruz', date: '2027-04-18', title: 'Ranija sjetva', frost: 'viša izloženost', drought: 'niža izloženost', water: 'srednja', score: 67, note: 'Prozor se preklapa s duljim povijesnim hladnijim razdobljem.' },
  { crop: 'Kukuruz', date: '2027-05-03', title: 'Kasnija sjetva', frost: 'niža izloženost', drought: 'viša izloženost', water: 'srednja', score: 72, note: 'Kasniji početak smanjuje povijesnu izloženost mrazu, uz topliji ljetni prozor.' }
];

const state = {
  scenarios: JSON.parse(localStorage.getItem('kuna-scenarios') || 'null') || baseScenarios,
  entries: JSON.parse(localStorage.getItem('kuna-entries') || 'null') || [
    { id: 1, date: '2026-11-07', type: 'Obilazak', note: 'Rub uz odvodni jarak je vlažniji; nema vidljive stajaće vode.' },
    { id: 2, date: '2026-10-29', type: 'Fenofaza', note: 'Kukuruz u 4. listu. Ujednačeno nicanje na većem dijelu polja.' },
    { id: 3, date: '2026-10-21', type: 'Radnja', note: 'Očišćen pristup rubnom odvodnom kanalu.' }
  ],
  tasks: [
    { id: 1, text: 'Provjeriti odvodnju prije najavljene kiše', due: 'danas · Južna njiva', done: false },
    { id: 2, text: 'Potvrditi termin sljedećeg obilaska', due: 'u 3 dana · Južna njiva', done: false }
  ]
};

function source(id) { return sources.find(s => s.id === id); }
function save() { localStorage.setItem('kuna-scenarios', JSON.stringify(state.scenarios)); localStorage.setItem('kuna-entries', JSON.stringify(state.entries)); }
function saveFields() { localStorage.setItem('kuna-fields-v2', JSON.stringify(fieldRecords)); }
function formatDate(value) { return new Intl.DateTimeFormat('hr-HR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`)); }
function activeField() { return fieldRecords.find(field => field.id === activeFieldId) || fieldRecords[0]; }
function fieldAreaLabel(field) { return `${field.area} · ${field.crop}`; }
function fieldStyle(field) { const selected = field.id === activeFieldId; return { color: selected ? '#ff613d' : '#ffffff', weight: selected ? 3 : 2, fillColor: selected ? '#ff613d' : '#ffffff', fillOpacity: selected ? .16 : .08 }; }
function buildFieldOverlay(field) {
  const overlay = L.polygon(field.coords, fieldStyle(field)).bindTooltip(field.name, { permanent: true, direction: 'center', className: 'field-label' });
  overlay.on('click', () => selectField(field.id, true));
  fieldOverlays.set(field.id, overlay);
  if (field.visible) overlay.addTo(liveMap);
  return overlay;
}
function renderFieldControls() {
  const select = document.querySelector('#field-select'); const list = document.querySelector('#field-layer-list');
  if (!select || !list) return;
  if (!fieldRecords.length) {
    select.innerHTML = '<option value="" selected>Nema polja — nacrtajte prvo polje</option>';
    list.innerHTML = '<small class="empty-field-list">Nema ucrtanih polja.</small>';
    return;
  }
  select.innerHTML = fieldRecords.map(field => `<option value="${field.id}">${escapeHtml(field.name)} · ${field.area}</option>`).join('');
  select.value = activeFieldId;
  list.innerHTML = fieldRecords.map(field => `<label><input data-field-layer="${field.id}" type="checkbox" ${field.visible ? 'checked' : ''}><span>${escapeHtml(field.name)}</span></label>`).join('');
}
function refreshFieldPresentation() {
  const field = activeField();
  if (!field) {
    document.querySelector('.sidebar-field strong').textContent = 'Još nema polja';
    document.querySelector('.sidebar-field small').textContent = 'Nacrtajte granicu na karti';
    document.querySelector('.field-inspector')?.classList.add('inspector-hidden');
    renderFieldControls();
    return;
  }
  document.querySelector('.field-inspector h1').textContent = field.name;
  document.querySelector('.field-inspector header p').textContent = fieldAreaLabel(field);
  document.querySelector('.sidebar-field strong').textContent = field.name;
  document.querySelector('.sidebar-field small').textContent = fieldAreaLabel(field);
  fieldOverlays.forEach((overlay, id) => {
    const item = fieldRecords.find(candidate => candidate.id === id);
    if (!item) return;
    overlay.setStyle(fieldStyle(item));
    overlay.setTooltipContent(item.name);
  });
  renderFieldControls();
  updateLiveWeather();
  refreshFieldSummary();
}
function selectField(id, fit = false) {
  const field = fieldRecords.find(item => item.id === id); if (!field) return;
  activeFieldId = id; field.visible = true;
  const overlay = fieldOverlays.get(id); if (overlay && !liveMap.hasLayer(overlay)) overlay.addTo(liveMap);
  saveFields(); refreshFieldPresentation(); document.querySelector('.field-inspector')?.classList.remove('inspector-hidden');
  if (fit && overlay) liveMap.fitBounds(overlay.getBounds(), { padding: [70, 70], maxZoom: 17 });
}
function openRenameFieldDialog() {
  const field = activeField(); if (!field) return;
  document.querySelector('#rename-field-input').value = field.name;
  openDialog('#rename-field-dialog');
}
function openCropDialog() {
  const field = activeField(); if (!field) return;
  document.querySelector('#field-crop-input').value = field.crop || '';
  document.querySelector('#field-variety-input').value = field.variety || '';
  document.querySelector('#field-planting-input').value = field.plantedOn || '';
  openDialog('#field-crop-dialog');
}
function fieldEvidence(field) {
  const weather = weatherByField.get(field.id);
  const evidence = {
    field_name: field.name, area: field.area, crop: field.crop || 'nije evidentirano', variety: field.variety || '', planted_on: field.plantedOn || '',
    habitat: field.habitatName || 'nije očitano', crop_map_2022: field.jrcClass || 'nije očitano',
    weather: weather ? `${weather.temperature} °C, ${weather.precipitation} mm oborine, vlaga tla ${weather.soilMoisture} m³/m³, vjetar ${weather.wind} km/h` : 'trenutačno nije dostupno'
  };
  evidence.ecology_guidance = environmentalGuidance(evidence);
  return evidence;
}
function environmentalGuidance(evidence) {
  const habitat = String(evidence.habitat || '').toLocaleLowerCase('hr');
  if (evidence.habitat === 'nije očitano') return 'Pri obilasku označite zeleni rub i sačuvajte ga dok ne potvrdite lokalne vrste.';
  if (/(voda|močvar|jarak|vodot)/.test(habitat)) return 'Sačuvajte vegetacijski rub uz vodu: usporava otjecanje i daje prostor lokalnim vrstama.';
  if (/(trav|livad|pašn|grassland)/.test(habitat)) return 'Uz travnjački rub ostavite dio cvatnje pri košnji, nakon obilaska stvarnog stanja.';
  return 'Na najmanje izmijenjenom rubu zadržite vegetacijski pojas za lokalne vrste i sporije otjecanje.';
}
function localFieldSummary(evidence) {
  const crop = evidence.crop === 'nije evidentirano' ? 'Usjev nije unesen' : `Usjev: ${evidence.crop}`;
  const habitat = evidence.habitat === 'nije očitano' ? 'Stanište nije očitano' : `Stanište: ${evidence.habitat}`;
  return `${crop}. ${habitat}.`;
}
async function refreshFieldSummary() {
  const target = document.querySelector('#field-summary'); if (!target) return;
  const field = activeField(); if (!field) return;
  const requestId = ++fieldSummaryRequest; const evidence = fieldEvidence(field);
  const ecologyTarget = document.querySelector('#environment-guidance');
  if (ecologyTarget) ecologyTarget.textContent = evidence.ecology_guidance;
  target.textContent = 'Pripremam sažetak polja…';
  try {
    const response = await fetch('/api/field-summary', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(evidence) });
    if (!response.ok) throw new Error('Summary unavailable');
    const payload = await response.json();
    if (requestId !== fieldSummaryRequest || field.id !== activeFieldId) return;
    target.textContent = payload.summary || localFieldSummary(evidence);
  } catch (error) {
    if (requestId === fieldSummaryRequest && field.id === activeFieldId) target.textContent = localFieldSummary(evidence);
  }
}
async function updateLiveWeather() {
  if (!liveMap) return;
  const field = activeField(); if (!field) return;
  const fieldId = field.id;
  const point = L.latLngBounds(field.coords).getCenter();
  const status = document.querySelector('#map-status');
  try {
    const request = new URL('https://api.open-meteo.com/v1/forecast');
    request.search = new URLSearchParams({ latitude: point.lat.toFixed(5), longitude: point.lng.toFixed(5), current: 'temperature_2m,precipitation,soil_moisture_0_to_1cm,wind_speed_10m', wind_speed_unit: 'kmh' });
    const response = await fetch(request);
    if (!response.ok) throw new Error('Weather service unavailable');
    const payload = await response.json();
    if (fieldId !== activeFieldId || !payload.current) return;
    const current = payload.current;
    weatherByField.set(fieldId, { temperature: current.temperature_2m, precipitation: current.precipitation, soilMoisture: current.soil_moisture_0_to_1cm, wind: current.wind_speed_10m });
    const readout = document.querySelector('#weather-readout');
    if (readout) readout.textContent = `${current.temperature_2m} °C · ${current.precipitation} mm oborine · vlaga tla ${current.soil_moisture_0_to_1cm} m³/m³`;
    if (status && !isDrawing) status.textContent = 'Izvori: Esri · Bioportal · ARKOD · JRC';
    refreshFieldSummary();
  } catch (error) {
    const readout = document.querySelector('#weather-readout');
    if (readout) readout.textContent = 'Procjena vremena trenutačno nije dostupna.';
  }
}
function habitatName(properties) {
  return [...new Set([properties?.nks1_naziv, properties?.nks2_naziv, properties?.nks3_naziv].filter(Boolean))].join(' · ');
}
function habitatColor(properties) {
  const name = habitatName(properties).toLocaleLowerCase('hr');
  return name.includes('voda') || name.includes('tršć') || name.includes('rogoz') ? '#477f90' : name.includes('šum') ? '#527e51' : name.includes('trav') || name.includes('livad') ? '#718b45' : name.includes('kultiviran') || name.includes('oran') ? '#987d27' : '#68705a';
}
function habitatStyle(feature) {
  const color = habitatColor(feature.properties);
  return { color, weight: 1.25, opacity: .86, fillColor: color, fillOpacity: .46 };
}
function showHabitatDetail(properties) {
  const detail = document.querySelector('#habitat-detail');
  if (!detail) return;
  const name = habitatName(properties);
  detail.hidden = false;
  detail.textContent = name ? `Stanište: ${name}` : 'Za kliknutu točku nema kartiranog staništa.';
  const field = activeField();
  if (name && field) { field.habitatName = name; saveFields(); refreshFieldSummary(); }
}
function addHabitatLabel(feature, layer) {
  if (liveMap.getZoom() < 14 || !feature.properties?.nks1_naziv) return;
  const bounds = layer.getBounds();
  const northWest = liveMap.latLngToContainerPoint(bounds.getNorthWest());
  const southEast = liveMap.latLngToContainerPoint(bounds.getSouthEast());
  if (Math.abs(southEast.x - northWest.x) < 145 || Math.abs(southEast.y - northWest.y) < 54) return;
  let centre;
  try { centre = layer.getCenter(); } catch (error) { centre = bounds.getCenter(); }
  const labelText = `<span class="habitat-map-label-text" style="--habitat-label-color:${habitatColor(feature.properties)}">${escapeHtml(feature.properties.nks1_naziv)}</span>`;
  const label = L.marker(centre, { interactive: false, icon: L.divIcon({ className: 'habitat-map-label', html: labelText, iconSize: [150, 36], iconAnchor: [75, 18] }) });
  dataOverlays.habitats.addLayer(label);
}
async function loadHabitatVector() {
  const toggle = document.querySelector('[data-map-layer="habitats"]');
  if (!liveMap || !toggle?.checked || !dataOverlays.habitats) return;
  const requestId = ++habitatLoadSequence;
  const bounds = liveMap.getBounds();
  const request = new URL('https://services.bioportal.hr/wfs');
  request.search = new URLSearchParams({ service: 'WFS', version: '2.0.0', request: 'GetFeature', typeNames: 'dzzpnpis:kopnena_stanista_2016', outputFormat: 'application/json', srsName: 'EPSG:4326', bbox: `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()},EPSG:4326`, count: '600' });
  try {
    const response = await fetch(request);
    if (!response.ok) throw new Error('Habitat service unavailable');
    const payload = await response.json();
    if (requestId !== habitatLoadSequence || !toggle.checked) return;
    dataOverlays.habitats.clearLayers();
    const vector = L.geoJSON(payload, { style: habitatStyle, onEachFeature: (feature, layer) => layer.on('click', event => { L.DomEvent.stopPropagation(event.originalEvent); showHabitatDetail(feature.properties); inspectCrop(event.latlng); }) });
    dataOverlays.habitats.addLayer(vector);
    vector.eachLayer(layer => addHabitatLabel(layer.feature, layer));
  } catch (error) {
    const detail = document.querySelector('#habitat-detail');
    if (detail) { detail.hidden = false; detail.textContent = 'Sloj staništa trenutačno nije dostupan.'; }
  }
}
async function inspectHabitat(latlng) {
  const toggle = document.querySelector('[data-map-layer="habitats"]');
  const detail = document.querySelector('#habitat-detail');
  if (!toggle?.checked || !detail || !liveMap?.hasLayer(dataOverlays.habitats)) return;
  const point = L.CRS.EPSG3857.project(latlng);
  const radius = 24;
  const request = new URL('https://services.bioportal.hr/dzzpnpis/ows');
  request.search = new URLSearchParams({ SERVICE: 'WMS', VERSION: '1.3.0', REQUEST: 'GetFeatureInfo', LAYERS: 'dzzpnpis:kopnena_stanista_2016', QUERY_LAYERS: 'dzzpnpis:kopnena_stanista_2016', CRS: 'EPSG:3857', BBOX: `${point.x - radius},${point.y - radius},${point.x + radius},${point.y + radius}`, WIDTH: '256', HEIGHT: '256', I: '128', J: '128', INFO_FORMAT: 'application/json', FEATURE_COUNT: '1' });
  detail.hidden = false; detail.textContent = 'Tražim naziv staništa…';
  try {
    const response = await fetch(request);
    if (!response.ok) throw new Error('Habitat service unavailable');
    const payload = await response.json();
    showHabitatDetail(payload.features?.[0]?.properties);
  } catch (error) {
    detail.textContent = 'Naziv staništa trenutačno nije dostupan.';
  }
}
async function inspectCrop(latlng) {
  const toggle = document.querySelector('[data-map-layer="crop2022"]');
  const detail = document.querySelector('#crop-detail');
  if (!toggle?.checked || !detail) return;
  if (window.location.protocol === 'file:') return;
  detail.hidden = false; detail.textContent = 'Tražim klasifikaciju usjeva…';
  try {
    const request = new URL('/api/eucrop', window.location.origin);
    request.search = new URLSearchParams({ lat: latlng.lat.toFixed(6), lng: latlng.lng.toFixed(6) });
    const response = await fetch(request);
    if (response.status === 404) throw new Error('local-server-needed');
    if (!response.ok) throw new Error('crop-source-unavailable');
    const payload = await response.json();
    detail.textContent = `Usjev / pokrov 2022.: ${payload.class}`;
    const field = activeField();
    if (field) { field.jrcClass = payload.class; saveFields(); refreshFieldSummary(); }
    if (cropResultMarker) liveMap.removeLayer(cropResultMarker);
    cropResultMarker = L.marker(latlng, { interactive: false, icon: L.divIcon({ className: 'crop-map-label', html: `<span>${escapeHtml(payload.class)}</span>`, iconSize: [190, 30], iconAnchor: [95, 36] }) }).addTo(liveMap);
  } catch (error) {
    detail.hidden = true;
    detail.textContent = '';
  }
}

function renderFindings() {
  const container = document.querySelector('#findings');
  if (!container) return;
  container.innerHTML = findings.map(f => {
    const s = source(f.source);
    return `<article class="finding"><div class="finding-top"><h3>${f.title}</h3><span class="confidence ${f.confidence === 'srednje' ? 'watch' : ''}">${f.confidence}</span></div><p>${f.text}</p><div class="finding-meta"><i></i><span>${f.kind === 'data' ? 'JAVNI PODATAK' : 'OGRANIČENJE'}</span> · <a href="${s.url}" target="_blank" rel="noreferrer">${s.id} ↗</a></div></article>`;
  }).join('');
}

function assessment(crop, date) {
  const d = new Date(`${date}T12:00:00`); const day = d.getDate() + d.getMonth() * 30;
  const cropBias = { 'Kukuruz': 4, 'Suncokret': 1, 'Soja': 2, 'Pšenica': 5 }[crop] || 0;
  const frost = day < 135 ? 'viša izloženost' : day < 155 ? 'srednja' : 'niža izloženost';
  const drought = day < 135 ? 'niža izloženost' : day < 155 ? 'srednja' : 'viša izloženost';
  const score = Math.max(52, Math.min(83, 67 + cropBias + (day > 145 ? 5 : 0) - (day > 165 ? 5 : 0)));
  return { crop, date, title: `Sjetva ${formatDate(date)}`, frost, drought, water: 'srednja', score, note: 'Prikaz se računa iz prototipnih pragova i javnog regionalnog konteksta.' };
}

function renderScenarios() {
  document.querySelector('#scenario-grid').innerHTML = state.scenarios.map((s, i) => `<article class="scenario-card ${i === 1 ? 'featured' : ''}"><button class="remove-scenario" data-remove-scenario="${i}" aria-label="Ukloni scenarij">×</button><p class="eyebrow">${s.crop.toUpperCase()}</p><h2>${s.title}</h2><p class="intro-copy">${formatDate(s.date)}</p><div class="score">${s.score}<span>pokazatelj pokrivenosti i izloženosti · od 100</span></div><div class="metric"><span>Povijesni prozor mraza</span><b>${s.frost}</b></div><div class="metric"><span>Sušni / toplinski prozor</span><b>${s.drought}</b></div><div class="metric"><span>Višak vode</span><b>${s.water}</b></div><p class="finding-meta"><i></i> PRAVILO · DGU-VISINE + DZS-USJEVI</p></article>`).join('');
}

function renderTimeline() {
  const risks = [
    { date: '9.–11. studenoga', title: 'Moguć prozor jače kiše', detail: 'Signal oborine ≥ 35 mm / 72 h kombiniran je s vodnim kontekstom. Provjerite odvodnju prije oborine.', level: 'high', evidence: 'PRAVILO · oborina + DGU-HIDRO' },
    { date: '12.–13. studenoga', title: 'Moguć mraz', detail: 'Očekivani minimum i unesena osjetljiva faza stvaraju signal za provjeru. Potvrdite službenu prognozu prije radnje.', level: '', evidence: 'PRAVILO · prognoza + faza usjeva' },
    { date: '15. studenoga', title: 'Vjetar prije planirane radnje', detail: 'Za planiranu terensku radnju označen je vjetar iznad praga. Razmotrite odgodu i provjerite službenu prognozu.', level: '', evidence: 'PRAVILO · prognoza + plan rada' }
  ];
  document.querySelector('#timeline').innerHTML = risks.map((r, i) => `<article class="risk ${r.level}"><div class="risk-date">${r.date}</div><div><h2>${r.title}</h2><p>${r.detail}</p></div><button class="outline-button" data-ack="${i}">Označi provjerenim</button></article>`).join('');
  updateBadge();
}
function updateBadge() { document.querySelector('#alert-badge').textContent = document.querySelectorAll('.risk').length; }

function renderTasks() {
  document.querySelector('#tasks').innerHTML = state.tasks.map(t => `<label class="task"><input type="checkbox" data-task="${t.id}" ${t.done ? 'checked' : ''}><span><strong>${t.text}</strong><span>${t.due}</span></span></label>`).join('');
}
function renderJournal() {
  const list = document.querySelector('#journal-list');
  list.innerHTML = state.entries.length ? state.entries.map(e => `<article class="journal-entry"><time class="journal-date">${formatDate(e.date)}</time><div><h2>${e.type}</h2><p>${escapeHtml(e.note)}</p></div><button data-delete-entry="${e.id}" aria-label="Izbriši zapis">×</button></article>`).join('') : '<p class="intro-copy" style="padding:20px 0">Nema lokalnih zapisa za ovo polje.</p>';
  document.querySelector('#entry-count').textContent = state.entries.length;
}
function escapeHtml(text) { const el = document.createElement('div'); el.textContent = text; return el.innerHTML; }

const bioCatalog = {
  pollinators: [
    { title: 'Rubni cvjetni pojas', text: 'Mješavinu autohtonih zavičajnih vrsta odaberite nakon lokalne provjere staništa. Rub se veže uz postojeći prijelaz između obradive površine i vodnog konteksta.', trade: 'Dobit: hrana i zaklon za oprašivače · kompromis: dio radne širine' },
    { title: 'Niska živica od zavičajnih vrsta', text: 'Prije izbora vrsta potrebno je provjeriti lokalni sastav i moguća ograničenja. Koncept ne navodi vrstu bez regionalne potvrde.', trade: 'Dobit: povezivanje staništa · kompromis: održavanje i zasjenjenje ruba' }
  ],
  erosion: [
    { title: 'Trajni vegetacijski rub', text: 'Na blagom prijelazu terena trajni pokrov može smanjiti površinsko otjecanje. Nagib treba potvrditi službenim modelom visina.', trade: 'Dobit: manje ispiranje tla · kompromis: izuzimanje uskog pojasa iz obrade' },
    { title: 'Živica poprečno na pad', text: 'Mjesto uskladite s pristupima strojeva i stvarnim smjerom pada. Sadni materijal treba biti lokalnog podrijetla.', trade: 'Dobit: usporavanje vjetra i vode · kompromis: radni manevri' }
  ],
  water: [
    { title: 'Zeleni rub uz odvodni koridor', text: 'Održivi vegetacijski rub može služiti kao prijelaz prema vodi. Nije zamjena za projekt odvodnje ili dozvole.', trade: 'Dobit: filtriranje otjecanja · kompromis: redovito održavanje' },
    { title: 'Mala sezonska depresija', text: 'Razmotrite samo nakon lokalne provjere hidrologije i dozvola. Ne predlaže se gradnja bez stručnog projekta.', trade: 'Dobit: zadržavanje oborine · kompromis: zauzeta površina i sigurnost' }
  ],
  connectivity: [
    { title: 'Povezani rubni pojas', text: 'Pojas se može smjestiti na južni rub radi spajanja postojećih zelenih elemenata. Natura 2000 sloj provjerava se prije izvedbe.', trade: 'Dobit: koridor za vrste · kompromis: potreban dogovor s vlasnicima susjednih polja' },
    { title: 'Mozaični travnati kut', text: 'Manji neobrađeni kut ostavlja različitu strukturu staništa bez tvrdnje o prisutnosti određene vrste.', trade: 'Dobit: raznolikost mikro-staništa · kompromis: manje obradive površine' }
  ]
};
function renderBio() {
  const objective = document.querySelector('#bio-objective').value; const cards = bioCatalog[objective];
  document.querySelector('#bio-cards').innerHTML = cards.map((c, i) => `<article class="bio-card"><div><p class="eyebrow">PRIJEDLOG ${i + 1} · SREDNJE POVJERENJE</p><h2>${c.title}</h2><p>${c.text}</p><small>IZVORI: NATURA + DGU-HIDRO + DGU-VISINE · ograničenje: potreban aktualni prostorni presjek</small></div><span class="benefit">${c.trade}</span></article>`).join('');
  document.querySelector('#placement-caption').textContent = objective === 'water' ? 'Zeleni rub uz smjer površinskog otjecanja; nije projekt odvodnje.' : objective === 'erosion' ? 'Trajni pojas prati približni prijelaz terena; provjeriti nagib službenim slojem.' : 'Rubni pojas prati južni rub i čuva radni pristup; smještaj je koncept.';
}
function renderSources() {
  document.querySelector('#source-table').innerHTML = sources.slice(0, 8).map(s => `<article class="source-row"><div><h2>${s.name}</h2><p>${s.id}</p></div><div>${s.publisher}</div><div>${s.freshness}</div><div>${s.licence}</div><a href="${s.url}" target="_blank" rel="noreferrer">Katalog ↗</a></article>`).join('');
}

async function refreshOpenDataStatus() {
  const target = document.querySelector('#live-open-data-status');
  if (!target) return;
  target.textContent = 'Provjeravam aktualne metapodatke na Portalu otvorenih podataka…';
  try {
    const response = await fetch('/api/open-data-status');
    if (!response.ok) throw new Error('Portal API unavailable');
    const payload = await response.json();
    const available = (payload.sources || []).filter(item => !item.unavailable);
    target.textContent = available.length
      ? `Aktualni metapodaci potvrđeni preko ${payload.api}: ${available.map(item => `${item.id} (${item.modified})`).join(' · ')}`
      : 'Portal otvorenih podataka trenutačno nije dostupan; prikazan je lokalni registar izvora.';
  } catch (error) {
    target.textContent = 'Portal otvorenih podataka trenutačno nije dostupan; prikazan je lokalni registar izvora.';
  }
}

function assistantEvidence() {
  const field = activeField();
  if (!field) return { field_name: 'nije odabrano polje', weather: 'nije dostupno' };
  return fieldEvidence(field);
}

function appendChatMessage(kind, text, sourceIds = [], note = '') {
  const log = document.querySelector('#chat-log');
  const message = document.createElement('div');
  message.className = `${kind}-message`;
  message.textContent = text;
  if (sourceIds.length) {
    const sourcesLabel = document.createElement('small');
    sourcesLabel.className = 'citation';
    sourcesLabel.textContent = `Izvori konteksta: ${sourceIds.join(' · ')}`;
    message.appendChild(sourcesLabel);
  }
  if (note) {
    const method = document.createElement('small');
    method.className = 'citation';
    method.textContent = note;
    message.appendChild(method);
  }
  log.appendChild(message);
  log.scrollTop = log.scrollHeight;
  return message;
}

async function askAssistant(question) {
  const input = document.querySelector('#chat-input');
  const submit = document.querySelector('#chat-form button');
  appendChatMessage('user', question);
  const pending = appendChatMessage('assistant', 'Lokalni model priprema odgovor uz odabrane izvore…');
  input.value = ''; input.disabled = true; submit.disabled = true;
  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, facts: assistantEvidence() })
    });
    const payload = await response.json();
    pending.remove();
    if (!response.ok) throw new Error(payload.error || 'Pomoćnik trenutačno nije dostupan.');
    appendChatMessage('assistant', payload.answer, payload.source_ids || [], payload.validated === false ? 'Odgovor je vraćen iz provjerenih činjenica nakon LLM provjere.' : `Lokalni model: ${payload.model}`);
  } catch (error) {
    pending.textContent = error.message || 'Pomoćnik trenutačno nije dostupan.';
  } finally {
    input.disabled = false; submit.disabled = false; input.focus();
  }
}

function switchView(id) { document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === id)); document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.view === id)); document.querySelector('.sidebar')?.classList.remove('open'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function openDialog(id) { document.querySelector(id).showModal(); }
function closeDialogs() { document.querySelectorAll('dialog[open]').forEach(d => d.close()); }

document.addEventListener('click', (event) => {
  const link = event.target.closest('[data-view]'); if (link) { event.preventDefault(); switchView(link.dataset.view); }
  const modal = event.target.closest('[data-modal]'); if (modal) { event.preventDefault(); openWorkspaceModal(modal.dataset.modal); }
  const go = event.target.closest('[data-goto]'); if (go) switchView(go.dataset.goto);
  if (event.target.closest('#menu-button')) document.querySelector('.sidebar').classList.toggle('open');
  if (event.target.closest('#draw-field')) toggleDrawing();
  if (event.target.closest('.start-dismiss')) document.querySelector('.start-dock')?.classList.add('start-dock-hidden');
  const start = event.target.closest('[data-start]'); if (start) {
    document.querySelector('.start-dock')?.classList.add('start-dock-hidden');
    if (start.dataset.start === 'search') document.querySelector('.place-search input')?.focus();
    if (start.dataset.start === 'draw') document.querySelector('#draw-field')?.click();
    if (start.dataset.start === 'continue') document.querySelector('.field-inspector')?.classList.remove('inspector-hidden');
  }
  if (event.target.closest('#open-assistant') || event.target.closest('#open-assistant-2')) openDialog('#assistant-dialog');
  if (event.target.closest('#new-entry')) openDialog('#entry-dialog');
  if (event.target.closest('#rename-field')) openRenameFieldDialog();
  if (event.target.closest('#edit-field-crop')) openCropDialog();
  if (event.target.closest('#download-field-pdf')) exportFieldPdf();
  if (event.target.closest('#print-field-report')) window.print();
  if (event.target.closest('#open-roles')) openDialog('#roles-dialog');
  if (event.target.closest('.close-dialog')) closeDialogs();
  const remove = event.target.closest('[data-remove-scenario]'); if (remove) { state.scenarios.splice(Number(remove.dataset.removeScenario), 1); save(); renderScenarios(); }
  const del = event.target.closest('[data-delete-entry]'); if (del) { state.entries = state.entries.filter(e => e.id !== Number(del.dataset.deleteEntry)); save(); renderJournal(); }
  const ack = event.target.closest('[data-ack]'); if (ack) { const risk = ack.closest('.risk'); risk.querySelector('h2').textContent += ' · provjereno'; ack.remove(); updateBadge(); }
  if (event.target.closest('#update-bio')) renderBio();
  if (event.target.closest('#clear-private-data')) { if (confirm('Izbrisati sve lokalne zapise dnevnika?')) { state.entries = []; save(); renderJournal(); } }
  if (event.target.closest('#new-task')) { state.tasks.push({ id: Date.now(), text: 'Novi terenski zadatak', due: 'nije zakazan · Južna njiva', done: false }); renderTasks(); }
  if (event.target.closest('#alert-settings')) alert('Postavke se spremaju po korisniku, polju, pragu i kanalu obavijesti.');
  if (event.target.closest('#map-layer')) document.querySelector('.layer-list').classList.toggle('layer-list-hidden');
  if (event.target.closest('.close-inspector')) document.querySelector('.field-inspector').classList.toggle('inspector-hidden');
  const inspectorTab = event.target.closest('[data-inspector]'); if (inspectorTab) setInspector(inspectorTab.dataset.inspector);
  if (event.target.closest('#export-report')) exportReport();
});
document.addEventListener('change', (event) => {
  if (event.target.matches('[data-task]')) { const task = state.tasks.find(t => t.id === Number(event.target.dataset.task)); task.done = event.target.checked; }
  if (event.target.matches('[data-field-layer]')) {
    const field = fieldRecords.find(item => item.id === event.target.dataset.fieldLayer); const overlay = fieldOverlays.get(field?.id); if (!field || !overlay) return;
    field.visible = event.target.checked; event.target.checked ? overlay.addTo(liveMap) : liveMap.removeLayer(overlay); saveFields();
  }
});
document.querySelector('#add-scenario').addEventListener('click', () => { state.scenarios.push(assessment(document.querySelector('#crop-select').value, document.querySelector('#planting-date').value)); save(); renderScenarios(); });
document.querySelector('#field-select').addEventListener('change', event => selectField(event.target.value, true));
document.querySelector('.place-search input').addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  if (event.target.value.trim()) { document.querySelector('#field-select')?.focus(); event.target.value = ''; }
});
document.querySelector('#entry-form').addEventListener('submit', event => { event.preventDefault(); const data = new FormData(event.target); state.entries.unshift({ id: Date.now(), date: data.get('date'), type: data.get('type'), note: data.get('note') }); save(); renderJournal(); event.target.reset(); closeDialogs(); });
document.querySelector('#rename-field-form').addEventListener('submit', event => { event.preventDefault(); const name = document.querySelector('#rename-field-input').value.trim(); const field = activeField(); if (!name || !field) return; field.name = name; saveFields(); refreshFieldPresentation(); closeDialogs(); });
document.querySelector('#field-crop-form').addEventListener('submit', event => { event.preventDefault(); const field = activeField(); if (!field) return; field.crop = document.querySelector('#field-crop-input').value.trim() || 'nije evidentirano'; field.variety = document.querySelector('#field-variety-input').value.trim(); field.plantedOn = document.querySelector('#field-planting-input').value; saveFields(); refreshFieldPresentation(); setInspector('now'); closeDialogs(); });
document.querySelector('#chat-form').addEventListener('submit', event => { event.preventDefault(); const input = document.querySelector('#chat-input'); const question = input.value.trim(); if (question) askAssistant(question); });
function setInspectorLegacy(tab) {
  const content = {
    now: `<article class="advice-card"><span class="advice-kicker">SAŽETAK PODATAKA</span><strong>Za operativnu odluku prvo usporedite pH tla, stanje vegetacije i trenutačnu vlagu tla; zatim potvrdite nalaz obilaskom ili uzorkom.</strong><p>Slojevi na karti su globalni modeli i satelitski rasteri, a ne izmišljene zone unutar polja.</p><button class="outline-button" data-modal="procjena">Detalji</button></article>`,
    week: `<article class="focus-finding"><span class="signal terrain"></span><div><small>TLO · GLOBALNI MODEL</small><strong>pH tla na razlučivosti 250 m</strong><p>Uključite SoilGrids sloj. Nalaz je indikativan, ne laboratorijska analiza.</p></div><button data-modal="procjena">›</button></article><article class="focus-finding"><span class="signal water"></span><div><small>VODA · PROGNOSTIČKI MODEL</small><strong>Vlaga tla u središtu polja</strong><p>Plavi marker pokazuje aktualnu vrijednost modela, ne senzor na parceli.</p></div><button data-modal="procjena">›</button></article><article class="focus-finding"><span class="signal terrain"></span><div><small>VEGETACIJA · SATELITSKI RASTER</small><strong>NDVI za zadnji dostupan mjesec</strong><p>Koristite ga za usporedbu vegetacijskog signala, ne za identifikaciju usjeva.</p></div><button data-modal="procjena">›</button></article>`,
    history: `<article class="focus-finding"><span class="signal trend"></span><div><small>STANIŠTE · BIOPORTAL</small><strong>Kartirano stanište u mjerilu 1:25 000</strong><p>Uključite sloj Staništa RH. On prikazuje tip staništa, a ne popis autohtonih biljaka na čestici.</p></div><button data-modal="procjena">›</button></article><article class="focus-finding"><span class="signal terrain"></span><div><small>LOKALNE BILJKE · ZA PROVJERU</small><strong>Vrste se biraju tek nakon terenskog obilaska</strong><p>Javna karta staništa je polazište za popis lokalnih vrsta, ali ga sama ne može zamijeniti.</p></div><button data-modal="procjena">›</button></article><article class="focus-finding"><span class="signal trend"></span><div><small>USJEV · LOKALNI UNOS</small><strong>Vrsta usjeva nije satelitski sloj</strong><p>Usjev je podatak koji korisnik upisuje uz polje; karta ga ne izmišlja.</p></div><button data-modal="procjena">›</button></article>`
  };
  document.querySelectorAll('[data-inspector]').forEach(button => button.classList.toggle('active', button.dataset.inspector === tab));
  document.querySelector('#inspector-content').innerHTML = content[tab];
}
function openWorkspaceModalLegacy(section) {
  const modal = document.querySelector('#workspace-dialog'); const title = document.querySelector('#workspace-title'); const kicker = document.querySelector('#workspace-kicker'); const content = document.querySelector('#workspace-content');
  const screens = {
    rizici: { kicker: 'UPRAVLJANJE RIZIKOM', title: 'Upozorenja i rad', html: `<div class="modal-list"><article><span class="modal-signal urgent"></span><div><strong>Moguća jača kiša</strong><p>Provjerite odvodnju prije oborine.</p></div><button class="outline-button">Označi provjerenim</button></article><article><span class="modal-signal"></span><div><strong>Moguć mraz</strong><p>Potvrdite službenu prognozu prije radnje.</p></div><button class="outline-button">Dodaj u plan</button></article></div>` },
    scenariji: { kicker: 'PLANIRANJE', title: 'Scenariji sjetve', html: `<p class="modal-intro">Usporedite datum sjetve prema tri pitanja: hoće li tlo biti dovoljno toplo, je li veći rizik mraza i hoće li usjev ući u sušniji dio sezone.</p><div class="modal-controls"><label>Usjev<select id="scenario-crop"><option>Kukuruz</option><option>Suncokret</option><option>Soja</option></select></label><label>Planirani datum<input id="scenario-date" type="date" value="2027-04-18"></label><button class="primary-button" id="compare-sowing">Usporedi</button></div><div class="scenario-compare"><article><strong>18. travnja · ranije</strong><p><b>Mraz:</b> veća izloženost</p><p><b>Vlaga tla:</b> obično povoljnija</p><p><b>Ljetna suša:</b> manja izloženost</p></article><article><strong>3. svibnja · kasnije</strong><p><b>Mraz:</b> manja izloženost</p><p><b>Vlaga tla:</b> provjeriti na terenu</p><p><b>Ljetna suša:</b> veća izloženost</p></article></div><div class="scenario-result" id="scenario-result">Odaberite usjev i datum pa pritisnite “Usporedi”. Rezultat nije preporuka sjetve bez stvarne temperature tla i prognoze.</div>` },
    bioraznolikost: { kicker: 'PRIRODNA INFRASTRUKTURA', title: 'Bioraznolikost', html: `<p class="modal-intro">Odaberite što želite poboljšati. Aplikacija predlaže mjeru, položaj i što treba provjeriti prije izvedbe.</p><div class="modal-controls"><label>Cilj<select id="bio-goal"><option value="pollinators">Oprašivači</option><option value="water">Zadržavanje vode</option><option value="erosion">Smanjenje erozije</option></select></label><label>Položaj<select id="bio-zone"><option>Južni rub polja</option><option>Rub uz odvodni koridor</option><option>Zapadni kut</option></select></label><button class="primary-button" id="show-bio-plan">Prikaži plan</button></div><div class="bio-plan" id="bio-plan">Odaberite cilj i položaj, zatim prikažite plan.</div>` },
    dnevnik: { kicker: 'PRIVATNI PODACI', title: 'Dnevnik polja', html: `<div class="modal-toolbar"><span>Zapisi ostaju u ovom pregledniku</span><button class="primary-button" id="modal-new-entry">＋ Novi zapis</button></div><div class="modal-list">${state.entries.slice(0, 3).map(entry => `<article><time>${formatDate(entry.date)}</time><div><strong>${entry.type}</strong><p>${escapeHtml(entry.note)}</p></div></article>`).join('')}</div>` },
    izvori: { kicker: 'PROVENIJENCIJA', title: 'Izvori i slojevi', html: `<div class="modal-list"><article><span class="modal-signal green"></span><div><strong>Staništa RH · Bioportal</strong><p>Kartirani kopneni nešumski tipovi staništa RH u mjerilu 1:25 000, s najmanjom jedinicom 1,56 ha. Klik na kartu vraća puni naziv staništa, ne samo šifru.</p><small>Bioportal / Zavod za zaštitu okoliša i prirode · karta 2016.</small></div></article><article><span class="modal-signal green"></span><div><strong>ARKOD parcele · aktualno</strong><p>Granice uporabe poljoprivrednog zemljišta, vektorizirane na ortofoto podlogama. Ovo nisu granice vlasništva.</p><small>Agencija za plaćanja · osvježavanje tjedno</small></div></article><article><span class="modal-signal green"></span><div><strong>Usjevi EU · 10 m · 2022.</strong><p>JRC klasifikacija usjeva i pokrova oblikovana za pojedinačna polja. Referentna je za 2022., nije trenutačni upis usjeva.</p><small>Europska komisija / JRC · 10-metarski raster</small></div></article><article><span class="modal-signal blue"></span><div><strong>pH tla · SoilGrids</strong><p>Globalni model pH tla u vodi, dubina 0–5 cm i razlučivost 250 m. Ne zamjenjuje laboratorijski uzorak.</p><small>ISRIC – World Soil Information · CC BY 4.0</small></div></article><article><span class="modal-signal blue"></span><div><strong>Vegetacija i temperatura · NASA</strong><p>NDVI iz MODIS Terre i mjesečna temperatura zraka 2 m iz MERRA-2. To su regionalni rasteri, ne očitanja sa senzora na parceli.</p><small>NASA GIBS · globalni otvoreni podaci</small></div></article><article><span class="modal-signal blue"></span><div><strong>Vrijeme i vlaga tla · Open-Meteo</strong><p>Prognostička vrijednost za središte odabranog polja: temperatura, oborina, vjetar i vlaga tla.</p><small>Open-Meteo · točka polja</small></div></article></div>` },
    procjena: { kicker: '', title: 'Stanje i potencijal', html: `<section class="ai-analysis"><p class="analysis-lead">Sažetak provjerljivih slojeva za pripremu obilaska.</p><div class="analysis-grid"><article><strong>Stanište</strong><p>Bioportalova karta prikazuje tipove kopnenih nešumskih staništa pri mjerilu 1:25 000. Ne može potvrditi pojedinu autohtonu vrstu bez obilaska.</p></article><article><strong>Zemlja</strong><p>SoilGrids prikazuje model pH tla 0–5 cm pri 250 m. Za gnojidbu trebaju laboratorijski pH, organska tvar i hranjiva.</p></article><article><strong>Voda</strong><p>Marker pokazuje prognostičku vlagu tla i oborinu za središte polja. Provjerite stanje na terenu prije radnje.</p></article><article><strong>Vegetacija</strong><p>NASA NDVI daje mjesečni vegetacijski signal. Ne potvrđuje vrstu usjeva ni zdravstveno stanje biljke.</p></article></div><section class="raw-inputs"><strong>Na čemu se temelji pregled</strong><ul><li>granica polja koju je unio korisnik i satelitska snimka</li><li>Bioportal: karta kopnenih nešumskih staništa RH 2016</li><li>ISRIC SoilGrids: globalni model pH tla</li><li>NASA GIBS: MODIS NDVI i MERRA-2 temperatura</li><li>Open-Meteo: prognostičke vrijednosti za središte polja</li></ul></section><p class="analysis-note">Slojevi pomažu odabrati gdje i što provjeriti; ne zamjenjuju uzorkovanje tla, mjerenje ni stručnu procjenu.</p></section>` }
  };
  const screen = screens[section]; if (!screen) return; kicker.textContent = screen.kicker; kicker.hidden = !screen.kicker; title.textContent = screen.title; content.innerHTML = screen.html; modal.showModal();
  document.querySelector('#modal-new-entry')?.addEventListener('click', () => { modal.close(); openDialog('#entry-dialog'); });
  document.querySelector('#compare-sowing')?.addEventListener('click', () => { const crop = document.querySelector('#scenario-crop').value; const date = document.querySelector('#scenario-date').value; const result = document.querySelector('#scenario-result'); result.textContent = `${crop} · ${formatDate(date)}: birajte tek nakon provjere temperature tla i sljedećih 7 dana prognoze. Raniji termin više štiti od ljetne suše, a kasniji više smanjuje izloženost mrazu.`; });
  document.querySelector('#show-bio-plan')?.addEventListener('click', () => { const goal = document.querySelector('#bio-goal').value; const zone = document.querySelector('#bio-zone').value; const plans = { pollinators: ['Rubni cvjetni pojas', 'Jednogodišnji cvjetni pokrov najbrže daje cvatnju. Prije sjetve provjerite lokalne zavičajne vrste.'], water: ['Zeleni filter-pojas', 'Pojas na odabranom rubu može usporiti otjecanje. Ne mijenja odvodnju bez projekta i dozvola.'], erosion: ['Trajni travni rub', 'Pojas postavite poprečno na smjer pada. Potvrdite nagib prije preciznog smještaja.'] }; const plan = plans[goal]; document.querySelector('#bio-plan').innerHTML = `<strong>${plan[0]} · ${zone}</strong><p>${plan[1]}</p><p>Sljedeće: obilazak ruba, potvrda vlasništva i lokalna provjera sastava vrste.</p>`; });
}
function setInspector(tab) {
  const content = {
    now: `<article class="advice-card"><span class="advice-kicker">PREGLED POLJA</span><strong id="field-summary">Pripremam sažetak polja…</strong><p class="weather-readout" id="weather-readout">Učitavam procjenu vremena za središte polja…</p><section class="nature-action"><i aria-hidden="true">✦</i><div><span>ZAVIČAJNI RUB</span><p id="environment-guidance">Pripremam savjet za rub polja…</p></div></section><button class="outline-button" data-modal="procjena">Detalji</button></article>`,
    week: `<article class="focus-finding"><span class="signal terrain"></span><div><small>TLO · TERENSKA PROVJERA</small><strong>Analiza uzorka tla</strong><p>Javni sloj nije dovoljno detaljan za odluku na razini polja. Evidentirajte laboratorijski nalaz uz polje.</p></div><button data-modal="procjena">›</button></article><article class="focus-finding"><span class="signal water"></span><div><small>VODA · PROGNOZA</small><strong>Vrijeme za središte polja</strong><p>Procjena je dostupna u pregledu polja, bez markera na karti. Nije očitanje senzora.</p></div><button data-modal="procjena">›</button></article>`,
    history: `<article class="focus-finding"><span class="signal trend"></span><div><small>STANIŠTE · BIOPORTAL</small><strong>Kartirano stanište u mjerilu 1:25 000</strong><p>Uključite sloj Staništa RH. On prikazuje tip staništa, a ne popis autohtonih biljaka na čestici.</p></div><button data-modal="procjena">›</button></article><article class="focus-finding"><span class="signal terrain"></span><div><small>LOKALNE BILJKE · ZA PROVJERU</small><strong>Vrste se biraju tek nakon terenskog obilaska</strong><p>Javna karta staništa je polazište za popis lokalnih vrsta, ali ga sama ne može zamijeniti.</p></div><button data-modal="procjena">›</button></article><article class="focus-finding"><span class="signal trend"></span><div><small>USJEV · JRC 2022.</small><strong>Klasifikacija pokrova pri 10 m</strong><p>Uključite Usjevi EU, zatim kliknite kartu za klasu na toj točki.</p></div><button data-modal="procjena">›</button></article>`
  };
  document.querySelectorAll('[data-inspector]').forEach(button => button.classList.toggle('active', button.dataset.inspector === tab));
  document.querySelector('#inspector-content').innerHTML = content[tab];
  if (tab === 'now') { updateLiveWeather(); refreshFieldSummary(); }
}

function openWorkspaceModal(section) {
  openWorkspaceModalLegacy(section);
  const content = document.querySelector('#workspace-content');
  if (!content || section === 'izvori' && !content) return;
  if (section === 'izvori') {
    content.innerHTML = `<p class="analysis-note" id="live-open-data-status">Provjeravam aktualne metapodatke na Portalu otvorenih podataka…</p><div class="modal-list"><article><span class="modal-signal green"></span><div><strong>Staništa RH · Bioportal</strong><p>Kartirani kopneni nešumski tipovi staništa RH u mjerilu 1:25 000. Klik na poligon vraća puni naziv.</p><small>Bioportal / Zavod za zaštitu okoliša i prirode · karta 2016.</small></div></article><article><span class="modal-signal green"></span><div><strong>ARKOD parcele · aktualno</strong><p>Neprijeljene poljoprivredne površine prema uporabi zemljišta. To nisu granice vlasništva ni katastarske čestice.</p><small>Agencija za plaćanja · osvježavanje tjedno</small></div></article><article><span class="modal-signal green"></span><div><strong>Usjevi EU · 10 m · 2022.</strong><p>JRC klasifikacija usjeva i pokrova. Klikom na kartu dobiva se klasa za odabranu točku.</p><small>Europska komisija / JRC · referentna godina 2022.</small></div></article><article><span class="modal-signal blue"></span><div><strong>Vrijeme za polje · Open-Meteo</strong><p>Prognostička vrijednost za geometrijsko središte aktivnog polja. Prikazuje se kao sažetak, ne kao karta ili mjerenje senzora.</p><small>Open-Meteo · točka polja</small></div></article></div>`;
    refreshOpenDataStatus();
  }
  if (section === 'procjena') content.innerHTML = `<section class="ai-analysis"><p class="analysis-lead">Sažetak dostupnih slojeva za pripremu obilaska.</p><div class="analysis-grid"><article><strong>Stanište</strong><p>Bioportal prikazuje tip kartiranog staništa, ne potvrđuje pojedinu vrstu bez obilaska.</p></article><article><strong>Uporaba zemljišta</strong><p>ARKOD daje granice prijavljene poljoprivredne uporabe; ne potvrđuje vlasništvo.</p></article><article><strong>Pokrov / usjev</strong><p>JRC sloj ima 10-metarsku klasifikaciju za 2022. Klik na kartu daje klasu za točku.</p></article><article><strong>Vrijeme</strong><p>Prognoza se računa za središte polja. Za lokalne razlike i tlo potreban je obilazak ili senzor.</p></article></div><section class="raw-inputs"><strong>Na čemu se temelji pregled</strong><ul><li>granica polja koju je unio korisnik i satelitska snimka</li><li>Bioportal: karta kopnenih nešumskih staništa RH 2016</li><li>ARKOD: aktualne granice uporabe poljoprivrednog zemljišta</li><li>JRC: klasifikacija pokrova / usjeva za 2022.</li><li>Open-Meteo: prognoza za geometrijsko središte polja</li></ul></section><p class="analysis-note">Slojevi služe za odabir što provjeriti na terenu; ne zamjenjuju mjerenje ni stručnu procjenu.</p></section>`;
}

function initRealMap() {
  const container = document.querySelector('#real-map');
  if (!container || !window.L) return;
  document.querySelectorAll('[data-map-layer="soil"], [data-map-layer="ndvi"], [data-map-layer="temperature"], [data-map-layer="weather"]').forEach(input => input.closest('label')?.remove());
  liveMap = L.map(container, { zoomControl: false, attributionControl: false, minZoom: 12, maxZoom: 18 }).setView([45.63, 18.81], 15);
  imageryOverlay = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18, maxNativeZoom: 18, attribution: 'Snimka © Esri, Maxar, Earthstar Geographics'
  }).addTo(liveMap);
  dataOverlays.habitats = L.layerGroup();
  dataOverlays.arkod = L.tileLayer.wms('https://servisi.apprrr.hr/NIPP/wms', {
    layers: 'hr.land_parcels', format: 'image/png', transparent: true, version: '1.3.0', opacity: .62, className: 'arkod-overlay', attribution: 'ARKOD: Agencija za plaćanja'
  });
  dataOverlays.crop2022 = L.tileLayer.wms('https://jeodpp.jrc.ec.europa.eu/jeodpp/services/ows/wms/landcover/eucropmap', {
    layers: 'LC.EUCROPMAP.2022', styles: 'default', format: 'image/png', transparent: true, version: '1.1.1', crs: L.CRS.EPSG4326, opacity: .42, className: 'crop-overlay', attribution: 'Usjevi 2022: Europska komisija / JRC'
  });
  fieldRecords.forEach(buildFieldOverlay);
  renderFieldControls(); refreshFieldPresentation();
  const status = document.querySelector('#map-status');
  imageryOverlay.once('load', () => { if (status) status.textContent = 'Snimka: Esri, Maxar'; });
  imageryOverlay.on('tileerror', () => { if (status) status.textContent = 'Satelitska snimka · trenutačno nedostupna'; });
  document.querySelector('#map-zoom-in')?.addEventListener('click', () => { if (liveMap.getZoom() < liveMap.getMaxZoom()) liveMap.zoomIn(); });
  document.querySelector('#map-zoom-out')?.addEventListener('click', () => liveMap.zoomOut());
  document.querySelector('[data-map-layer="imagery"]')?.addEventListener('change', event => event.target.checked ? imageryOverlay.addTo(liveMap) : liveMap.removeLayer(imageryOverlay));
  const layerText = {
    habitats: 'Staništa RH · Bioportal 1:25 000, najmanje 1,56 ha · kliknite kartu za naziv',
    arkod: 'ARKOD parcele · aktualne granice uporabe, osvježavanje tjedno',
    crop2022: 'Usjevi EU · JRC klasifikacija 10 m za 2022. godinu'
  };
  Object.entries(dataOverlays).forEach(([id, overlay]) => {
    const input = document.querySelector(`[data-map-layer="${id}"]`);
    if (input?.checked && !liveMap.hasLayer(overlay)) overlay.addTo(liveMap);
    input?.addEventListener('change', event => {
      event.target.checked ? overlay.addTo(liveMap) : liveMap.removeLayer(overlay);
      if (id === 'habitats') {
        const detail = document.querySelector('#habitat-detail');
        if (detail) { detail.hidden = !event.target.checked; detail.textContent = event.target.checked ? 'Kliknite poligon za naziv staništa.' : ''; }
        if (event.target.checked) loadHabitatVector(); else { habitatLoadSequence += 1; dataOverlays.habitats.clearLayers(); }
      }
      if (id === 'crop2022') {
        document.querySelector('#crop-legend').hidden = !event.target.checked;
        const detail = document.querySelector('#crop-detail');
        if (detail) { detail.hidden = !event.target.checked; detail.textContent = event.target.checked ? 'Kliknite kartu za usjev / pokrov na toj točki.' : ''; }
        if (!event.target.checked && cropResultMarker) { liveMap.removeLayer(cropResultMarker); cropResultMarker = undefined; }
      }
      if (status) status.textContent = event.target.checked ? layerText[id] : `${layerText[id]} · skriveno`;
    });
  });
  liveMap.on('click', event => { if (isDrawing) addDrawingPoint(event.latlng); else { inspectHabitat(event.latlng); inspectCrop(event.latlng); } });
  liveMap.on('moveend', () => { if (document.querySelector('[data-map-layer="habitats"]')?.checked) loadHabitatVector(); });
}
function toggleDrawing() {
  if (!liveMap) return;
  const button = document.querySelector('#draw-field'); const status = document.querySelector('#map-status');
  if (!isDrawing) {
    isDrawing = true; drawingPoints = []; draftingLine?.remove(); draftingLine = null;
    document.body.classList.add('draw-mode'); button.textContent = '✓ Završi crtanje';
    if (status) { status.textContent = 'Kliknite najmanje 3 točke uz rub polja'; status.classList.add('drawing-hint'); }
    return;
  }
  isDrawing = false; document.body.classList.remove('draw-mode'); button.textContent = '＋ Nacrtaj polje';
  if (drawingPoints.length < 3) {
    draftingLine?.remove(); draftingLine = null;
    if (status) { status.textContent = 'Potrebne su najmanje 3 točke'; status.classList.remove('drawing-hint'); }
    return;
  }
  draftingLine?.remove(); draftingLine = null;
  const hectares = estimateHectares(drawingPoints);
  const field = { id: `polje-${Date.now()}`, name: 'Novo polje', area: `${hectares.toLocaleString('hr-HR', { maximumFractionDigits: 1 })} ha`, crop: 'nije odabrano', visible: true, coords: drawingPoints.map(point => [point.lat, point.lng]) };
  fieldRecords.push(field); saveFields(); buildFieldOverlay(field); selectField(field.id, true); openRenameFieldDialog();
  if (status) { status.textContent = `Novo polje · ${field.area}`; status.classList.remove('drawing-hint'); }
}
function addDrawingPoint(latlng) {
  drawingPoints.push(latlng);
  if (!draftingLine) draftingLine = L.polyline(drawingPoints, { color: '#ff613d', weight: 3, dashArray: '7 7' }).addTo(liveMap);
  else draftingLine.setLatLngs(drawingPoints);
  const status = document.querySelector('#map-status'); if (status) status.textContent = `${drawingPoints.length} ${drawingPoints.length === 1 ? 'točka' : drawingPoints.length < 5 ? 'točke' : 'točaka'} · kliknite sljedeći rub ili završite`;
}
function estimateHectares(points) {
  const latitude = points.reduce((sum, point) => sum + point.lat, 0) / points.length * Math.PI / 180;
  const metrePerLat = 111132; const metrePerLng = 111320 * Math.cos(latitude); let twiceArea = 0;
  for (let index = 0; index < points.length; index += 1) { const next = points[(index + 1) % points.length]; twiceArea += (points[index].lng * metrePerLng) * (next.lat * metrePerLat) - (next.lng * metrePerLng) * (points[index].lat * metrePerLat); }
  return Math.abs(twiceArea / 2) / 10000;
}
function exportFieldPdf() {
  const field = activeField(); if (!field) return;
  const evidence = fieldEvidence(field);
  const summary = document.querySelector('#field-summary')?.textContent || localFieldSummary(evidence);
  const safe = value => escapeHtml(String(value || 'nije evidentirano'));
  document.querySelector('#field-report-content').innerHTML = `<header><span>Kuna · izvješće polja</span><h1>${safe(field.name)}</h1><p>${safe(field.area)} · izrađeno ${safe(new Date().toLocaleDateString('hr-HR'))}</p></header><section><h2>Usjev koji je unio korisnik</h2><div class="report-grid"><article><strong>${safe(field.crop)}</strong><small>Sorta / napomena: ${safe(field.variety)}</small></article><article><strong>${field.plantedOn ? safe(formatDate(field.plantedOn)) : 'Datum nije evidentiran'}</strong><small>Datum sjetve ili sadnje</small></article></div></section><section><h2>Sažetak stanja</h2><p>${safe(summary)}</p></section><section><h2>Otvoreni podaci i kontekst</h2><div class="report-grid"><article><strong>Stanište</strong><small>${safe(evidence.habitat)}</small></article><article><strong>Usjev / pokrov 2022.</strong><small>${safe(evidence.crop_map_2022)}</small></article><article><strong>Vrijeme za središte polja</strong><small>${safe(evidence.weather)}</small></article><article><strong>ARKOD</strong><small>Granice uporabe zemljišta; nisu vlasništvo.</small></article></div></section><section><h2>Upozorenja i sljedeći koraci</h2><p class="report-note"><strong>Moguć mraz i jača kiša.</strong> Prije radnje provjerite službenu prognozu, odvodnju i stanje na terenu. Zabilježite obilazak i po potrebi uzmite uzorak tla.</p></section><p class="report-disclaimer">Podrška odluci - izvješće ne zamjenjuje terensko mjerenje, laboratorijsku analizu ni stručnu procjenu.</p>`;
  document.querySelector('#field-report-dialog').showModal();
}
function exportReport() { const report = { title: 'Kuna — izvještaj polja', generatedAt: new Date().toISOString(), field: 'Južna njiva, 4,8 ha', disclaimer: 'Podrška odluci; nije agronomski savjet.', findings, scenarios: state.scenarios, sources }; const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'kuna-izvjestaj-juzna-njiva.json'; a.click(); URL.revokeObjectURL(url); }

renderFindings(); renderScenarios(); renderTimeline(); renderTasks(); renderJournal(); renderBio(); renderSources(); initRealMap(); setInspector('now');
