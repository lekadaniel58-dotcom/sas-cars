const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const eur=n=>new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);

/* ===== DATI: modifica qui le tue auto. sale = prezzo vendita, day = prezzo al giorno (null = non disponibile) ===== */
const CARS=[
{id:1,n:'Lume City',cat:'Citycar',shape:'city',col:'#F2B134',y:2022,km:'18.000 km',fuel:'Benzina',sale:11900,day:29},
{id:2,n:'Vela Berlina',cat:'Berlina',shape:'sedan',col:'#2E5BFF',y:2021,km:'42.000 km',fuel:'Diesel',sale:19800,day:55},
{id:3,n:'Orso SUV',cat:'SUV',shape:'suv',col:'#2F7D5B',y:2023,km:'9.000 km',fuel:'Ibrida',sale:28500,day:79},
{id:4,n:'Volt Elettrica',cat:'Elettrica',shape:'sedan',col:'#12B5C9',y:2024,km:'Km 0',fuel:'Elettrica',sale:36900,day:95},
{id:5,n:'Lume Mini',cat:'Citycar',shape:'city',col:'#E4572E',y:2020,km:'51.000 km',fuel:'GPL',sale:8400,day:null},
{id:6,n:'Orso Family',cat:'SUV',shape:'suv',col:'#7A8798',y:2022,km:'30.000 km',fuel:'Diesel',sale:null,day:69},
{id:7,n:'Vela Touring',cat:'Berlina',shape:'sedan',col:'#1B2A41',y:2023,km:'15.000 km',fuel:'Ibrida',sale:26400,day:72},
{id:8,n:'Volt City',cat:'Elettrica',shape:'city',col:'#8BD17C',y:2023,km:'12.000 km',fuel:'Elettrica',sale:null,day:49}
];

const SHAPES={
city:{b:'M30 100V84Q32 74 48 72L84 68Q98 40 130 38H190Q222 40 236 66L270 72Q286 76 286 90V100Z',w:['M100 66Q110 48 132 46H158V66Z','M166 46H188Q208 48 220 66H166Z'],x:[78,238]},
sedan:{b:'M20 100V86Q22 76 40 74L90 70Q110 42 150 40H205Q240 42 258 68L290 74Q304 78 304 92V100Z',w:['M112 68Q124 50 150 48H172V68Z','M180 48H205Q226 50 240 68H180Z'],x:[76,248]},
suv:{b:'M18 102V80Q20 70 38 68L80 64Q92 36 128 32H220Q252 36 262 62L292 68Q306 72 306 88V102Z',w:['M98 62Q108 42 130 40H168V62Z','M176 40H218Q240 42 250 62H176Z'],x:[74,250]}
};
const carSVG=(c,label='')=>{const s=SHAPES[c.shape];
return `<svg viewBox="0 0 320 130" role="img" aria-label="${label||c.n}"><ellipse cx="160" cy="122" rx="135" ry="5" fill="rgba(0,0,0,.14)"/><path d="${s.b}" fill="${c.col}"/>${s.w.map(d=>`<path d="${d}" fill="#D3E8F4"/>`).join('')}<rect x="150" y="68" width="22" height="3" rx="1.5" fill="rgba(0,0,0,.25)"/>${s.x.map(x=>`<circle cx="${x}" cy="102" r="19" fill="#14202E"/><circle cx="${x}" cy="102" r="8" fill="#AEB9C5"/>`).join('')}</svg>`};

/* ===== STATO ===== */
const RANGE={buy:{min:5000,max:45000,step:500},rent:{min:20,max:150,step:5}};
const S={mode:'buy',cat:'Tutte',max:45000};
const avail=m=>CARS.filter(c=>m==='buy'?c.sale:c.day);
const priceOf=(c,m)=>m==='buy'?c.sale:c.day;

function setMode(m){
  S.mode=m;S.cat='Tutte';const r=RANGE[m],el=$('#max');
  el.min=r.min;el.max=r.max;el.step=r.step;el.value=r.max;S.max=r.max;
  $$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===m));
  $('#fleetTitle').textContent=m==='buy'?'Auto in vendita':'Auto a noleggio';
  renderChips();render();
}
function renderChips(){
  const cats=['Tutte',...new Set(avail(S.mode).map(c=>c.cat))];
  $('#chips').innerHTML=cats.map(k=>`<button type="button" aria-pressed="${k===S.cat}">${k}</button>`).join('');
}
function render(){
  const m=S.mode;
  $('#maxOut').textContent=eur(S.max)+(m==='rent'?' al giorno':'');
  const list=avail(m).filter(c=>(S.cat==='Tutte'||c.cat===S.cat)&&priceOf(c,m)<=S.max);
  $('#grid').innerHTML=list.map(c=>`<article class="card"><div class="pic" style="--tint:${c.col}">${carSVG(c)}</div><div class="body"><h3>${c.n}</h3><p class="spec"><span>${c.y}</span><span>${c.km}</span><span>${c.fuel}</span></p><div class="foot"><strong class="price">${eur(priceOf(c,m))}${m==='rent'?'<small> al giorno</small>':''}</strong><button class="btn dark sm" data-id="${c.id}">${m==='buy'?'Richiedi informazioni':'Prenota'}</button></div></div></article>`).join('');
  $('#empty').hidden=list.length>0;
}

