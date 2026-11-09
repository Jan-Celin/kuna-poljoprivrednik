# Pretpostavke i ograničenja prototipa

## Što je stvarno, a što demonstracija

- Registar izvora koristi stvarne zapise iz lokalnog izvoda kataloga `data.gov.hr` te službene izvore Bioportala, ARKOD-a, JRC-a i Open-Meteo.
- Podloga karte je satelitska snimka **Esri World Imagery**. DGU ortofoto, hidrografija i topografska karta ostaju evidentirani javni izvori za prostorni kontekst, ali njihovi WMS prikazi nisu uključeni u kartu jer servis dodaje ponovljeni vodeni žig. Granica prikazanog polja služi za prikaz rada aplikacije i nije katastarski zapis.
- Slojevi pH tla, NDVI i mjesečne temperature nisu prikazani: dostupni javni rasteri koje smo provjerili nisu dovoljno detaljni ni dovoljno ažurni za zaključak o pojedinoj mikro-zoni unutar parcele.
- Sloj **Staništa RH** koristi službenu Bioportalovu kartu kopnenih nešumskih staništa iz 2016., mjerila 1:25 000 i najmanje kartirane jedinice 1,56 ha. Prikazuje tip staništa, ne potvrđuje prisutnost određene autohtone biljne vrste na polju.
- Sloj **ARKOD parcele** daje aktualne granice uporabe poljoprivrednog zemljišta, a ne podatak o vlasništvu. Sloj **Usjevi EU 2022.** je 10-metarska JRC klasifikacija za referentnu godinu 2022.; ne smije se tumačiti kao trenutačni usjev.
- Vrijeme i vlaga tla su aktualne **prognostičke vrijednosti** za geometrijsko središte odabranog polja, a ne mjerenje s privatnog senzora. Prikazuju se u pregledu polja, ne kao marker na karti. Rizici se prikazuju kao upute za provjeru, ne kao potvrđena prognoza.
- Pravokutnici “Voda i odvodnja”, “Tlo”, simulirani temperaturni krug, smjer otjecanja i sloj usjeva uklonjeni su jer nisu potjecali iz mjerenog prostornog izvora.
- Prijedlozi bioraznolikosti su koncepti položaja / mjera. Ne navode vrstu za sadnju bez lokalne potvrde zavičajnosti i aktualnog prostornog presjeka.

## Prototipni pragovi

U `src/app.js` scenarij datum dijeli u tri sezonska prozora. Prikazano “67 / 100” nije ocjena podobnosti parcele, već kombinirani pokazatelj pokrivenosti demonstracijskih ulaza i izloženosti. Produkcija mora držati pragove u verzioniranoj konfiguraciji, uz stručnu reviziju, jedinice, objašnjenje i testove.

Primjer pravila za produkciju:

```ts
if (forecast.rainNext72hMm >= threshold && field.inDefendedArea) {
  return {
    type: 'WATERLOGGING_CONTEXT',
    finding: 'Moguć vodni stres za provjeru',
    evidence: ['službena prognoza', 'vodni sloj'],
    assumptions: ['prag je prototipan'],
    confidence: 'srednje',
    sourceIds: ['FORECAST', 'CRO_WATER']
  };
}
```

## Sigurnosni ton

Kuna ne obećava prinos, ne dijagnosticira bolest, ne propisuje tretman i ne daje pravni ili financijski savjet. Svaka radnja je “provjerite”, “razmotrite” ili “potvrdite”, uz vidljive dokaze i ograničenja.
