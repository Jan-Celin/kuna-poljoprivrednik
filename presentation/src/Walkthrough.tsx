import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

const FPS = 30;
const DISSOLVE = 12;
const bounded = (value: number) => Math.max(0, Math.min(1, value));

type Focus = {x: number; y: number; width: number; height: number};
type Scene = {
  start: number;
  end: number;
  screen: string;
  kicker: string;
  title: string;
  copy?: string;
  side?: 'left' | 'right';
  focus?: Focus;
};

const scenes: Scene[] = [
  {start: 0, end: 300, screen: 'screens/empty.png', kicker: 'KUNA · PAMETNO POLJE', title: 'Odluke za polje\npočinju na karti.', copy: 'Otvoreni podaci za zemlju, vodu i prirodu — prevedeni u sljedeći korak.', side: 'left'},
  {start: 300, end: 600, screen: 'screens/empty.png', kicker: 'PROBLEM', title: 'Podaci postoje.\nKontekst nedostaje.', copy: 'Prije obilaska poljoprivrednik mora povezati vlastito polje, rizik i okoliš.', side: 'left'},
  {start: 600, end: 810, screen: 'screens/draw-start.png', kicker: '1 · POLJE', title: 'Granica je početak.', copy: 'Korisnik odabire rad s poljem iz istog radnog prikaza.', side: 'right', focus: {x: 36, y: 993, width: 187, height: 35}},
  {start: 810, end: 960, screen: 'screens/draw-4.png', kicker: '1 · POLJE', title: 'Precizno označeno.', copy: 'Četiri točke stvaraju preglednu granicu Istočnog polja.', side: 'right'},
  {start: 960, end: 1170, screen: 'screens/rename-filled.png', kicker: '1 · POLJE', title: 'Naziv i usjev\nostaju korisnikovi.', copy: 'Aplikacija ih ne pretpostavlja — oni postaju kontekst za sljedeći pregled.', side: 'right'},
  {start: 1170, end: 1470, screen: 'screens/east-field.png', kicker: '2 · PREGLED', title: 'Jedna kartica.\nSljedeći korak.', copy: 'Uz granicu su evidentirani usjev, vremenski kontekst i sažetak stanja.', side: 'right', focus: {x: 1595, y: 80, width: 305, height: 501}},
  {start: 1470, end: 1830, screen: 'screens/layers.png', kicker: '3 · OTVORENI PODACI', title: 'Slojevi se čitaju\nu granici polja.', copy: 'Staništa RH, ARKOD i europska karta usjeva ostaju na istoj karti.', side: 'right', focus: {x: 29, y: 767, width: 214, height: 190}},
  {start: 1830, end: 2160, screen: 'screens/assistant.png', kicker: '4 · PITAJ AI', title: 'Pitanje dobiva\nizvore konteksta.', copy: 'Lokalni jezični model radi samo nad stanjem polja i jasno označava ograničenja.', side: 'left'},
  {start: 2160, end: 2490, screen: 'screens/risks.png', kicker: '5 · UPOZORENJA', title: 'Upozorenje postaje\nobilazak.', copy: 'Kiša ili mraz vode do provjere odvodnje, prognoze i zapažanja na terenu.', side: 'left'},
  {start: 2490, end: 2820, screen: 'screens/scenarios.png', kicker: '6 · SCENARIJI', title: 'Usporedba,\nne lažna sigurnost.', copy: 'Raniji i kasniji termin sjetve prikazuju kompromise među vlagom tla, mrazom i sušom.', side: 'left'},
  {start: 2820, end: 3150, screen: 'screens/biodiversity.png', kicker: '7 · BIORAZNOLIKOST', title: 'Rub polja je\ndio rješenja.', copy: 'Voda, oprašivači i očuvani vegetacijski pojas ulaze u svakodnevno planiranje.', side: 'left'},
  {start: 3150, end: 3480, screen: 'screens/report.png', kicker: '8 · IZVJEŠĆE', title: 'Od karte do\nterenskog zapisa.', copy: 'PDF objedinjuje stanje, izvore, upozorenja i sljedeće korake za gospodarstvo.', side: 'left'},
  {start: 3480, end: 4200, screen: 'screens/east-field.png', kicker: 'KUNA · PAMETNO POLJE', title: 'Javni podaci.\nBolje odluke.\nŽivlji krajolik.', copy: 'Kuna povezuje polje, javne izvore i opažanja s terena — bez zamjene za stručnu procjenu.', side: 'left'},
];