/* ===== EVENTI ===== */
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
$('#chips').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;S.cat=b.textContent;renderChips();render()});
$('#max').addEventListener('input',e=>{S.max=+e.target.value;render()});
$('#grid').addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(!b)return;
  const c=CARS.find(x=>x.id==b.dataset.id);
  openDlg(S.mode==='buy'?'Richiedi informazioni':'Prenota il noleggio',`${c.n}, ${S.mode==='buy'?eur(c.sale):eur(c.day)+' al giorno'}`)});
$('#menuBtn').addEventListener('click',e=>{const o=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)});
$$('#nav a').forEach(a=>a.addEventListener('click',()=>{ $('#nav').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded','false'); }));

/* ===== CALCOLATORE NOLEGGIO ===== */
const rentCars=avail('rent');
$('#cCar').innerHTML=rentCars.map(c=>`<option value="${c.id}">${c.n} – ${eur(c.day)} al giorno</option>`).join('');
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,today=new Date();
const addD=n=>{const d=new Date(today);d.setDate(d.getDate()+n);return iso(d)};
$('#cStart').value=addD(1);$('#cStart').min=addD(0);$('#cEnd').value=addD(4);$('#cEnd').min=addD(1);
let quote='';
function calc(){
  const c=CARS.find(x=>x.id==$('#cCar').value);
  const start=$('#cStart').value,end=$('#cEnd').value;
  if(start){const next=new Date(start+'T12:00:00');next.setDate(next.getDate()+1);$('#cEnd').min=iso(next);}
  const valid=Boolean(start&&end&&start>=iso(today)&&end>start);
  $('#dateError').hidden=valid;
  $('#rBook').disabled=!valid;
  if(!valid){$('#rName').textContent=c.n;$('#rRows').replaceChildren();$('#rTotal').textContent='—';quote='';return;}
  const days=Math.round((new Date(end)-new Date(start))/864e5);
  const rows=[[`${c.n} × ${days} ${days===1?'giorno':'giorni'}`,c.day*days]];
  $$('.check input:checked').forEach(x=>rows.push([`${x.dataset.n} × ${days}`,+x.dataset.x*days]));
  let tot=rows.reduce((a,r)=>a+r[1],0);
  if(days>=7){const d=Math.round(tot*.1);rows.push(['Sconto 10% (7 giorni o più)',-d]);tot-=d}
  $('#rName').textContent=c.n;
  $('#rRows').innerHTML=rows.map(r=>`<div><dt>${r[0]}</dt><dd>${r[1]<0?'−':''}${eur(Math.abs(r[1]))}</dd></div>`).join('');
  $('#rTotal').textContent=eur(tot);
  quote=`${c.n}, ${days} ${days===1?'giorno':'giorni'}, totale ${eur(tot)}`;
}
$$('#noleggio select,#noleggio input').forEach(i=>i.addEventListener('input',calc));
$('#rBook').addEventListener('click',()=>openDlg('Prenota il noleggio',quote));

/* ===== FORM ===== */
const dlg=$('#dlg');
function openDlg(t,sub){$('#lead').reset();$('#dlgTitle').textContent=t;$('#dlgSub').textContent=sub||'Lasciaci i tuoi dati e ti richiamiamo.';$('#dlgDone').hidden=true;dlg.showModal()}
$('#dlgClose').addEventListener('click',()=>dlg.close());
$('#openContact').addEventListener('click',()=>openDlg('Scrivici un messaggio'));
$('#lead').addEventListener('submit',e=>{e.preventDefault();/* QUI: collega un servizio (Formspree, EmailJS, il tuo backend) */
  $('#dlgDone').hidden=false;e.target.reset()});

/* ===== AVVIO ===== */

$('#count').textContent=`${avail('buy').length} auto in vendita e ${avail('rent').length} a noleggio, aggiornate ogni settimana.`;
$('#yr').textContent=today.getFullYear();
setMode('buy');calc();

/* Foto originali: navigazione, ingrandimento e tastiera. */
const photos=$$('.photo-card img'),photoDialog=$('#photoDialog');
let photoIndex=0;
function showPhoto(index){
  photoIndex=(index+photos.length)%photos.length;
  const source=photos[photoIndex];
  $('#fullPhoto').src=source.getAttribute('src');
  $('#fullPhoto').alt=source.alt;
  $('#photoCounter').textContent=`Foto ${photoIndex+1} di ${photos.length}`;
}
$$('[data-photo]').forEach(button=>button.addEventListener('click',()=>{
  showPhoto(Number(button.dataset.photo));photoDialog.showModal();
}));
$('#closePhoto').addEventListener('click',()=>photoDialog.close());
$('#prevPhoto').addEventListener('click',()=>showPhoto(photoIndex-1));
$('#nextPhoto').addEventListener('click',()=>showPhoto(photoIndex+1));
photoDialog.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(photoIndex-1);}
  if(event.key==='ArrowRight'){event.preventDefault();showPhoto(photoIndex+1);}
});
photoDialog.addEventListener('click',event=>{if(event.target===photoDialog)photoDialog.close();});
