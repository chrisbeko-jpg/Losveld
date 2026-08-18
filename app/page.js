'use client';

import { useState } from 'react';
import { MapPin, Search, ShieldCheck, Fence, Waves, Star, ArrowRight, Dog, Wallet, Clock3 } from 'lucide-react';

const fields = [
  { name: 'De Groene LOS!', place: 'Almere', size: '2.400 m²', fence: 'Volledig omheind · 1,5 m', extras: 'Zwemwater · parkeren', price: '€14,50', rating: '4,9', reviews: 83, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80' },
  { name: 'LOS! aan de Dijk', place: 'Zeewolde', size: '4.800 m²', fence: 'Volledig omheind · 1,8 m', extras: 'Agility · zitplek', price: '€17,50', rating: '4,8', reviews: 51, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Polder LOS!', place: 'Lelystad', size: '6.200 m²', fence: 'Omheind · 1,4 m', extras: 'Veel ruimte · waterpunt', price: '€12,50', rating: '4,9', reviews: 37, image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80' },
];

export default function Home() {
  const [location, setLocation] = useState('');
  return <main>
    <header className="nav wrap">
      <a className="logo" href="#">LOS<span>!</span></a>
      <nav><a href="#vinden">Vind een LOS!</a><a href="#host">Verhuur je veld</a><button className="ghost">Inloggen</button></nav>
    </header>

    <section className="hero">
      <div className="wrap heroGrid">
        <div className="heroCopy">
          <div className="eyebrow"><ShieldCheck size={17}/> 100% privé tijdens jouw boeking</div>
          <h1>Boek. Poort dicht.<br/><em>Hond los.</em></h1>
          <p>Vind een veilig privéterrein waar jouw hond ongestoord kan rennen, snuffelen en spelen. Geen onbekende honden. Geen gedoe.</p>
          <div className="searchbox">
            <MapPin/><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Plaats of postcode"/>
            <button onClick={()=>document.getElementById('vinden')?.scrollIntoView({behavior:'smooth'})}><Search size={19}/> Zoek een LOS!</button>
          </div>
          <div className="trust"><span>✓ Exclusief voor jou</span><span>✓ Direct boeken</span><span>✓ Beoordeelde hosts</span></div>
        </div>
        <div className="heroCard"><div className="bubble">Vandaag nog LOS!<strong>vanaf €12,50 / uur</strong></div></div>
      </div>
    </section>

    <section className="wrap section" id="vinden">
      <div className="sectionHead"><div><span className="kicker">IN DE BUURT</span><h2>Waar ga jij LOS!?</h2></div><button className="linkBtn">Bekijk op kaart <ArrowRight size={18}/></button></div>
      <div className="cards">{fields.map((f,i)=><article className="field" key={f.name}>
        <div className="photo" style={{backgroundImage:`url(${f.image})`}}><span className="private">PRIVÉ</span><span className="distance">{i+3} km</span></div>
        <div className="fieldBody"><div className="fieldTitle"><div><h3>{f.name}</h3><p><MapPin size={14}/>{f.place}</p></div><div className="rating"><Star size={15} fill="currentColor"/> {f.rating} <small>({f.reviews})</small></div></div>
          <div className="specs"><span><Dog size={16}/>{f.size}</span><span><Fence size={16}/>{f.fence}</span><span><Waves size={16}/>{f.extras}</span></div>
          <div className="price"><span><strong>{f.price}</strong> / uur</span><button>Bekijk LOS!</button></div>
        </div>
      </article>)}</div>
    </section>

    <section className="host" id="host"><div className="wrap hostGrid">
      <div><span className="kicker lime">WORD HOST</span><h2>Grond over?<br/>Laat honden <em>LOS!</em></h2><p>Een weiland, paardenbak of groot omheind terrein dat regelmatig leeg staat? Jij bepaalt wanneer het beschikbaar is en wat een bezoek kost.</p><button className="primary">Start als LOS!-host <ArrowRight size={18}/></button></div>
      <div className="earn"><h3>Wat kan je veld opleveren?</h3><div className="calc"><div><span>5 boekingen per week</span><strong>± €325</strong><small>bruto per maand</small></div><div><span>15 boekingen per week</span><strong>± €975</strong><small>bruto per maand</small></div></div><p>Rekenvoorbeeld bij €15 per boeking. Jij bepaalt zelf je tarief en beschikbaarheid.</p></div>
    </div></section>

    <section className="wrap section how"><span className="kicker">ZO WERKT LOS!</span><h2>Vrijheid zonder verrassingen.</h2><div className="steps"><div><Search/><b>1</b><h3>Vind</h3><p>Zoek op locatie en filter op omheining, oppervlakte, water en extra's.</p></div><div><Clock3/><b>2</b><h3>Boek</h3><p>Kies je tijdslot en betaal direct. Het terrein is dan exclusief voor jou.</p></div><div><Dog/><b>3</b><h3>Ga LOS!</h3><p>Poort dicht. Lijn af. Niemand anders wordt tijdens jouw reservering toegelaten.</p></div></div></section>

    <footer><div className="wrap"><div className="logo invert">LOS<span>!</span></div><p>Een privéveld voor jouw hond.</p><small>losveld.nl · Eerste conceptversie</small></div></footer>
  </main>
}