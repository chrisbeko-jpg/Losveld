'use client';

import './account.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Dog, Star, ShieldCheck, BadgeCheck, AlertTriangle, Heart, CalendarDays, MapPin, Wallet, Fence, Users, Plus, BarChart3 } from 'lucide-react';

export default function AccountClient(){
  const router=useRouter();
  const [view,setView]=useState('renter');
  const [booked,setBooked]=useState(false);
  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [dogs,setDogs]=useState([]);
  const [bookings,setBookings]=useState([]);
  const [spots,setSpots]=useState([]);
  const [hostBookings,setHostBookings]=useState([]);
  const [availability,setAvailability]=useState([]);
  const [name,setName]=useState('');
  const [breed,setBreed]=useState('');
  const [sex,setSex]=useState('reu');
  const [busy,setBusy]=useState(true);

  async function load(){
    const {data:{user:currentUser}}=await supabase.auth.getUser();
    if(!currentUser){router.push('/login');return;}
    setUser(currentUser);

    const [{data:p},{data:d},{data:b},{data:s}]=await Promise.all([
      supabase.from('profiles').select('*').eq('id',currentUser.id).single(),
      supabase.from('dogs').select('*').eq('owner_id',currentUser.id).order('created_at'),
      supabase.from('bookings').select('*,spots(name,city,price_per_hour)').eq('guest_id',currentUser.id).order('starts_at',{ascending:true}),
      supabase.from('spots').select('*').eq('host_id',currentUser.id).order('created_at',{ascending:false})
    ]);

    setProfile(p||null); setDogs(d||[]); setBookings(b||[]); setSpots(s||[]);

    if((s||[]).length){
      const ids=(s||[]).map(x=>x.id);
      const [{data:hb},{data:a}]=await Promise.all([
        supabase.from('bookings').select('*').in('spot_id',ids).order('starts_at',{ascending:true}),
        supabase.from('availability').select('*').in('spot_id',ids)
      ]);
      setHostBookings(hb||[]); setAvailability(a||[]);
    }else{
      setHostBookings([]); setAvailability([]);
    }
    setBusy(false);
  }

  useEffect(()=>{
    const q=new URLSearchParams(window.location.search);
    if(q.get('view')==='host') setView('host');
    if(q.get('booked')==='1') setBooked(true);
    load();
  },[]);

  async function addDog(e){
    e.preventDefault();
    if(!name||!user)return;
    const {error}=await supabase.from('dogs').insert({owner_id:user.id,name,breed,sex});
    if(!error){setName('');setBreed('');load();}
  }

  async function cancel(id){
    if(!confirm('Deze reservering annuleren?')||!user)return;
    const {error}=await supabase.from('bookings').update({status:'cancelled'}).eq('id',id).eq('guest_id',user.id);
    if(!error)load();
  }

  async function logout(){await supabase.auth.signOut();router.push('/');}

  if(busy)return <main><div className="wrap" style={{padding:'60px 0'}}>Mijn LOS! laden...</div></main>;

  const now=new Date();
  const upcoming=bookings.filter(b=>new Date(b.starts_at)>now&&b.status!=='cancelled');
  const past=bookings.filter(b=>new Date(b.starts_at)<=now||b.status==='cancelled');
  const hostUpcoming=hostBookings.filter(b=>new Date(b.starts_at)>now&&b.status!=='cancelled');
  const completedHost=hostBookings.filter(b=>new Date(b.ends_at)<=now&&b.status!=='cancelled');
  const gross=completedHost.reduce((sum,b)=>sum+Number(b.total_amount||0),0);
  const fee=gross*0.15;
  const balance=gross-fee;

  return <main>
    <header className="nav wrap"><Link className="logo" href="/">LOS<span>!</span></Link><nav><Link href="/zoeken">Vind een LOS!</Link><Link href="/host">Verhuur je veld</Link><button className="ghost" onClick={logout}>Uitloggen</button></nav></header>
    <section className="accountHero"><div className="wrap accountHeroGrid"><div><span className="kicker">MIJN LOS!</span><h1>Hoi {profile?.display_name||user?.email?.split('@')[0]}</h1><p>{view==='host'?'Beheer je velden, bezoekers, beschikbaarheid en opbrengsten.':'Beheer je honden, boekingen en reputatie op één plek.'}</p></div><div className="trustScore"><ShieldCheck/><div><small>LOS! Trustscore</small><strong>{Number(profile?.trust_score||5).toFixed(1).replace('.',',')}</strong><span>{profile?.account_status==='active'?'Account actief':'Accountstatus controleren'}</span></div></div></div></section>
    <div className="wrap accountSwitch"><button className={view==='renter'?'active':''} onClick={()=>setView('renter')}><Dog size={17}/> Ik boek LOS!</button><button className={view==='host'?'active':''} onClick={()=>setView('host')}><Fence size={17}/> Ik verhuur</button></div>
    {view==='renter'?<section className="wrap accountGrid"><div>
      {booked&&<div className="promise" style={{marginBottom:20}}><ShieldCheck/><div><strong>Je LOS! is gereserveerd.</strong><span>Het tijdslot is direct geblokkeerd voor andere hondeneigenaren.</span></div></div>}
      <h2 className="accountTitle">Komende boekingen</h2>
      {upcoming.map(b=><div className="reviewCard" key={b.id} style={{marginBottom:12}}><div><strong>{b.spots?.name||'LOS!'}</strong><span className="privatePill"><ShieldCheck size={12}/> PRIVÉ</span></div><p><MapPin size={13}/> {b.spots?.city} · <CalendarDays size={13}/> {new Date(b.starts_at).toLocaleString('nl-NL',{dateStyle:'medium',timeStyle:'short'})}</p><div className="reviewTraits"><span>{b.dog_count} hond{b.dog_count>1?'en':''}</span><span>€{Number(b.total_amount).toFixed(2).replace('.',',')}</span><span>{b.status}</span></div><button className="secondary" style={{marginTop:12}} onClick={()=>cancel(b.id)}>Annuleer boeking</button></div>)}
      {upcoming.length===0&&<div className="reviewCard"><strong>Nog niets gepland.</strong><p>Zoek een privéveld en boek een vrij tijdslot.</p><Link href="/zoeken">Vind een LOS!</Link></div>}
      <h2 className="accountTitle">Mijn honden</h2>
      {dogs.map(d=><div className="profileCard" key={d.id}><div className="dogAvatar"><Dog/></div><div><span className="verified"><BadgeCheck size={15}/> Gekoppeld aan jouw account</span><h2>{d.name}</h2><p>{d.breed||'Ras niet ingevuld'} · {d.sex||'Onbekend'}</p></div></div>)}
      <h2 className="accountTitle">Hond toevoegen</h2>
      <form className="dogForm" onSubmit={addDog}><label>Naam<input value={name} onChange={e=>setName(e.target.value)} required/></label><label>Ras<input value={breed} onChange={e=>setBreed(e.target.value)} placeholder="Bijv. Labrador"/></label><label>Geslacht<select value={sex} onChange={e=>setSex(e.target.value)}><option value="reu">Reu</option><option value="teef">Teef</option></select></label><button className="bookNow">Hond toevoegen</button></form>
      {past.length>0&&<><h2 className="accountTitle">Eerdere / geannuleerde boekingen</h2>{past.slice(-5).reverse().map(b=><div className="reviewCard" key={b.id} style={{marginBottom:10}}><strong>{b.spots?.name||'LOS!'}</strong><p>{new Date(b.starts_at).toLocaleString('nl-NL',{dateStyle:'medium',timeStyle:'short'})} · {b.status}</p></div>)}</>}
    </div><aside><div className="sideCard"><h3>Jouw reputatie</h3><div className="scoreBig"><Star fill="currentColor"/> {Number(profile?.trust_score||5).toFixed(1).replace('.',',')}</div><p>Je reputatie groeit automatisch op basis van beoordelingen na echte boekingen.</p><div className="safeStatus"><ShieldCheck/> {profile?.account_status==='active'?'Geen actieve beperkingen':'Accountreview actief'}</div></div><div className="sideCard"><h3>Hoe vertrouwen werkt</h3><p>Hosts en hondeneigenaren beoordelen elkaar na een boeking. Incidentmeldingen worden apart beoordeeld.</p><div className="incidentInfo"><AlertTriangle/><span>Één slechte review veroorzaakt niet automatisch een ban.</span></div></div><div className="sideCard"><Heart/><h3>Favorieten</h3><p>Favorieten koppelen we later aan je account.</p></div></aside></section>
    :<section className="wrap hostDashboard"><div className="hostStats"><div><Wallet/><span>Beschikbaar saldo</span><strong>€{balance.toFixed(2).replace('.',',')}</strong><small>na 15% LOS!-fee</small></div><div><CalendarDays/><span>Aankomende boekingen</span><strong>{hostUpcoming.length}</strong><small>over al je velden</small></div><div><Fence/><span>Actieve velden</span><strong>{spots.filter(s=>s.status==='published').length}</strong><small>{spots.length} totaal</small></div><div><BarChart3/><span>Bruto omzet</span><strong>€{gross.toFixed(2).replace('.',',')}</strong><small>voltooide boekingen</small></div></div><div className="hostDashGrid"><div><div className="dashTitle"><h2>Mijn velden</h2><Link href="/host" className="primary"><Plus size={16}/> Nieuw veld</Link></div>{spots.map(s=><div className="hostSpotCard" key={s.id}><div><span className="privatePill"><ShieldCheck size={12}/> {s.status==='published'?'LIVE':'CONCEPT'}</span><h3>{s.name}</h3><p><MapPin size={14}/> {s.city} · {Number(s.size_m2||0).toLocaleString('nl-NL')} m²</p><div className="reviewTraits"><span>{s.fence_type||'Omheining onbekend'}</span><span>€{Number(s.price_per_hour).toFixed(2).replace('.',',')} / uur</span></div></div><div className="hostSpotMeta"><strong>{hostBookings.filter(b=>b.spot_id===s.id&&b.status!=='cancelled').length}</strong><span>boekingen</span></div></div>)}{spots.length===0&&<div className="reviewCard"><strong>Nog geen veld aangemeld.</strong><p>Maak je eerste LOS! aan en bepaal zelf prijs en beschikbaarheid.</p><Link href="/host">Start als LOS!-host</Link></div>}<h2 className="accountTitle">Aankomende bezoekers</h2>{hostUpcoming.map(b=><div className="visitorCard" key={b.id}><div className="visitorIcon"><Users/></div><div><strong>Hondeneigenaar</strong><p><CalendarDays size={13}/> {new Date(b.starts_at).toLocaleString('nl-NL',{dateStyle:'medium',timeStyle:'short'})} · {b.dog_count} hond{b.dog_count>1?'en':''}</p></div><div className="visitorAmount">€{Number(b.total_amount).toFixed(2).replace('.',',')}</div></div>)}{hostUpcoming.length===0&&<div className="reviewCard"><strong>Nog geen aankomende bezoekers.</strong><p>Nieuwe boekingen verschijnen hier automatisch.</p></div>}</div><aside><div className="sideCard"><h3>Uitbetaling</h3><div className="scoreBig"><Wallet/> €{balance.toFixed(2).replace('.',',')}</div><p>Na iedere voltooide boeking komt 85% van het boekingsbedrag in je beschikbare saldo. LOS! houdt 15% servicefee in.</p><div className="scoreLine"><span>Bruto</span><strong>€{gross.toFixed(2).replace('.',',')}</strong></div><div className="scoreLine"><span>LOS! fee 15%</span><strong>− €{fee.toFixed(2).replace('.',',')}</strong></div><div className="safeStatus"><CalendarDays/> Maandelijkse uitbetaling</div></div><div className="sideCard"><h3>Beschikbaarheid</h3>{spots.map(s=>{const a=availability.filter(x=>x.spot_id===s.id&&x.enabled);return <div className="availabilityMini" key={s.id}><strong>{s.name}</strong><span>{a.length} dagen per week actief</span><small>{a[0]?`${String(a[0].start_time).slice(0,5)} – ${String(a[0].end_time).slice(0,5)}`:'Geen tijden ingesteld'}</small></div>})}</div><div className="sideCard"><h3>Waarom 15%?</h3><p>Voor boekingen, administratie, betalingen en uitbetalingen, klantenwerving, klantenservice, reviews & trust en verdere ontwikkeling van LOS!.</p></div></aside></div></section>}
  </main>;
}
