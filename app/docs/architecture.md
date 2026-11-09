# Arhitektura i privatnost

## Implementirani prototip

```text
Preglednik
  ├─ Esri World Imagery (raster)
  ├─ Bioportal WFS/WMS (staništa RH)
  ├─ ARKOD WMS (parcele)
  ├─ JRC WMS (EU Crop Map 2022)
  └─ Open-Meteo API (prognozna vrijednost za središte polja)
                ↓
          server.py
  ├─ /api/eucrop: ograničeni GetFeatureInfo proxy prema JRC-u
  ├─ /api/open-data-status: živa provjera metapodataka preko data.gov.hr CKAN API-ja
  ├─ /api/field-summary: kratki sažetak uz provjeru lokalnog LLM-a
  └─ /api/assistant: slobodno pitanje uz ograničeni kontekst i provjeru odgovora
                ↓
    Ollama na istom poslužitelju (qwen2.5:3b)
```

Granice polja, kultura i dnevnik su lokalni podaci preglednika (`localStorage`). Aplikacija ih ne šalje javnim izvorima. U lokalnoj demonstraciji kompaktan kontekst odabranog polja šalje se samo lokalnom Ollama poslužitelju; bez pokrenutog modela chat ne daje izmišljeni odgovor, nego javlja da LLM nije dostupan.

## Kontrola AI odgovora

- Model dobiva samo pitanje, ograničeni kontekst odabranog polja i popis izvora.
- Uputa zabranjuje izmišljanje mjerenja, vrsta, prognoza, vlasništva, pravnih obveza i agronomskih tretmana.
- Poslužitelj provjerava strukturu odgovora i odbacuje poznate neosnovane zaključke. Tada se vraća odgovor sastavljen samo od evidentiranih činjenica te se to označava u sučelju.
- LLM nema ovlast mijenjati granice, pragove rizika ni zaključke službenih izvora.

## Značenje javnih izvora

- **data.gov.hr CKAN API** provjerava aktualne metapodatke, izdavača, dozvolu i datum izmjene za odabrane DGU skupove; lokalna CSV snimka nije izvor u radu aplikacije.
- **Bioportal, ARKOD i JRC** pozivaju se kao živi WFS/WMS servisi. JRC klasifikacija je povijesna (2022.), a ARKOD opisuje uporabu, ne vlasništvo.
- **Open-Meteo** vraća prognostičku vrijednost za geometrijsko središte polja, a ne očitanje senzora na parceli.

## Produkcijski sljedeći korak

Za višekorisničku uporabu potreban je zaseban API s autentikacijom, PostGIS spremištem, kontrolom pristupa po gospodarstvu i polju, evidencijom privola, pohranom provenijencije i rotacijom logova. Te komponente nisu dio ovog prototipa i ne smiju se predstavljati kao implementirane.