const TitleCard: React.FC<{scene: Scene; frame: number; closing: boolean}> = ({scene, frame, closing}) => {
  const local = frame - scene.start;
  const enter = bounded(local / 16);
  const leave = bounded((scene.end - frame) / 16);
  const opacity = Math.min(enter, leave);
  const horizontal = scene.side === 'right' ? 1020 : 326;
  const titleSize = closing ? 52 : 42;
  return <div style={{position: 'absolute', zIndex: 3, top: closing ? 145 : 114, left: horizontal, width: 520, opacity, transform: `translateY(${interpolate(enter, [0, 1], [14, 0])}px)`, color: '#fff'}}>
    <div style={{display: 'inline-flex', padding: '8px 11px', borderRadius: 4, background: 'rgba(10, 33, 23, .9)', color: '#c9e86a', fontFamily: 'Arial, sans-serif', fontWeight: 800, fontSize: 13, letterSpacing: 1.4}}>{scene.kicker}</div>
    <div style={{marginTop: 15, whiteSpace: 'pre-line', fontFamily: 'Arial, sans-serif', fontSize: titleSize, lineHeight: 1.06, fontWeight: 800, letterSpacing: -1.1, textShadow: '0 2px 16px rgba(0,0,0,.64)'}}>{scene.title}</div>
    {scene.copy && <div style={{marginTop: 14, maxWidth: 470, fontFamily: 'Arial, sans-serif', fontSize: 18, lineHeight: 1.4, fontWeight: 500, color: 'rgba(255,255,255,.96)', textShadow: '0 2px 12px rgba(0,0,0,.72)'}}>{scene.copy}</div>}
  </div>;
};

const Focus: React.FC<{focus: Focus; frame: number; start: number}> = ({focus, frame, start}) => {
  const enter = bounded((frame - start - 18) / 12);
  const pulse = 1 + Math.sin((frame - start) / 16) * .005;
  return <div style={{position: 'absolute', zIndex: 4, left: focus.x, top: focus.y, width: focus.width, height: focus.height, opacity: enter, border: '3px solid #c9e86a', borderRadius: 4, boxShadow: '0 0 0 5px rgba(11,34,24,.44)', transform: `scale(${pulse})`, transformOrigin: 'center', pointerEvents: 'none'}}/>;
};

const SceneView: React.FC<{scene: Scene; frame: number; opacity: number}> = ({scene, frame, opacity}) => {
  const isClosing = scene.start === 3480;
  return <AbsoluteFill style={{opacity, backgroundColor: '#10261f'}}>
    <Img src={staticFile(scene.screen)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <div style={{position: 'absolute', inset: 0, background: isClosing ? 'linear-gradient(90deg, rgba(8,30,20,.74) 0%, rgba(8,30,20,.20) 58%, rgba(8,30,20,.08) 100%)' : 'linear-gradient(90deg, rgba(8,30,20,.38) 0%, transparent 46%, rgba(8,30,20,.12) 100%)'}} />
    {scene.focus && <Focus focus={scene.focus} frame={frame} start={scene.start} />}
    <TitleCard scene={scene} frame={frame} closing={isClosing} />
    {isClosing && <div style={{position: 'absolute', left: 326, bottom: 70, zIndex: 4, display: 'flex', gap: 16, alignItems: 'center', color: '#fff', fontFamily: 'Arial, sans-serif', fontSize: 16, fontWeight: 700, opacity: bounded((frame - scene.start - 90) / 18)}}><img src={staticFile('kuna-pine-marten.svg')} style={{width: 52, height: 26, objectFit: 'contain'}}/><span>Otvoreni podaci za održivo upravljanje poljem</span></div>}
  </AbsoluteFill>;
};

export const Walkthrough: React.FC = () => {
  const frame = useCurrentFrame();
  const index = scenes.findIndex((scene) => frame >= scene.start && frame < scene.end);
  const current = index >= 0 ? scenes[index] : scenes[scenes.length - 1];
  const local = frame - current.start;
  const dissolve = index > 0 ? bounded(local / DISSOLVE) : 1;
  const previous = index > 0 && dissolve < 1 ? scenes[index - 1] : null;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#10261f'}}>
    {previous && <SceneView scene={previous} frame={frame} opacity={1 - dissolve} />}
    <SceneView scene={current} frame={frame} opacity={dissolve} />
  </AbsoluteFill>;
};

export const pitchDuration = 140 * FPS;
