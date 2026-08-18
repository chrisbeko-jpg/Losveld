'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, Fence, Waves, Car, Trees, Star, Dog, Clock3, CheckCircle2, ArrowLeft } from 'lucide-react';

const slots = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','18:00'];

export default function FieldPage(){
  const [date,setDate]=useState('Vandaag');
  const [slot,setSlot]=useState('14:00');
  const [dogs,setDogs]=useState(1);
  const total=useMemo(()=>14.5 + Math.max(0,dogs-1)*2,[dogs]);
  return <main>
    <header className="nav wrap"><Link className="logo" href="/">LOS<span>!</span></Link><nav><Link href="/#vinden">Vind een LOS!</Link><Link href="/host">Verhuur je veld</Link><button className="ghost">Inloggen</button></nav></header>

    <div className="wrap detailBack"><Link href="/"><ArrowLeft size={16}/> Terug naar zoeken</Link></div>

    <section className="wrap detailGrid">
      <div>
        <div className="gallery"><div className="galleryMain"></div><div className="gallerySide one"></div><div className="gallerySide two"></div></div>
        <div className="detailHead"><div><div className="eyebrow dark"><ShieldCheck size={16}/> 100% privé tijdens jouw tijdslot</div><h1>De Groene LOS!</h1><p><MapPin size={16}/> Almere · 3,2 km van jouw locatie</p></div><div className="bigRating"><Star fill="currentColor"/> 4,9 <small>83 beoordelingen</small></div></div>

        <div className="featureGrid"><div><Dog/><strong>2.400 m²</strong><span>Ruim privéterrein</span></div><div><Fence/><strong>Volledig omheind</strong><span>Hekhoogte 1,5 meter</span></div><div><Waves/><strong>Zwemwater</strong><span>Eigen hondenvijver</span></div><div><Car/><strong>Parkeren</strong><span>2 plekken bij de poort</span></div><div><Trees/><strong>Schaduw</strong><span>Bomen en zitbank</span></div><div><Clock3/><strong>60 minuten</strong><span>Standaard tijdslot</span></div></div>

        <section className="detailSection"><h2>Over deze LOS!</h2><p>Een volledig omheind grasveld aan de rand van Almere waar je hond ongestoord kan rennen, snuffelen en zwemmen. Tijdens jouw reservering wordt niemand anders op het terrein toegelaten.</p><div className="promise"><CheckCircle2/><div><strong>Jouw tijdslot = jouw terrein</strong><span>Geen onbekende honden, geen gedeelde boekingen en geen onverwachte bezoekers.</span></div></div></section>

        <section className="detailSection"><h2>Huisregels</h2><ul className="rules"><li>Poep direct opruimen met de aanwezige zakjes.</li><li>Maximaal 4 honden per reservering.</li><li>Terrein uiterlijk aan het einde van je tijdslot verlaten.</li><li>Schade of problemen direct melden via LOS!.</li></ul></section>
      </div>

      <aside className="bookingCard"><div className="bookingPrice"><strong>€14,50</strong><span>/ uur</span></div><p className="bookingNote"><ShieldCheck size={15}/> Hele terrein exclusief voor jou</p><label>Dag</label><div className="dateTabs">{['Vandaag','Morgen','Za 22'].map(d=><button className={date===d?'active':''} key={d} onClick={()=>setDate(d)}>{d}</button>)}</div><label>Starttijd</label><div className="slotGrid">{slots.map(s=><button className={slot===s?'active':''} key={s} onClick={()=>setSlot(s)}>{s}</button>)}</div><label>Aantal honden</label><div className="counter"><button onClick={()=>setDogs(Math.max(1,dogs-1))}>−</button><strong>{dogs}</strong><button onClick={()=>setDogs(Math.min(4,dogs+1))}>+</button></div><div className="bookingSummary"><span>{date} · {slot}–{String(Number(slot.split(':')[0])+1).padStart(2,'0')}:00</span><span>{dogs} hond{dogs>1?'en':''}</span><hr/><div><strong>Totaal</strong><strong>€{total.toFixed(2).replace('.',',')}</strong></div></div><button className="bookNow">Boek deze LOS!</button><small className="bookingFine">Nog geen echte betaling in deze testversie.</small></aside>
    </section>
  </main>
}