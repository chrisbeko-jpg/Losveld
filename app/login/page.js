'use client';
import './login.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Dog, Fence, ArrowRight } from 'lucide-react';

const SITE_URL='https://losveld.vercel.app';

export default function Login(){
 const router=useRouter(); const params=useSearchParams();
 const [mode,setMode]=useState('login'); const [role,setRole]=useState('guest'); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState(''); const [msg,setMsg]=useState(''); const [busy,setBusy]=useState(false);
 useEffect(()=>{if(params.get('role')==='host'){setMode('signup');setRole('host')}},[params]);
 async function submit(e){e.preventDefault();setBusy(true);setMsg('');
  if(mode==='signup'){
   const isHost=role==='host';
   const {error}=await supabase.auth.signUp({email,password,options:{data:{display_name:name,is_host:isHost,signup_role:role},emailRedirectTo:`${SITE_URL}/${isHost?'host':'account'}`}});
   if(error)setMsg(error.message); else setMsg(`Account aangemaakt als ${isHost?'verhuurder':'hondeneigenaar'}. Controleer je e-mail om je account te bevestigen.`);
  }else{
   const {data,error}=await supabase.auth.signInWithPassword({email,password});
   if(error)setMsg(error.message); else {const {data:p}=await supabase.from('profiles').select('is_host').eq('id',data.user.id).single(); router.push(p?.is_host?'/account?view=host':'/account');}
  }
  setBusy(false);
 }
 return <main><header className="nav wrap"><Link className="logo" href="/">LOS<span>!</span></Link></header><section className="authWrap"><div className="authCard wide"><span className="kicker">MIJN LOS!</span><h1>{mode==='login'?'Welkom terug':'Wat wil je met LOS! doen?'}</h1><p>{mode==='login'?'Log in voor je boekingen, honden en verhuurdersdashboard.':'Kies hoe je wilt starten. Een verhuurder kan later ook gewoon zelf een veld boeken.'}</p>{mode==='signup'&&<div className="roleCards"><button type="button" className={role==='guest'?'roleCard active':''} onClick={()=>setRole('guest')}><Dog/><div><strong>Ik wil een LOS! boeken</strong><span>Voor hondeneigenaren die privé willen rennen, trainen of spelen.</span></div>{role==='guest'&&<ArrowRight/>}</button><button type="button" className={role==='host'?'roleCard active':''} onClick={()=>setRole('host')}><Fence/><div><strong>Ik wil mijn veld verhuren</strong><span>Voor grondeigenaren die hun terrein beschikbaar willen stellen.</span></div>{role==='host'&&<ArrowRight/>}</button></div>}<form onSubmit={submit}>{mode==='signup'&&<label>Naam<input value={name} onChange={e=>setName(e.target.value)} required/></label>}<label>E-mailadres<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Wachtwoord<input type="password" minLength="6" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="bookNow" disabled={busy}>{busy?'Bezig...':mode==='login'?'Inloggen':role==='host'?'Verhuurdersaccount maken':'Account maken'}</button></form>{msg&&<div className="authMessage">{msg}</div>}<button className="authSwitch" onClick={()=>setMode(mode==='login'?'signup':'login')}>{mode==='login'?'Nog geen account? Kies hoe je wilt starten':'Al een account? Inloggen'}</button></div></section></main>
}