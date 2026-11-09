#!/usr/bin/env python3
"""Local HTTP server with a narrowly scoped JRC crop-query proxy."""

import json
import os
import re
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import Request, urlopen

JRC_WMS = 'https://jeodpp.jrc.ec.europa.eu/jeodpp/services/ows/wms/landcover/eucropmap'
DATA_GOV_API = 'https://data.gov.hr/ckan/api/3/action/package_show?id='
OLLAMA_URL = os.environ.get('KUNA_OLLAMA_URL', 'http://127.0.0.1:11434')
OLLAMA_MODEL = os.environ.get('KUNA_OLLAMA_MODEL', 'qwen2.5:3b')
PORTAL_PACKAGES = {
    'DGU-ORTO': 'digitalni-ortofoto-u-mjerilu-1-5000-2021-godina',
    'DGU-HIDRO': 'hidrografija-inspire',
    'DGU-VISINE': 'visine-inspire',
}
PORTAL_CACHE = {'until': 0, 'sources': []}
TRANSLATIONS = {
    'Artificial': 'Umjetne površine', 'Common wheat': 'Obična pšenica', 'Durum wheat': 'Durum pšenica',
    'Barley': 'Ječam', 'Rye': 'Raž', 'Oats': 'Zob', 'Maize': 'Kukuruz', 'Rice': 'Riža',
    'Triticale': 'Tritikale', 'Other cereals': 'Ostale žitarice', 'Potatoes': 'Krumpir',
    'Sugar beet': 'Šećerna repa', 'Other root crops': 'Ostali korjenasti usjevi',
    'Other non permanent industrial crops': 'Ostali industrijski usjevi', 'Sunflower': 'Suncokret',
    'Rape and turnip rape': 'Uljana repica', 'Soya': 'Soja', 'Dry pulses': 'Suhe mahunarke',
    'Fodder crops (cereals and leguminous)': 'Krmni usjevi', 'Bare arable land': 'Golo obradivo tlo',
    'Woodland and Shrubland (incl. permanent crops)': 'Šume i grmlje, uključujući trajne nasade',
    'Grasslands': 'Travnjaci', 'Bare and/or lichens moss': 'Golo prirodno tlo', 'Water': 'Voda', 'Wetlands': 'Močvare'
}


class AppHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = urlparse(self.path).path
        if path == '/api/eucrop':
            self.crop_query()
            return
        if path == '/api/open-data-status':
            self.open_data_status()
            return
        if path == '/api/ai-status':
            self.ai_status()
            return
        super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path == '/api/field-summary':
            self.field_summary()
            return
        if urlparse(self.path).path == '/api/assistant':
            self.assistant_answer()
            return
        self.send_error(404, 'Not found')

    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json(self, limit=8192):
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if length < 1 or length > limit:
                raise ValueError
            payload = json.loads(self.rfile.read(length).decode('utf-8'))
            if not isinstance(payload, dict):
                raise ValueError
            return payload
        except (ValueError, json.JSONDecodeError):
            self.send_error(400, 'Invalid JSON data')
            return None

    @staticmethod
    def compact(value, fallback='nije evidentirano', limit=320):
        text = ' '.join(str(value if value is not None else fallback).split())
        return text[:limit] or fallback

    def call_ollama(self, system_prompt, user_prompt, max_tokens=220):
        request = Request(
            f'{OLLAMA_URL.rstrip("/")}/api/chat',
            data=json.dumps({
                'model': OLLAMA_MODEL,
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_prompt}
                ],
                'stream': False,
                'options': {'temperature': 0.05, 'num_predict': max_tokens}
            }).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urlopen(request, timeout=35) as response:
            answer = json.loads(response.read().decode('utf-8')).get('message', {}).get('content', '')
        answer = ' '.join(answer.split())
        if not answer:
            raise ValueError('Empty model response')
        return answer[:1200]

    @staticmethod
    def model_answer_is_safe(answer, facts):
        lowered = answer.lower()
        blocked = (
            'habitat za ', 'živa biota', 'vrste kukuruza', 'odgovarajućem habitatu',
            'preporučuje se gnojidba', 'vodne usluge', 'dozvoljena voda',
        )
        evidence_tokens = [
            str(facts.get('field_name', '')).lower(), str(facts.get('crop', '')).lower(),
            str(facts.get('habitat', '')).lower(), str(facts.get('weather', '')).lower(),
        ]
        evidence_tokens = [token for token in evidence_tokens if len(token) >= 5 and not token.startswith('nije ')]
        return (
            len(answer) <= 700
            and 'poznato:' in lowered
            and 'provjeriti:' in lowered
            and not any(fragment in lowered for fragment in blocked)
            and any(token in lowered for token in evidence_tokens)
        )

    def grounded_assistant_fallback(self, question, facts):
        if facts.get('field_name') == 'nije odabrano polje':
            return ('Poznato: Nije odabrano polje, pa nema prostornog konteksta za tumačenje. '
                    'Provjeriti: Odaberite ili nacrtajte polje kako bi se mogli povezati karta, stanište, usjev i vrijeme.')
        field = self.compact(facts.get('field_name'), 'odabrano polje', 80)
        crop = self.compact(facts.get('crop'), 'nije evidentirano', 80)
        weather = self.compact(facts.get('weather'), 'trenutačno nije dostupno', 220)
        habitat = self.compact(facts.get('habitat'), 'nije očitano', 160)
        ecology = self.compact(facts.get('ecology_guidance'), 'Provjerite stvarno stanje na terenu.', 300)
        lowered = question.lower()
        checks = []
        if any(token in lowered for token in ('kiš', 'oborin', 'poplav', 'voda')):
            checks.append('U dostavljenom kontekstu nema prognoze najavljene kiše, zato prije radnje provjerite službenu prognozu i odvodnju.')
        if habitat == 'nije očitano':
            checks.append('Kartirano stanište za polje nije očitano; provjerite ga na karti ili pri obilasku.')
        checks.append(ecology)
        return f'Poznato: Za {field} evidentiran je usjev {crop}. Dostupno vrijeme: {weather}. Provjeriti: ' + ' '.join(checks[:2])

    def ai_status(self):
        try:
            with urlopen(f'{OLLAMA_URL.rstrip("/")}/api/tags', timeout=3) as response:
                models = json.loads(response.read().decode('utf-8')).get('models', [])
            available = any(item.get('name') == OLLAMA_MODEL or item.get('model') == OLLAMA_MODEL for item in models)
            self.send_json({'available': available, 'model': OLLAMA_MODEL})
        except Exception:
            self.send_json({'available': False, 'model': OLLAMA_MODEL})

    def open_data_status(self):
        now = time.time()
        if now >= PORTAL_CACHE['until']:
            checked = []
            for source_id, package in PORTAL_PACKAGES.items():
                try:
                    with urlopen(f'{DATA_GOV_API}{package}', timeout=12) as response:
                        payload = json.loads(response.read().decode('utf-8'))
                    result = payload.get('result', {}) if payload.get('success') else {}
                    checked.append({
                        'id': source_id,
                        'title': self.compact(result.get('title'), package, 140),
                        'license': self.compact(result.get('license_title'), 'nije navedena', 90),
                        'modified': self.compact(result.get('metadata_modified'), 'nije navedeno', 48),
                        'url': f'https://data.gov.hr/ckan/dataset/{package}'
                    })
                except Exception:
                    checked.append({'id': source_id, 'unavailable': True})
            PORTAL_CACHE.update({'until': now + 900, 'sources': checked})
        self.send_json({'checked_at': int(now), 'sources': PORTAL_CACHE['sources'], 'api': 'data.gov.hr CKAN API'})

    def field_summary(self):
        data = self.read_json(4096)
        if data is None:
            return
        def value(key, fallback='nije evidentirano', limit=160):
            return self.compact(data.get(key, fallback), fallback, limit)
        facts = {
            'field': value('field_name'), 'area': value('area'), 'crop': value('crop'),
            'variety': value('variety', ''), 'planted': value('planted_on', ''),
            'habitat': value('habitat'), 'map_crop': value('crop_map_2022'), 'weather': value('weather', 'trenutačno nije dostupno', 240),
            'ecology': value('ecology_guidance', 'Pri obilasku provjerite očuvani rub polja i stvarno stanje na terenu.', 440)
        }
        user_crop = f"{facts['crop']} ({facts['variety']})" if facts['variety'] else facts['crop']
        summary = (
            f"Usjev: {user_crop}. Kartirano stanište: {facts['habitat']}."
        )
        generated_by = 'pravila (LLM nije dostupan)'
        system_prompt = (
            "Odgovaraš isključivo na hrvatskom. Napiši jedan sažetak od najviše 24 riječi koristeći samo "
            "dostavljene činjenice. Ne izmišljaj mjerenja, prognoze, vrste, propise ni preporuke tretmana."
        )
        try:
            candidate = self.call_ollama(system_prompt, f'Činjenice: {json.dumps(facts, ensure_ascii=False)}', 90)
            if 20 <= len(candidate) <= 160 and not any(fragment in candidate.lower() for fragment in ('habitat za ', 'živa biota', 'vrste kukuruza')):
                summary = candidate
                generated_by = f'lokalni model ({OLLAMA_MODEL})'
            else:
                generated_by = 'pravila (LLM odgovor nije prošao provjeru)'
        except Exception:
            pass
        self.send_json({'summary': summary, 'generated_by': generated_by})

    def assistant_answer(self):
        data = self.read_json(12288)
        if data is None:
            return
        question = self.compact(data.get('question'), '', 600)
        if len(question) < 2:
            self.send_error(400, 'Question is required')
            return
        facts = data.get('facts') if isinstance(data.get('facts'), dict) else {}
        safe_facts = {key: self.compact(value, 'nije evidentirano', 360) for key, value in facts.items() if isinstance(key, str)}
        source_ids = ['BIOPORTAL-STANISTA', 'ARKOD-PARCELE', 'JRC-EUCROPMAP-2022', 'OPEN-METEO', 'DGU-HIDRO']
        system_prompt = (
            "Odgovaraš isključivo na hrvatskom. Ti si pomoćnik za poljoprivredno polje koji smije koristiti "
            "samo dostavljene činjenice. Ne izmišljaj vrste, mjerenja, vlasništvo, prognoze, pravne obveze "
            "ni agronomske tretmane. Ako odgovor nije u kontekstu, izravno reci da podatak nije dostupan. "
            "Odgovor mora imati najviše 90 riječi i točno dva kratka odlomka s naslovima 'Poznato:' i 'Provjeriti:'. "
            "Ne prikazuj HTML ni izvore u tekstu."
        )
        user_prompt = (
            f"Pitanje: {question}\n"
            f"Činjenice: {json.dumps(safe_facts, ensure_ascii=False)}\n"
            "Dostupni izvori: Bioportal staništa RH 2016; ARKOD parcele; JRC EU Crop Map 2022; "
            "Open-Meteo prognoza za središte polja; DGU hidrografija."
        )
        try:
            answer = self.call_ollama(system_prompt, user_prompt, 180)
        except Exception:
            self.send_json({
                'error': f'Lokalni LLM ({OLLAMA_MODEL}) nije dostupan. Pokrenite Ollama model na aplikacijskom poslužitelju.',
                'model': OLLAMA_MODEL,
                'source_ids': source_ids
            }, status=503)
            return
        if self.model_answer_is_safe(answer, safe_facts):
            self.send_json({'answer': answer, 'model': OLLAMA_MODEL, 'source_ids': source_ids, 'validated': True})
            return
        self.send_json({
            'answer': self.grounded_assistant_fallback(question, safe_facts),
            'model': OLLAMA_MODEL,
            'source_ids': source_ids,
            'validated': False
        })

    def crop_query(self):
        query = parse_qs(urlparse(self.path).query)
        try:
            lat = float(query['lat'][0])
            lng = float(query['lng'][0])
            if not (34 <= lat <= 72 and -12 <= lng <= 42):
                raise ValueError
        except (KeyError, ValueError, IndexError):
            self.send_error(400, 'Invalid coordinate')
            return
        delta = 0.0005
        params = {
            'SERVICE': 'WMS', 'VERSION': '1.3.0', 'REQUEST': 'GetFeatureInfo',
            'LAYERS': 'LC.EUCROPMAP.2022', 'QUERY_LAYERS': 'LC.EUCROPMAP.2022', 'STYLES': 'default',
            'CRS': 'EPSG:4326', 'BBOX': f'{lat - delta},{lng - delta},{lat + delta},{lng + delta}',
            'WIDTH': '512', 'HEIGHT': '512', 'I': '256', 'J': '256',
            'INFO_FORMAT': 'application/vnd.ogc.gml', 'FEATURE_COUNT': '1'
        }
        try:
            with urlopen(f'{JRC_WMS}?{urlencode(params)}', timeout=12) as response:
                payload = response.read().decode('utf-8', errors='replace')
            source_class = re.search(r'<class>([^<]+)</class>', payload)
            source_value = re.search(r'<value_0>([^<]+)</value_0>', payload)
            if not source_class:
                raise ValueError('No crop class returned')
            english = source_class.group(1)
            result = {'class': TRANSLATIONS.get(english, english), 'source_class': english, 'value': source_value.group(1) if source_value else None, 'year': 2022}
        except Exception:
            self.send_error(502, 'Crop source unavailable')
            return
        body = json.dumps(result, ensure_ascii=False).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'public, max-age=3600')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == '__main__':
    ThreadingHTTPServer(('127.0.0.1', 8080), AppHandler).serve_forever()
