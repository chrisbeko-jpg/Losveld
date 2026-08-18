'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MapPin, Search, ShieldCheck, Users, Star, Fence, Waves, SlidersHorizontal, Crown, ArrowLeft } from 'lucide-react';

const spots = [
  {id:1,name:'De Groene LOS!',place:'Almere',type:'private',premium:false,price:14.5,size:'2.400 m²',rating:'4,9',fence:'Volledig omheind',water:true,x:58,y:44},
  {id:2,name:'LOS! aan de Dijk',place:'Zeewolde',type:'private',premium:false,price:17.5,size:'4.800 m²',rating:'4,8',fence:'Volledig omheind',water:false,x:72,y:34},
  {id:3,name:'Polder LOS!',place:'Lelystad',type:'private',premium:false,price:12.5,size:'6.200 m²',rating:'4,9',fence:'Omheind',water:true,x:66,y:18},
  {id:4,name:'Hondenpark De Vaart',place:'Almere Buiten',type:'shared',premium:true,price:6,size:'3.000 m²',rating:'4,7',fence:'Omheind',water:false,x:46,y:35},
  {id:5,name:'Speelweide Gooimeer',place:'Almere Haven',type:'shared',premium:true,price:7.5,size:'2.100 m²',rating:'4,8',fence:'Volledig omheind',water:true,x:42,y:58},
  {id:6,name:'Hondenveld Stad',place:'Almere Stad',type:'shared',premium:false,price:0,size:'1.600 m²',rating:'4,4',fence:'Omheind',water:false,x:53,y:50},
];

export default function SearchPage(){
  const [query,setQuery]=useState('Almere');
  const [type,setType]=useState('all');
  const [water,setWater]=useState(false);
  const visible=useMemo(()=>spots.filter(s=>(type==='all'||s.type===type)&&(!water||s.water)),[type,water]);
  return <main>
    <header className="nav wrap"><Link className="logo" href="/">LOS<span>!</span></Link><nav><Link href="/zoeken">Vind een LOS!</Link><Link href="/host">Verhuur je veld</Link><button className="ghost">Inloggen</button></nav></header>
    <section className="searchTop"><div className="wrap"><Link className="back" href="/"><ArrowLeft size={16}/> Terug</Link><div className="searchTitle"><div><span className="kicker">ZOEKEN</span><h1>Vind jouw plek om LOS! te gaan</h1></div><div className="searchInline"><MapPin/><input value={query} onChange={e=>setQuery(e.target.value)}/><button><Search size={17}/> Zoek</button></div></div><div className="filterRow"><button className={type==='all'?'active':''} onClick={()=>setType('all')}>Alles</button><button className={type==='private'?'active':''} onClick={()=>setType('private')}><ShieldCheck size={15}/> Privé LOS!</button><button className={type==='shared'?'active':''} onClick={()=>setType('shared')}><Users size={15}/> Speelvelden</button><button className={water?'active':''} onClick={()=>setWater(!water)}><Waves size={15}/> Met water</button><button><SlidersHorizontal size={15}/> Meer filters</button></div></div></section>

    <section className="searchLayout">
      <div className="resultList"><div className="resultHead"><strong>{visible.length} plekken rond {query}</strong><span>Privévelden en speelvelden worden duidelijk van elkaar onderscheiden.</span></div>{visible.map(s=><article className="resultCard" key={s.id}><div className={`resultImg img${s.id}`}><span className={s.type==='private'?'tag privateTag':'tag sharedTag'}>{s.type==='private'?<><ShieldCheck size={13}/> PRIVÉ LOS!</>:<><Users size={13}/> SPEELVELD</>}</span>{s.premium&&<span className="premium"><Crown size={13}/> PREMIUM PARTNER</span>}</div><div className="resultBody"><div className="resultTop"><div><h3>{s.name}</h3><p><MapPin size={14}/>{s.place}</p></div><div className="rating"><Star size={14} fill="currentColor"/> {s.rating}</div></div><div className="miniSpecs"><span><Fence size={14}/>{s.fence}</span><span>{s.size}</span>{s.water&&<span><Waves size={14}/>Water</span>}</div>{s.type==='private'?<div className="exclusive"><ShieldCheck size={14}/><strong>Hele terrein alleen voor jou tijdens je reservering</strong></div>:<div className="sharedNotice"><Users size={14}/><strong>Gedeeld speelveld — andere honden kunnen aanwezig zijn</strong></div>}<div className="resultBottom"><span>{s.price>0?<><strong>€{s.price.toFixed(2).replace('.',',')}</strong> / uur</>:'Gratis / vrije toegang'}</span>{s.type==='private'?<Link href="/velden/groene-los"><button>Bekijk & boek</button></Link>:<button>Bekijk speelveld</button>}</div></div></article>)}</div>

      <div className="mapPanel"><div className="mapCanvas"><div className="waterShape one"></div><div className="waterShape two"></div><div className="road r1"></div><div className="road r2"></div><div className="road r3"></div><div className="cityLabel a">ALMERE</div><div className="cityLabel b">ZEEWOLDE</div><div className="cityLabel c">LELYSTAD</div>{visible.map(s=><button key={s.id} className={`pin ${s.type}`} style={{left:`${s.x}%`,top:`${s.y}%`}} title={s.name}>{s.type==='private'?'LOS!':'●'}<span>€{s.price.toFixed(0)}</span></button>)}</div><div className="mapLegend"><span><i className="legendPrivate"></i> Privé LOS!</span><span><i className="legendShared"></i> Speelveld</span><span><Crown size={13}/> Premium partner</span></div></div>
    </section>

    <section className="partnerStrip"><div className="wrap partnerGrid"><div><span className="kicker lime">VOOR BESTAANDE HONDENSPEELVELDEN</span><h2>Word Premium LOS!-partner</h2><p>Laat je bestaande speelveld beter vindbaar worden zonder te doen alsof het privé is. Premium partners krijgen extra zichtbaarheid, een uitgebreid profiel en een duidelijk partnerlabel.</p></div><div className="partnerCard"><Crown/><strong>Premium partner</strong><span>Uitgelicht in zoekresultaten</span><span>Eigen uitgebreide profielpagina</span><span>Reviews en route-informatie</span><span>Ruimte voor acties of eigen tarieven</span><button>Meer over Premium</button></div></div></section>
  </main>
}