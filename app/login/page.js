'use client';
import './login.css';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

const SITE_URL='https://losveld.vercel.app';

export default function Login(){
 const router=useRouter();
 const [mode,setMode]=useState('login'); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState(''); const [msg,setMsg]=useState(''); const [busy,setBusy]=useState(false);
 async function submit(e){e.preventDefault();setBusy(true);setMsg('');
  if(mode==='signup'){
   const {error}=await supabase.auth.signUp({email,password,options:{data:{display_name:name},emailRedirectTo:`${SITE_URL}/account`}});
   if(error)setMsg(error.message); else setMsg('Account aangemaakt. Controleer je e-mail en bevestig je adres; daarna kom je automatisch terug bij Mijn LOS!.');
  }else{
   const {error}=await supabase.auth.signInWithPassword({email,password});
   if(error)setMsg(error.message); else router.push('/account');
  }
  setBusy(false);
 }
 return <main><header className="nav wrap"><Link className="logo" href="/">LOS<span>!</span></Link></header><section className="authWrap"><div className="authCard"><span className="kicker">MIJN LOS!</span><h1>{mode==='login'?'Welkom terug':'Maak je LOS!-account'}</h1><p>{mode==='login'?'Log in om je boekingen, honden en beoordelingen te bekijken.':'Eén account voor boeken én verhuren.'}</p><form onSubmit={submit}>{mode==='signup'&&<label>Naam<input value={name} onChange={e=>setName(e.target.value)} required/></label>}<label>E-mailadres<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Wachtwoord<input type="password" minLength="6" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="bookNow" disabled={busy}>{busy?'Bezig...':mode==='login'?'Inloggen':'Account maken'}</button></form>{msg&&<div className="authMessage">{msg}</div>}<button className="authSwitch" onClick={()=>setMode(mode==='login'?'signup':'login')}>{mode==='login'?'Nog geen account? Registreren':'Al een account? Inloggen'}</button></div></section></main>
}