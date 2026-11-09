# Kuna · Pametno polje

Kuna je lokalna web-aplikacija koja korisniku pomaže povezati granicu polja, uneseni usjev, otvorene prostorne podatke i terenska opažanja. Namijenjena je pripremi obilaska i donošenju informiranijih odluka o proizvodnji, vodi i rubnim staništima.

## Struktura

- `app/` — web-aplikacija i lokalni Python poslužitelj
- `app/docs/` — arhitektura, ograničenja i registar izvora podataka

## Pokretanje aplikacije

```sh
cd app
python3 server.py
```

Otvorite `http://127.0.0.1:8080/`.

Karta koristi vanjske javne izvore pa je za satelitsku podlogu i dodatne slojeve potrebna mrežna veza. Podaci o polju i dnevnik spremaju se lokalno u preglednik.

## Lokalni AI pomoćnik

Aplikacija može koristiti lokalno pokrenut Ollama model za pitanja o aktivnom polju. Zadani je model `qwen2.5:3b`.

```sh
ollama serve
ollama pull qwen2.5:3b
cd app
python3 server.py
```

Bez dostupnog modela aplikacija jasno prikazuje da AI odgovor nije dostupan. Model ne zamjenjuje mjerenje na terenu ni stručnu procjenu.

## Izrada prezentacije

```sh
cd presentation
npm install
npm run render
```

Za svježe snimke aplikacije, dok je lokalni poslužitelj pokrenut na portu 8080, pokrenite:

```sh
node tools/capture-app-screens.mjs
```

## Izvori i ograničenja

Detaljan registar izvora, izdavatelja i veza nalazi se u [app/docs/data-sources.md](app/docs/data-sources.md). Arhitektura i poznata ograničenja opisani su u [app/docs/architecture.md](app/docs/architecture.md) i [app/docs/assumptions.md](app/docs/assumptions.md).
