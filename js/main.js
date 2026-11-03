// Inserire qui solo recapiti aziendali confermati, senza credenziali.
const CONTACT={whatsapp:'',email:'',address:''};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const PHOTOS=[
['Tetto panoramico Volkswagen, vista dall’interno','inside'],['Sedili anteriori Volkswagen','inside'],['Volkswagen Golf, vista anteriore','outside'],['Volante e quadro strumenti Volkswagen','inside'],['Volkswagen Golf, vista anteriore laterale','outside'],['Volkswagen Golf, vista laterale','outside'],['Dettaglio del tetto panoramico Volkswagen','inside'],['Volkswagen Golf, vista posteriore laterale','outside'],['Abitacolo e volante Lancia','inside'],['Lancia Delta, vista posteriore laterale','outside'],['Volkswagen Golf, vista posteriore','outside'],['Plancia e quadro strumenti Lancia','inside'],['Lancia Delta, vista posteriore','outside'],['Sedili e abitacolo Lancia','inside'],['Lancia Delta, vista anteriore','outside'],['Lancia Delta, vista anteriore laterale','outside']
];
const photoSrc=i=>`img/auto-${String(i+1).padStart(2,'0')}.jpeg`;
$('#photoGrid').innerHTML=PHOTOS.map(([alt,category],i)=>`<button type="button" class="photo-card photo-open" data-photo="${i}" data-category="${category}" aria-label="Ingrandisci: ${alt}"><img src="${photoSrc(i)}" alt="${alt}" width="${i===6?1600:1200}" height="${i===6?1200:1600}" loading="lazy"><span aria-hidden="true">↗</span></button>`).join('');
$('#year').textContent=new Date().getFullYear();
$('#menuBtn').addEventListener('click',()=>{const open=$('#nav').classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',String(open));});
$$('#nav a').forEach(a=>a.addEventListener('click',()=>{$('#nav').classList.remove('open');$('#menuBtn').setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#nav').classList.remove('open');$('#menuBtn').setAttribute('aria-expanded','false');}});
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 $$('.photo-card').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter);
}));
const photoDialog=$('#photoDialog');let photoIndex=0;
function showPhoto(index){photoIndex=(index+PHOTOS.length)%PHOTOS.length;$('#fullPhoto').src=photoSrc(photoIndex);$('#fullPhoto').alt=PHOTOS[photoIndex][0];$('#photoCounter').textContent=`${String(photoIndex+1).padStart(2,'0')} / ${PHOTOS.length} · ${PHOTOS[photoIndex][0]}`;}
$$('.photo-open').forEach(button=>button.addEventListener('click',()=>{showPhoto(Number(button.dataset.photo));photoDialog.showModal();}));
$('#closePhoto').addEventListener('click',()=>photoDialog.close());$('#prevPhoto').addEventListener('click',()=>showPhoto(photoIndex-1));$('#nextPhoto').addEventListener('click',()=>showPhoto(photoIndex+1));
photoDialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(photoIndex-1);}if(event.key==='ArrowRight'){event.preventDefault();showPhoto(photoIndex+1);}});
const requestDialog=$('#requestDialog');
$$('.request').forEach(button=>button.addEventListener('click',()=>{$('#interest').value=button.dataset.car;$('#requestResult').hidden=true;requestDialog.showModal();}));
$('#closeRequest').addEventListener('click',()=>requestDialog.close());
[photoDialog,requestDialog].forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}));
if(CONTACT.whatsapp||CONTACT.email){
 $('#contactStatus').textContent='Il messaggio si aprirà nel tuo servizio di contatto. Potrai rileggerlo prima di inviarlo.';
 $('#sendRequest').textContent=CONTACT.whatsapp?'Continua su WhatsApp ↗':'Continua via email ↗';
 if(CONTACT.whatsapp){const a=document.createElement('a');a.href=`https://wa.me/${CONTACT.whatsapp}`;a.textContent='Scrivici su WhatsApp ↗';$('#directContacts').append(a);}
 if(CONTACT.email){const a=document.createElement('a');a.href=`mailto:${CONTACT.email}`;a.textContent=CONTACT.email;$('#directContacts').append(a);}
}
if(CONTACT.address){const p=document.createElement('p');p.textContent=CONTACT.address;$('#directContacts').append(p);}
$('#requestForm').addEventListener('submit',event=>{
 event.preventDefault();const text=`Ciao Sasà Cars! Sono ${$('#customerName').value.trim()}.\nAuto di interesse: ${$('#interest').value}.\n${$('#message').value.trim()}`;
 if(CONTACT.whatsapp){window.location.href=`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;return;}
 if(CONTACT.email){window.location.href=`mailto:${CONTACT.email}?subject=${encodeURIComponent('Richiesta informazioni · '+$('#interest').value)}&body=${encodeURIComponent(text)}`;return;}
 const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='richiesta-sasa-cars.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 $('#requestResult').textContent='Richiesta salvata nel file. Nessun messaggio è stato inviato.';$('#requestResult').hidden=false;
});

/* Intro con prospettiva CSS: nessuna dipendenza esterna, uscita garantita e saltabile. */
(()=>{
 const intro=document.getElementById('driveIntro');
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(!intro||motion.matches)return;
 const skip=document.getElementById('skipIntro');
 const image=document.getElementById('introCarImage');
 let ended=false,driveTimer,exitTimer,loadTimer,stopRoad=()=>{};
 const previousFocus=document.activeElement;
 const background=[...document.body.children].filter(node=>node!==intro&&node.tagName!=='SCRIPT');
 const inertState=background.map(node=>[node,node.inert]);
 const finish=()=>{
  if(ended)return;ended=true;stopRoad();
  clearTimeout(driveTimer);clearTimeout(exitTimer);clearTimeout(loadTimer);
  intro.hidden=true;intro.classList.remove('running','leaving');
  document.documentElement.classList.remove('intro-active');
  inertState.forEach(([node,inert])=>node.inert=inert);
  if(intro.contains(document.activeElement)){
   if(previousFocus&&previousFocus!==document.body)previousFocus.focus({preventScroll:true});
   else{const heading=document.getElementById('heroTitle');heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});heading.addEventListener('blur',()=>heading.removeAttribute('tabindex'),{once:true});}
  }
  motion.removeEventListener('change',finish);
 };
 const leave=()=>{if(ended)return;intro.classList.add('leaving');exitTimer=setTimeout(finish,460);};
 intro.hidden=false;document.documentElement.classList.add('intro-active');
 background.forEach(node=>node.inert=true);
 skip.focus({preventScroll:true});
 skip.addEventListener('click',finish,{once:true});
 intro.addEventListener('keydown',event=>{if(event.key==='Escape')finish();});
 motion.addEventListener('change',finish);
 window.addEventListener('pagehide',finish,{once:true});
 // Un’immagine non caricata non deve mai impedire di accedere al sito.
 loadTimer=setTimeout(finish,7500);
 const ready=image.decode?image.decode():Promise.resolve();
 ready.then(()=>{
  if(ended)return;
  intro.classList.add('running');
  stopRoad=startDrivingRoad(document.getElementById('introRoad'));
  driveTimer=setTimeout(leave,4250);
 }).catch(finish);
})();

// Ripresa frontale in inseguimento: asfalto e margini arretrano lungo lo stesso
// asse prospettico della vettura; il paesaggio lontano si muove più lentamente.
function startDrivingRoad(canvas){
 if(!canvas)return ()=>{};
 const ctx=canvas.getContext('2d',{alpha:false});
 if(!ctx)return ()=>{};
 let frame=0,stopped=false,width=0,height=0;
 const texture=document.createElement('canvas');texture.width=texture.height=128;
 const tx=texture.getContext('2d');const pixels=tx.createImageData(128,128);
 let seed=48271;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 for(let i=0;i<pixels.data.length;i+=4){const v=38+Math.floor(random()*28);pixels.data[i]=v;pixels.data[i+1]=v+1;pixels.data[i+2]=v+3;pixels.data[i+3]=255;}tx.putImageData(pixels,0,0);
 const pattern=ctx.createPattern(texture,'repeat');
 const trees=Array.from({length:50},()=>({x:random()*1.7-.35,h:18+random()*65,w:12+random()*24}));
 const start=performance.now();
 function polygon(points,fill){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
 function draw(now){
  if(stopped)return;
  const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(window.devicePixelRatio||1,1.5);
  if(w!==width||h!==height){width=w;height=h;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
  const elapsed=(now-start)/1000;
  const horizon=h*.40,vx=-w*.35,center=w*1.0,roadWidth=w*(w<700?5:3.4);
  const project=(lateral,depth)=>{const t=1/(1+depth*.095);return [vx+(center-vx+lateral*roadWidth)*t,horizon+(h-horizon)*t];};
  const sky=ctx.createLinearGradient(0,0,0,horizon);sky.addColorStop(0,'#253341');sky.addColorStop(.75,'#71808b');sky.addColorStop(1,'#b0b0a2');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
  // Colline, foschia e alberi: strati con profondità diversa.
  polygon([[0,horizon],[0,horizon-35],[w*.1,horizon-65],[w*.28,horizon-32],[w*.42,horizon-52],[w*.65,horizon-22],[w*.8,horizon-55],[w,horizon-35],[w,horizon]],'#616e69');
  const grass=ctx.createLinearGradient(0,horizon,0,h);grass.addColorStop(0,'#4b5340');grass.addColorStop(1,'#272d22');ctx.fillStyle=grass;ctx.fillRect(0,horizon,w,h-horizon);
  for(const tree of trees){let x=((tree.x*w-elapsed*9)%(w*1.7)+w*1.7)%(w*1.7)-w*.35;polygon([[x-tree.w,horizon+5],[x-tree.w*.4,horizon-tree.h*.7],[x,horizon-tree.h],[x+tree.w*.6,horizon-tree.h*.5],[x+tree.w,horizon+5]],'#303e35');}
  const a=project(-.5,0),b=project(.5,0);
  polygon([[vx,horizon],a,b],'#626362');
  polygon([[vx,horizon],project(-.475,0),project(.475,0)],'#343639');
  ctx.save();ctx.beginPath();ctx.moveTo(vx,horizon);ctx.lineTo(...project(-.475,0));ctx.lineTo(...project(.475,0));ctx.closePath();ctx.clip();
  ctx.globalAlpha=.26;ctx.translate(-elapsed*54,-elapsed*16);ctx.fillStyle=pattern;ctx.fillRect(elapsed*54,elapsed*16,w,h);ctx.restore();
  // La carreggiata si allontana dalla camera, che segue l'auto in avanti.
  for(const side of [-.46,.46])polygon([project(side-.002,0),project(side+.002,0),project(side+.002,140),project(side-.002,140)],'#c6c8bf');
  const travel=elapsed*20;
  for(let i=0;i<36;i++){
   const z=(i*5+travel)%180;
   polygon([project(-.004,z),project(.004,z),project(.004,z+2.4),project(-.004,z+2.4)],'#d9d7c9');
  }
  // Dettagli dei bordi condividono la velocità e il punto di fuga dell'asfalto.
  for(let i=0;i<22;i++){
   const z=(i*8+travel)%176,t=1/(1+z*.095);
   for(const side of [-.53,.53]){const [x,y]=project(side,z);ctx.fillStyle='#c6c8c5';ctx.fillRect(x,y-45*t,Math.max(1,4*t),45*t);ctx.fillStyle='#a22d30';ctx.fillRect(x,y-38*t,Math.max(1,4*t),7*t);}
  }
  const haze=ctx.createLinearGradient(0,horizon-20,0,horizon+h*.15);haze.addColorStop(0,'#b0b3ad44');haze.addColorStop(1,'#b0b3ad00');ctx.fillStyle=haze;ctx.fillRect(0,horizon-20,w,h*.2);
  const shade=ctx.createRadialGradient(w*.5,h*.5,w*.1,w*.5,h*.5,w*.8);shade.addColorStop(0,'#0000');shade.addColorStop(1,'#0009');ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
  frame=requestAnimationFrame(draw);
 }
 frame=requestAnimationFrame(draw);
 return ()=>{stopped=true;cancelAnimationFrame(frame);};
}
