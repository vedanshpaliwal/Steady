import { useEffect, useMemo, useState } from 'react';
import { Bell, CalendarDays, Check, ChevronRight, Clock3, HeartPulse, Home, Plus, Pill, Settings, Sparkles, Trash2 } from 'lucide-react';

type Medication = { id?: string; name: string; dosage: string; time: string; frequency: string; active: boolean };
type Dose = { medicationId: string; medicationName: string; takenAt: string; status: string };
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const seed: Medication[] = [
  { id:'demo-1', name:'Vitamin D3', dosage:'1000 IU', time:'08:00', frequency:'Daily', active:true },
  { id:'demo-2', name:'Omega 3', dosage:'1000 mg', time:'13:00', frequency:'Daily', active:true },
  { id:'demo-3', name:'Magnesium', dosage:'250 mg', time:'21:00', frequency:'Daily', active:true }
];

export default function App(){
 const [meds,setMeds]=useState<Medication[]>(seed); const [doses,setDoses]=useState<Dose[]>([]); const [tab,setTab]=useState('home'); const [showAdd,setShowAdd]=useState(false); const [newMed,setNewMed]=useState({name:'',dosage:'',time:'08:00'});
 const load=async()=>{try{const [m,d]=await Promise.all([fetch(`${API}/api/medications`),fetch(`${API}/api/doses/today`)]); if(m.ok){const data=await m.json(); if(data.length)setMeds(data)} if(d.ok)setDoses(await d.json())}catch{}};
 useEffect(()=>{load()},[]);
 const takenIds=useMemo(()=>new Set(doses.map(d=>d.medicationId)),[doses]); const completed=meds.filter(m=>takenIds.has(m.id||'')).length; const progress=meds.length?Math.round(completed/meds.length*100):0;
 const take=async(m:Medication)=>{if(takenIds.has(m.id||''))return; const dose={medicationId:m.id||m.name,medicationName:m.name,status:'taken'}; setDoses(x=>[...x,dose as Dose]); try{await fetch(`${API}/api/doses`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(dose)})}catch{}};
 const add=async()=>{if(!newMed.name.trim())return; const med={...newMed,frequency:'Daily',active:true}; try{const r=await fetch(`${API}/api/medications`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(med)}); if(r.ok)setMeds(x=>[...x,await r.json()]); else setMeds(x=>[...x,{...med,id:crypto.randomUUID()}])}catch{setMeds(x=>[...x,{...med,id:crypto.randomUUID()}])} setNewMed({name:'',dosage:'',time:'08:00'});setShowAdd(false)};
 const remove=async(id?:string)=>{setMeds(x=>x.filter(m=>m.id!==id)); if(id&&!id.startsWith('demo-'))await fetch(`${API}/api/medications/${id}`,{method:'DELETE'}).catch(()=>{})};
 return <div className="shell"><div className="app">
  <header><div className="brand"><div className="logo"><HeartPulse size={20}/></div><div><b>steady</b><span>Your daily rhythm</span></div></div><button className="icon"><Bell size={19}/></button></header>
  {tab==='home'&&<main className="fade"><section className="hero"><div><span className="eyebrow">MONDAY · SEP 14</span><h1>Good morning,<br/><em>stay steady.</em></h1><p>Small routines. Better days.</p></div><div className="ring"><strong>{progress}%</strong><span>today</span></div></section>
   <section className="card summary"><div><span className="muted">TODAY'S PROGRESS</span><h2>{completed} of {meds.length} doses</h2></div><div className="bar"><i style={{width:`${progress}%`}}/></div><div className="streak"><Sparkles size={16}/> 7 day streak</div></section>
   <div className="section-title"><h3>Today's routine</h3><button onClick={()=>setTab('meds')}>View all <ChevronRight size={16}/></button></div>
   <div className="med-list">{meds.map(m=><article className={`med ${takenIds.has(m.id||'')?'done':''}`} key={m.id}><div className="pill"><Pill size={20}/></div><div className="med-info"><b>{m.name}</b><span>{m.dosage} · {m.frequency}</span><small><Clock3 size={13}/> {m.time}</small></div><button className="check" onClick={()=>take(m)}>{takenIds.has(m.id||'')?<Check size={18}/>:''}</button></article>)}</div>
   <div className="tip"><Sparkles size={19}/><div><b>Keep your rhythm</b><p>Taking your medication around the same time helps build a habit.</p></div></div>
  </main>}
  {tab==='meds'&&<main className="fade page"><div className="page-head"><div><span className="eyebrow">YOUR ROUTINE</span><h1>Medications</h1></div><button className="primary" onClick={()=>setShowAdd(true)}><Plus size={18}/> Add</button></div>{meds.map(m=><article className="med" key={m.id}><div className="pill"><Pill size={20}/></div><div className="med-info"><b>{m.name}</b><span>{m.dosage} · {m.frequency}</span><small><Clock3 size={13}/> {m.time}</small></div><button className="delete" onClick={()=>remove(m.id)}><Trash2 size={17}/></button></article>)}{!meds.length&&<div className="empty">No medications yet.</div>}</main>}
  {tab==='calendar'&&<main className="fade page"><span className="eyebrow">YOUR HISTORY</span><h1>Progress</h1><div className="calendar card"><CalendarDays size={28}/><h2>You're building a habit.</h2><p>Keep taking your medication consistently. Your completed doses will appear here.</p><div className="big-number">{progress}%</div><span>Today's completion</span></div></main>}
  {tab==='settings'&&<main className="fade page"><span className="eyebrow">PREFERENCES</span><h1>Settings</h1><div className="settings card"><div><b>Notifications</b><span>Medication reminders</span></div><input type="checkbox" defaultChecked/></div><div className="settings card"><div><b>Daily summary</b><span>See your progress each morning</span></div><input type="checkbox" defaultChecked/></div></main>}
  <nav><button className={tab==='home'?'active':''} onClick={()=>setTab('home')}><Home/><span>Home</span></button><button className={tab==='meds'?'active':''} onClick={()=>setTab('meds')}><Pill/><span>Routine</span></button><button className={tab==='calendar'?'active':''} onClick={()=>setTab('calendar')}><CalendarDays/><span>Progress</span></button><button className={tab==='settings'?'active':''} onClick={()=>setTab('settings')}><Settings/><span>Settings</span></button></nav>
  {showAdd&&<div className="modal-backdrop" onClick={()=>setShowAdd(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><h2>Add medication</h2><button onClick={()=>setShowAdd(false)}>×</button></div><label>Name<input value={newMed.name} onChange={e=>setNewMed({...newMed,name:e.target.value})} placeholder="e.g. Vitamin D3"/></label><label>Dosage<input value={newMed.dosage} onChange={e=>setNewMed({...newMed,dosage:e.target.value})} placeholder="e.g. 1000 IU"/></label><label>Time<input type="time" value={newMed.time} onChange={e=>setNewMed({...newMed,time:e.target.value})}/></label><button className="primary wide" onClick={add}>Save medication</button></div></div>}
 </div></div>
}
