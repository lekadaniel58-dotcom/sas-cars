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
 let ended=false,driveTimer,exitTimer,loadTimer;
 const previousFocus=document.activeElement;
 const background=[...document.body.children].filter(node=>node!==intro&&node.tagName!=='SCRIPT');
 const inertState=background.map(node=>[node,node.inert]);
 const finish=()=>{
  if(ended)return;ended=true;
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
 loadTimer=setTimeout(finish,6000);
 const ready=image.decode?image.decode():Promise.resolve();
 ready.then(()=>{
  if(ended)return;
  intro.classList.add('running');
  driveTimer=setTimeout(leave,3500);
 }).catch(finish);
})();
