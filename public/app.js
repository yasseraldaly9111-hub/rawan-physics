window.RUNAPP=function(){
(function(){
const D=window.__DATA__;
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const darkC3=st=>st+';--c3:color-mix(in srgb,var(--c1) 16%,#121c3b)';
window.APP={ar,$,$$};

/* ---------- grade state ---------- */
let grade=store.get('grade')==='1'?'1':'3';
function setGrade(g,nav){
  grade=g;store.set('grade',g);
  $$('.grades button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.grade===g));
  $('#navGrade').href='#g'+g;
  $('.nav a[data-nav="wizari"]').hidden=g!=='3';
  if(nav)location.hash='g'+g;
  window.CLASS&&CLASS.onRoute&&CLASS.onRoute((location.hash||'#home').slice(1));
}
$$('.grades button').forEach(b=>b.onclick=()=>setGrade(b.dataset.grade,true));

/* ---------- chapter cards ---------- */
function chCard(c){
  const wzN=(c.wz.match(/<li>/g)||[]).length+(c.wz.match(/class="box ex wzp"/g)||[]).length;
  return `<a class="card chcard" href="#ch${c.i}" style="${c.style}">
    <div class="thumb"><svg viewBox="0 0 300 220" aria-hidden="true"><use href="#${c.hero}"/></svg></div>
    <div class="meta"><span class="no">${c.num}</span><b>${c.title}</b><small>${c.topics}</small>
    <div class="row" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><span class="tag" style="--gc:${c.style.match(/--c1:([^;]+)/)[1]}">${ar(wzN)} سؤالًا وزاريًا</span></div></div></a>`;
}
const LOCK=D.locked||{};
const GNAME={'1':'الأول المتوسط','3':'الثالث المتوسط'};
function lockCard(g){return `<form class="card lockform" data-g="${g}" autocomplete="off"><span class="ci">🔐</span><div class="lf-body">
  <b>مادة ${GNAME[g]} محمية برمز الصف</b><p>اطلب رمز الصف من الأستاذة واكتبه هنا مرة واحدة، فتُفتح لك المادة والأسئلة على هذا الجهاز.</p>
  <div class="row"><input name="code" required minlength="4" maxlength="20" dir="ltr" placeholder="رمز الصف" aria-label="رمز الصف ${GNAME[g]}"><button class="btn pri" type="submit">دخول</button></div>
  <span class="count lf-st" role="status"></span></div></form>`;}
window.APP.lockCard=lockCard;
function renderGrade(g){
  const v=$('#v-grade');
  if(LOCK[g]){v.innerHTML=`<span class="kick">${GNAME[g]}</span><h1 class="h1">فصول ${GNAME[g]}</h1>${lockCard(g)}
    <p class="lede" style="margin-top:16px">بإمكانك تجربة <a href="#lab">مختبر المحاكاة</a> من دون رمز.</p>`;return;}
  const labN=(window.LAB_COUNT&&window.LAB_COUNT[g])||0;
  if(g==='3'){
    v.innerHTML=`<span class="kick">الصف الثالث المتوسط</span><h1 class="h1">فصول الثالث المتوسط</h1>
      <p class="lede">اختر الفصل لتقرأ شرحه كاملًا مع الأمثلة والتمارين، وتحت كل فصل أسئلته الوزارية.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px"><a class="btn pri" href="#wizari">كل الأسئلة الوزارية</a><a class="btn" href="#lab">تجارب الثالث المتوسط (${ar(labN)})</a></div>
      ${D.chapters.length?`<div class="grid g3">${D.chapters.map(chCard).join('')}</div>`:'<div class="card soon"><b>لم تُرفع مادة الفصول بعد</b><p>ستظهر الفصول هنا بعد أن ترفعها الأستاذة من لوحة التحكم.</p></div>'}`;
  }else{
    v.innerHTML=`<span class="kick">الصف الأول المتوسط</span><h1 class="h1">فيزياء الأول المتوسط</h1>
      <p class="lede">مختبر تجارب الأول المتوسط جاهز، وشرح الفصول والأسئلة يُضاف هنا قريبًا بنفس طريقة الثالث المتوسط.</p>
      <div class="card soon"><b>شرح الفصول قيد الإعداد</b><p>تابع هذا القسم، وإلى حين ذلك جرّب تجارب الكثافة والطفو، والبندول البسيط، والرافعة، والحركة.</p><a class="btn pri" href="#lab">افتح تجارب الأول المتوسط (${ar(labN)})</a></div>`;
  }
}

/* ---------- reader ---------- */
function renderReader(i,tab){
  const c=D.chapters[i-1], v=$('#v-reader');
  v.setAttribute('style',darkC3(c.style));
  const prev=i>1?`<a class="btn" href="#ch${i-1}">→ ${D.chapters[i-2].title}</a>`:'<a class="btn" href="#g3">→ كل الفصول</a>';
  const next=i<9?`<a class="btn pri" href="#ch${i+1}">${D.chapters[i].title} ←</a>`:'<a class="btn pri" href="#wizari">الأسئلة الوزارية ←</a>';
  v.innerHTML=`<div class="reader-top"><div><span class="num">${c.num}</span><h1>${c.title}</h1><p>${c.lead}</p></div>
    <svg viewBox="0 0 300 220" aria-hidden="true"><use href="#${c.hero}"/></svg></div>
    <div class="card goalsw"><h2>بعد دراستك لهذا الفصل ستكون قادرًا على أن:</h2><ul>${c.goals}</ul></div>
    <div class="tabs" role="tablist">
      <button role="tab" data-t="learn" aria-selected="${tab!=='wz'}">الشرح والتمارين</button>
      <button role="tab" data-t="wz" aria-selected="${tab==='wz'}">الأسئلة الوزارية للفصل</button>
    </div>
    <article class="reader" id="readerBody"></article>
    <div class="chnav">${prev}${next}</div>`;
  const body=$('#readerBody');
  const show=t=>{
    $$('.tabs button',v).forEach(b=>b.setAttribute('aria-selected',b.dataset.t===t));
    if(t==='wz'){body.innerHTML=c.wz;prepWz(body,i);}
    else body.innerHTML=c.content+`<details class="answers-box"><summary>أجوبة تمارين الفصل</summary><div class="in">${c.ans}</div></details>`;
    wrapTables(body);
  };
  $$('.tabs button',v).forEach(b=>b.onclick=()=>show(b.dataset.t));
  show(tab==='wz'?'wz':'learn');
}
function wrapTables(root){$$('table.cmp',root).forEach(t=>{if(!t.parentElement.classList.contains('tw')){const w=document.createElement('div');w.className='tw';t.before(w);w.append(t);}})}

/* ---------- ministerial ---------- */
function yearsOf(el){return [...new Set($$('.yr',el).map(y=>(y.textContent.match(/20\d\d/)||[])[0]).filter(Boolean))]}
function addReveal(target,label){
  target.classList.add('hid');
  const b=document.createElement('button');b.type='button';b.className='reveal';b.textContent=label;b.dataset.label=label;
  b.onclick=()=>{const h=target.classList.toggle('hid');b.textContent=h?label:'أخفِ الجواب';};
  target.before(b);
}
function prepWz(root,ch){
  $$('ol.wzlist>li',root).forEach(li=>{li.dataset.ch=ch;li.dataset.type='q';li.dataset.y=yearsOf(li).join(' ');const a=$('.wza',li);if(a)addReveal(a,'أظهر الجواب');});
  $$('.wzp',root).forEach(p=>{p.dataset.ch=ch;p.dataset.type='p';p.dataset.y=yearsOf(p).join(' ');const s=$('.sol',p);if(s)addReveal(s,'أظهر الحل');});
}
const wzList=$('#wzList');
if(LOCK['3'])$('#v-wizari .filters').hidden=true;
wzList.innerHTML=LOCK['3']?lockCard('3'):D.chapters.map(c=>`<section class="wzgroup" data-group="${c.i}" style="${darkC3(c.style)}"><h2>${c.num}: ${c.title} <span data-cnt></span></h2><div class="reader">${c.wz}</div></section>`).join('');
$$('.wzgroup').forEach(g=>prepWz(g,g.dataset.group));
const items=$$('[data-type]',wzList);
if(items.length)$('#statWz').textContent='+'+ar(Math.floor(items.length/10)*10);
const years=[...new Set(items.flatMap(e=>e.dataset.y.split(' ').filter(Boolean)))].sort();
$('#yearSel').insertAdjacentHTML('beforeend',years.map(y=>`<option value="${y}">${ar(y)}</option>`).join(''));
const chF=$('#chFilter');
chF.innerHTML=`<button class="chip" type="button" aria-pressed="true" data-ch="">كل الفصول</button>`+D.chapters.map(c=>`<button class="chip" type="button" aria-pressed="false" data-ch="${c.i}">${ar(c.i)}. ${c.title}</button>`).join('');
let fCh='';
$$('.chip',chF).forEach(b=>b.onclick=()=>{fCh=b.dataset.ch;$$('.chip',chF).forEach(x=>x.setAttribute('aria-pressed',x===b));applyF();});
$('#yearSel').onchange=applyF;$('#typeSel').onchange=applyF;$('#wzSearch').oninput=applyF;
const norm=t=>t.replace(/[ً-ْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
function applyF(){
  if(LOCK['3'])return;
  const y=$('#yearSel').value,t=$('#typeSel').value,q=norm($('#wzSearch').value.trim());let n=0;
  items.forEach(e=>{const ok=(!fCh||e.dataset.ch===fCh)&&(!y||e.dataset.y.includes(y))&&(!t||e.dataset.type===t)&&(!q||norm(e.textContent).includes(q));e.classList.toggle('hid',!ok);if(ok)n++;});
  $$('.wzgroup').forEach(g=>{
    const vis=$$('[data-type]',g).filter(e=>!e.classList.contains('hid')).length;
    g.classList.toggle('hid',vis===0);$('[data-cnt]',g).textContent=ar(vis)+' سؤال';
    $$('h3.sec',g).forEach(h=>{let el=h.nextElementSibling,any=false;while(el&&!el.matches('h3.sec')){if((el.matches('[data-type]')&&!el.classList.contains('hid'))||$$('[data-type]',el).some(x=>!x.classList.contains('hid')))any=true;el=el.nextElementSibling;}h.classList.toggle('hid',!any);});
  });
  $('#wzCount').textContent=`يظهر ${ar(n)} من ${ar(items.length)} سؤالًا ومسألة`;
  const em=$('#wzEmpty');if(!n){if(!em)wzList.insertAdjacentHTML('afterbegin','<p class="empty card" id="wzEmpty">لا توجد أسئلة مطابقة لهذا الاختيار. غيّر السنة أو الفصل أو كلمة البحث.</p>');}else if(em)em.remove();
}
let allShown=false;
$('#toggleAll').onclick=()=>{allShown=!allShown;$$('.reveal',wzList).forEach(b=>{b.nextElementSibling.classList.toggle('hid',!allShown);b.textContent=allShown?'أخفِ الجواب':b.dataset.label;});$('#toggleAll').textContent=allShown?'أخفِ كل الأجوبة':'أظهر كل الأجوبة';};
applyF();

/* ---------- router ---------- */
function route(){
  const h=(location.hash||'#home').slice(1);
  let m=h.match(/^ch(\d)(wz)?$/),g=h.match(/^g([13])$/),navKey='home';
  $$('.view').forEach(x=>x.hidden=true);
  if(m&&!D.chapters[+m[1]-1]){location.replace('#g3');return;}
  if(m){setGrade('3');renderReader(+m[1],m[2]?'wz':'');$('#v-reader').hidden=false;navKey='grade';}
  else if(g){setGrade(g[1]);renderGrade(g[1]);$('#v-grade').hidden=false;navKey='grade';}
  else if(h==='wizari'){setGrade('3');$('#v-wizari').hidden=false;navKey='wizari';}
  else if(h==='lab'){$('#v-lab').hidden=false;navKey='lab';window.LAB&&window.LAB.show(grade);}
  else if(window.CLASS&&CLASS.views[h]){$('#v-'+h).hidden=false;navKey=h;CLASS.views[h]();}
  else{$('#v-home').hidden=false;}
  window.CLASS&&CLASS.onRoute(h);
  $$('.nav a').forEach(a=>{if(a.dataset.nav===navKey)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  window.scrollTo(0,0);
  window.LAB&&window.LAB.visible(h==='lab');
}
window.APP.route=route;window.APP.getGrade=()=>grade;
setGrade(grade);
window.addEventListener('hashchange',route);
})();

(function(){
const {ar,$,$$}=window.APP;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const DEFS=[];
window.labDef=o=>DEFS.push(o);

/* ---------- helpers shared by all experiments ---------- */
const H={
  RM,ar,
  slider(ctl,o){
    const id='s-'+o.id;
    ctl.insertAdjacentHTML('beforeend',`<label for="${id}"><span class="lv"><span>${o.label}</span><output id="${id}-o"></output></span><input id="${id}" type="range" min="${o.min}" max="${o.max}" step="${o.step||1}" value="${o.value}"></label>`);
    const i=$('#'+id),out=$('#'+id+'-o');
    const f=()=>{out.textContent=(o.fmt?o.fmt(+i.value):i.value)+(o.unit?' '+o.unit:'');o.on&&o.on(+i.value)};
    i.addEventListener('input',f);
    return {get v(){return +i.value},set(x){i.value=x;out.textContent=(o.fmt?o.fmt(+i.value):i.value)+(o.unit?' '+o.unit:'')},init:f,input:i};
  },
  seg(ctl,id,label,opts,val,on){
    ctl.insertAdjacentHTML('beforeend',`<div><span style="font-size:14px">${label}</span><div class="seg" id="${id}" role="group">${opts.map(([v,t])=>`<button type="button" data-v="${v}" aria-pressed="${v===val}">${t}</button>`).join('')}</div></div>`);
    const g=$('#'+id);$$('button',g).forEach(b=>b.onclick=()=>{$$('button',g).forEach(x=>x.setAttribute('aria-pressed',x===b));on(b.dataset.v)});
    return g;
  },
  // Arabic label with numbers on a canvas: right-to-left, numbers kept in reading order
  rtl(ctx,t,x,y){const d=ctx.direction;ctx.direction='rtl';ctx.fillText(String(t).replace(/(-?\d[\d.,]*)/g,'\u200e$1'),x,y);ctx.direction=d;},
  check(ctl,id,label,val,on){ctl.insertAdjacentHTML('beforeend',`<label class="chk"><input type="checkbox" id="${id}"${val?' checked':''}> <span>${label}</span></label>`);const i=$('#'+id);i.onchange=()=>on(i.checked);return i;},
  button(ctl,id,text,on){ctl.insertAdjacentHTML('beforeend',`<button type="button" class="btn" id="${id}">${text}</button>`);const b=$('#'+id);b.onclick=()=>on(b);return b;},
  note(ctl,html){ctl.insertAdjacentHTML('beforeend',`<p class="note">${html}</p>`)},
  reads(X){let d=$('.reads',X.el);if(!d){d=document.createElement('div');d.className='reads';X.stage.after(d);}return d;},
  rd(items){return items.map(([k,v,rtl])=>`<div class="rd"><small>${k}</small><b${rtl?' style="direction:rtl"':''}>${v}</b></div>`).join('')},
  sci(x,d=2){if(!isFinite(x))return '∞';if(x===0)return'0';const e=Math.floor(Math.log10(Math.abs(x)));if(e>=-2&&e<4)return(+x.toFixed(d)).toString();const m=x/10**e;return `${+m.toFixed(d)}×10<sup>${e}</sup>`},
  canvas(X,W,Hh,hint){
    X.stage.classList.add('light');
    const c=document.createElement('canvas');const dpr=Math.min(3,Math.max(2,window.devicePixelRatio||1));
    c.width=W*dpr;c.height=Hh*dpr;c.style.aspectRatio=W+'/'+Hh;X.stage.append(c);
    const ctx=c.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.direction='ltr';
    if(hint)X.stage.insertAdjacentHTML('beforeend',`<span class="hint">${hint}</span>`);
    const pt=e=>{const r=c.getBoundingClientRect();return {x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*Hh/r.height}};
    return {c,ctx,W,H:Hh,pt};
  },
  loop(fn){let id=0,on=false,last=0;const tick=t=>{if(!on)return;const dt=Math.min(.05,(t-(last||t))/1000);last=t;fn(dt,t);id=requestAnimationFrame(tick)};
    return {start(){if(on)return;on=true;last=0;id=requestAnimationFrame(tick)},stop(){on=false;cancelAnimationFrame(id)}}},
  three(X,aspect,hint){
    X.stage.classList.add('dark');
    if(!window.THREE){X.stage.innerHTML='<p class="sim-fallback" style="color:#cdd5f2">هذه التجربة تحتاج اتصالًا بالإنترنت لتحميل مكتبة الرسم ثلاثي الأبعاد.</p>';return null;}
    const T=window.THREE;
    const renderer=new T.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
    renderer.outputEncoding=T.sRGBEncoding;
    X.stage.append(renderer.domElement);
    if(hint)X.stage.insertAdjacentHTML('beforeend',`<span class="hint">${hint}</span>`);
    const scene=new T.Scene();scene.background=new T.Color(0x070b18);
    const cam=new T.PerspectiveCamera(42,aspect,0.1,200);
    const size=()=>{const w=X.stage.clientWidth||600;renderer.setSize(w,w/aspect,false);renderer.domElement.style.aspectRatio=aspect;cam.aspect=aspect;cam.updateProjectionMatrix();};
    size();new ResizeObserver(size).observe(X.stage);
    let controls=null;if(T.OrbitControls){controls=new T.OrbitControls(cam,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;}
    scene.add(new T.HemisphereLight(0xbfd0ff,0x101525,0.75));
    const dl=new T.DirectionalLight(0xffffff,0.9);dl.position.set(5,10,6);scene.add(dl);
    const ray=new T.Raycaster(),ndc=new T.Vector2();
    const pick=(e,objs)=>{const r=renderer.domElement.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ndc,cam);return objs?ray.intersectObjects(objs,true):ray;};
    return {T,renderer,scene,cam,controls,pick,render(){controls&&controls.update();renderer.render(scene,cam)}};
  },
  textTex(text,bg,fg){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,128,128);g.fillStyle=fg;g.font='bold 84px Readex Pro, Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(text,64,70);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;}
};
window.LABH=H;

/* ---------- lab shell ---------- */
window.LABINIT=function(){

const grid=$('#labGrid');let built=false,labOn=false,cur='3';
const insts=new Map();
function build(){
  if(built)return;built=true;
  DEFS.forEach(o=>{
    const el=document.createElement('article');el.className='card exp'+(o.wide?' wide':'');el.id='x-'+o.id;el.dataset.grade=o.grade;
    el.setAttribute('style',`--c1:${o.c1};--c2:${o.c2}`);
    el.innerHTML=`<header><span class="ic">${o.icon}</span><div><h2>${o.title}</h2><p>${o.ch} • ${o.desc}</p></div><div class="badges">${(o.tags||[]).map(t=>`<span class="tag" style="--gc:${o.c1}">${t}</span>`).join('')}</div>
      <div class="fsbtns"><button type="button" class="btn pri play" data-full>▶ تشغيل</button><button type="button" class="btn sm" data-fs hidden title="ملء الشاشة">⛶</button><button type="button" class="btn sm" data-min hidden>✕ تصغير</button></div></header>
      <div class="body"><div class="ctl"></div><div class="stage"></div></div>`;
    grid.append(el);
  });
  const io=new IntersectionObserver(es=>es.forEach(en=>{
    const o=DEFS.find(d=>'x-'+d.id===en.target.id);if(!o)return;
    if(en.isIntersecting&&labOn){const inst=ensure(o,en.target);inst._vis=true;if(!full||full===en.target)inst.start&&inst.start();}
    else{const inst=insts.get(o.id);if(inst){inst.stop&&inst.stop();inst._vis=false;}}
  }),{rootMargin:'120px'});
  $$('.exp',grid).forEach(e=>{io.observe(e);
    const o=DEFS.find(d=>'x-'+d.id===e.id);
    $('[data-full]',e).onclick=()=>enterFull(o,e);
    $('[data-min]',e).onclick=()=>exitFull();
    $('[data-fs]',e).onclick=()=>{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else if(e.requestFullscreen)e.requestFullscreen().catch(()=>{});};
  });
  new ResizeObserver(()=>{if(full)fit(full);}).observe(document.documentElement);
}
function ensure(o,el){
  let inst=insts.get(o.id);
  if(!inst){const X={el,ctl:$('.ctl',el),stage:$('.stage',el)};try{inst=o.init(X,H)||{};}catch(err){console.error(err);X.stage.innerHTML='<p class="sim-fallback">تعذّر تشغيل هذه التجربة على هذا الجهاز.</p>';inst={};}insts.set(o.id,inst);}
  return inst;
}
/* ---------- full screen ("play") ---------- */
let full=null;
function fit(el){
  const st=$('.stage',el),m=st&&st.querySelector(':scope>canvas,:scope>svg');if(!m)return;
  if(!el.classList.contains('full')||innerWidth<=760){m.style.width='';return;}
  let ar=1;if(m.tagName.toLowerCase()==='svg'){const vb=m.viewBox&&m.viewBox.baseVal;ar=vb&&vb.height?vb.width/vb.height:1.6;}else ar=m.width/m.height||1.6;
  const pad=parseFloat(getComputedStyle(st).paddingLeft)*2||0;
  m.style.width=Math.max(160,Math.min(st.clientWidth-pad,(st.clientHeight-pad)*ar))+'px';
}
function enterFull(o,el){
  if(full)exitFull(true);
  full=el;el.classList.add('full');document.body.classList.add('noscroll');
  $('[data-full]',el).hidden=true;$('[data-min]',el).hidden=false;$('[data-fs]',el).hidden=!el.requestFullscreen;
  insts.forEach((i,id)=>{if('x-'+id!==el.id&&i.stop)i.stop();});
  const inst=ensure(o,el);inst.start&&inst.start();
  requestAnimationFrame(()=>{fit(el);window.dispatchEvent(new Event('resize'));});
  $('[data-min]',el).focus();
}
function exitFull(keep){
  const el=full;if(!el)return;full=null;
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
  el.classList.remove('full');document.body.classList.remove('noscroll');
  $('[data-full]',el).hidden=false;$('[data-min]',el).hidden=true;$('[data-fs]',el).hidden=true;fit(el);
  if(!keep){insts.forEach(i=>{if(i._vis&&i.start)i.start();else if(!i._vis&&i.stop)i.stop();});el.scrollIntoView({block:'center'});$('[data-full]',el).focus();}
  window.dispatchEvent(new Event('resize'));
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&full&&!document.fullscreenElement)exitFull();});
const counts={'1':DEFS.filter(d=>d.grade==='1').length,'3':DEFS.filter(d=>d.grade==='3').length};
window.LAB_COUNT=counts;
$('#statLab').textContent=ar(DEFS.length);
const nExp=n=>ar(n)+(n>=3&&n<=10?' تجارب':' تجربة');
$('#g3LabTag').textContent=nExp(counts['3']);$('#g1LabTag').textContent=nExp(counts['1']);
const lf=$('#labFilter');
lf.innerHTML=[['3','الثالث المتوسط'],['1','الأول المتوسط'],['all','كل التجارب']].map(([v,t])=>`<button type="button" class="chip" data-g="${v}" aria-pressed="false">${t} (${ar(v==='all'?DEFS.length:counts[v])})</button>`).join('');
function filter(g){cur=g;$$('.chip',lf).forEach(b=>b.setAttribute('aria-pressed',b.dataset.g===g));$$('.exp',grid).forEach(e=>e.hidden=!(g==='all'||e.dataset.grade===g));}
$$('.chip',lf).forEach(b=>b.onclick=()=>filter(b.dataset.g));
window.LAB={
  show(g){build();filter(g);},
  visible(v){if(!v&&full)exitFull(true);labOn=v;insts.forEach(i=>{if(!v&&i.stop)i.stop();else if(v&&i._vis&&i.start)i.start();});if(v)setTimeout(()=>window.dispatchEvent(new Event('scroll')),50);}
};
};
})();

/* ===================== GRADE 3 — realistic simulations ===================== */

/* ---------- 1. Balloon & static electricity (PhET-style) ---------- */
labDef({id:'balloon',grade:'3',icon:'⚡',title:'البالون والكهربائية الساكنة',ch:'الفصل الأول',desc:'ادلك البالون بالصوف واتركه قرب الجدار',c1:'#5a74ff',c2:'#b18cff',tags:['محاكاة','اسحب البالون'],
init(X,H){
  const {ctx,W,H:Hh,pt,c}=H.canvas(X,900,520,'اسحب البالون وادلكه على الصوف ثم اتركه');
  const SW={x:30,y:40,w:270,h:440};const WALL=760;
  const rnd=(a,b)=>a+Math.random()*(b-a);
  let sw,b,wall=true,show='all',drag=null;
  function reset(){
    sw=[];for(let r=0;r<9;r++)for(let k=0;k<5;k++){const x=SW.x+30+k*50+(r%2)*12,y=SW.y+28+r*46;sw.push({x,y,neg:true});}
    b={x:470,y:250,vx:0,vy:0,q:0,rx:62,ry:78,stuck:false};
  }
  reset();
  const H2=X.ctl;
  H.seg(H2,'bShow','إظهار الشحنات',[['all','كل الشحنات'],['diff','الفرق فقط'],['none','بدون']],'all',v=>show=v);
  H.seg(H2,'bWall','الجدار',[['1','موجود'],['0','إزالة الجدار']],'1',v=>wall=v==='1');
  H.button(H2,'bReset','إعادة البالون والصوف',reset);
  H.note(H2,'<b>لاحظ:</b> البالون يكتسب إلكترونات من الصوف فيُشحن بشحنة سالبة والصوف موجبة. إذا قرّبته من الجدار تبتعد شحنات الجدار السالبة فينجذب البالون إليه (الشحن بالحث).');
  const R=H.reads(X);
  const inBal=(p)=>((p.x-b.x)/b.rx)**2+((p.y-b.y)/b.ry)**2<=1;
  let lastP=null;
  c.addEventListener('pointerdown',e=>{const p=pt(e);if(inBal(p)){drag={dx:p.x-b.x,dy:p.y-b.y};lastP=p;b.vx=b.vy=0;b.stuck=false;c.setPointerCapture(e.pointerId);}});
  c.addEventListener('pointermove',e=>{if(!drag)return;const p=pt(e);
    b.x=Math.max(b.rx,Math.min(W-b.rx-(wall?W-WALL:0),p.x-drag.dx));b.y=Math.max(b.ry,Math.min(Hh-b.ry-30,p.y-drag.dy));
    const moved=lastP?Math.hypot(p.x-lastP.x,p.y-lastP.y):0;lastP=p;
    if(moved>3&&b.x-b.rx<SW.x+SW.w){let best=null,bd=1e9;sw.forEach(s=>{if(!s.neg)return;const d=Math.hypot(s.x-b.x,s.y-b.y);if(d<bd){bd=d;best=s}});if(best&&bd<b.rx+10){best.neg=false;b.q++;}}
  });
  const end=()=>{drag=null;};c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
  function step(dt){
    if(!drag&&!b.stuck){
      const swq=sw.filter(s=>!s.neg).length;let fx=0,fy=0;
      if(b.q&&swq){const cx=SW.x+SW.w/2,cy=b.y;const dx=cx-b.x,d=Math.max(80,Math.abs(dx));fx+=Math.sign(dx)*b.q*swq*900/(d*d);}
      if(wall&&b.q){const d=Math.max(20,WALL-(b.x+b.rx));fx+=b.q*b.q*30/(d*d+300);}
      b.vx=(b.vx+fx*dt*60)*0.96;b.vy=(b.vy+fy)*0.96;b.x+=b.vx*dt*60;
      if(wall&&b.x+b.rx>=WALL){b.x=WALL-b.rx;b.vx=0;if(b.q)b.stuck=true;}
      if(b.x-b.rx<SW.x+SW.w-20&&b.vx<0){b.x=SW.x+SW.w-20+b.rx;b.vx=0;}
      if(b.x+b.rx>W){b.x=W-b.rx;b.vx=0}
    }
  }
  function charge(x,y,sign,a=1){ctx.globalAlpha=a;ctx.fillStyle=sign>0?'#e5354f':'#2f5bff';ctx.beginPath();ctx.arc(x,y,7.5,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);if(sign>0){ctx.moveTo(x,y-4);ctx.lineTo(x,y+4)}ctx.stroke();ctx.globalAlpha=1}
  function draw(){
    const g=ctx.createLinearGradient(0,0,0,Hh);g.addColorStop(0,'#f4f1ea');g.addColorStop(1,'#e2ddd2');ctx.fillStyle=g;ctx.fillRect(0,0,W,Hh);
    ctx.fillStyle='#cfc6b4';ctx.fillRect(0,Hh-30,W,30);
    // sweater
    ctx.save();ctx.beginPath();ctx.roundRect(SW.x,SW.y,SW.w,SW.h,26);ctx.fillStyle='#3c8f7c';ctx.fill();ctx.clip();
    ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=3;for(let y=SW.y+8;y<SW.y+SW.h;y+=14){ctx.beginPath();for(let x=SW.x;x<=SW.x+SW.w;x+=14){ctx.lineTo(x,y+((x/14)%2?5:0))}ctx.stroke();}
    ctx.restore();ctx.fillStyle='#2f7362';ctx.font='600 18px Readex Pro';ctx.textAlign='center';ctx.fillText('صوف',SW.x+SW.w/2,SW.y+SW.h+24);
    if(show!=='none')sw.forEach(s=>{if(show==='all')charge(s.x+12,s.y,1);if(show==='all'&&s.neg)charge(s.x-6,s.y+10,-1);if(show==='diff'&&!s.neg)charge(s.x+12,s.y,1);});
    // wall
    if(wall){ctx.fillStyle='#d9c9a3';ctx.fillRect(WALL,0,W-WALL,Hh-30);ctx.strokeStyle='rgba(120,90,40,.25)';for(let y=0;y<Hh-30;y+=34){ctx.beginPath();ctx.moveTo(WALL,y);ctx.lineTo(W,y);ctx.stroke();for(let x=WALL+(y/34%2?0:35);x<W;x+=70){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+34);ctx.stroke()}}
      if(show==='all'){for(let r=0;r<10;r++)for(let k=0;k<2;k++){const x=WALL+30+k*60,y=30+r*44;const d=Math.hypot(x-b.x,y-b.y);const sh=b.q?Math.min(14,b.q*2400/(d*d+2000)):0;charge(x,y,1);charge(x+10+sh,y+12,-1);}}
    }
    // string + balloon
    ctx.strokeStyle='#8a7a5a';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(b.x,b.y+b.ry+10);ctx.bezierCurveTo(b.x-20,b.y+b.ry+60,b.x+25,b.y+b.ry+110,b.x,Hh-30);ctx.stroke();
    const bg=ctx.createRadialGradient(b.x-b.rx*.35,b.y-b.ry*.4,6,b.x,b.y,b.ry*1.1);bg.addColorStop(0,'#fff6c4');bg.addColorStop(.35,'#ffcf3a');bg.addColorStop(1,'#d8901a');
    ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(b.x,b.y,b.rx,b.ry,0,0,7);ctx.fill();
    ctx.fillStyle='#d8901a';ctx.beginPath();ctx.moveTo(b.x-7,b.y+b.ry+10);ctx.lineTo(b.x+7,b.y+b.ry+10);ctx.lineTo(b.x,b.y+b.ry-2);ctx.fill();
    if(show==='all'){for(let k=0;k<4;k++){charge(b.x-24+k*16,b.y-10,1);charge(b.x-24+k*16,b.y+14,-1);}}
    if(show!=='none'){for(let k=0;k<b.q;k++){const a=k*2.4,r=18+((k*7)%30);charge(b.x-b.rx*.55+Math.cos(a)*r*.5,b.y+Math.sin(a)*r*1.4,-1);}}
    R.innerHTML=H.rd([['شحنة البالون',b.q?'−'+b.q:'0'],['شحنة الصوف',sw.filter(s=>!s.neg).length?'+'+sw.filter(s=>!s.neg).length:'0'],['الحالة',b.stuck?'ملتصق بالجدار':b.q?'مشحون':'متعادل',1]]);
  }
  const L=H.loop(dt=>{step(dt);draw();});draw();return L;
}});

/* ---------- 2. Magnet & compasses 3D ---------- */
labDef({id:'magnet3d',grade:'3',icon:'N',title:'المغناطيس والبوصلات 3D',ch:'الفصل الثاني',desc:'حرّك المغناطيس ولاحظ كيف تتبع البوصلات خطوط المجال',c1:'#ff5c8a',c2:'#ffa3bd',tags:['3D','اسحب المغناطيس'],
init(X,H){
  const S=H.three(X,16/10,'اسحب المغناطيس • دوّر المشهد بإصبعين أو بالفأرة');if(!S)return;
  const {T,scene,cam,controls,pick}=S;
  cam.position.set(0,13,11);cam.lookAt(0,0,0);if(controls){controls.target.set(0,0,0);controls.maxPolarAngle=1.35;controls.minDistance=8;controls.maxDistance=28;}
  const table=new T.Mesh(new T.PlaneGeometry(26,17),new T.MeshStandardMaterial({color:0x1b2440,roughness:.9}));table.rotation.x=-Math.PI/2;scene.add(table);
  const gridH=new T.GridHelper(26,26,0x2c3a66,0x222d52);gridH.position.y=.01;scene.add(gridH);
  // magnet
  const mag=new T.Group();
  const matN=[0,0,new T.MeshStandardMaterial({map:H.textTex('N','#e5354f','#fff')}),0,0,0].map(m=>m||new T.MeshStandardMaterial({color:0xe5354f,roughness:.45,metalness:.2}));
  const matS=[0,0,new T.MeshStandardMaterial({map:H.textTex('S','#3a5bff','#fff')}),0,0,0].map(m=>m||new T.MeshStandardMaterial({color:0x3a5bff,roughness:.45,metalness:.2}));
  const n=new T.Mesh(new T.BoxGeometry(1.8,.7,.9),matN);n.position.x=.9;const s=new T.Mesh(new T.BoxGeometry(1.8,.7,.9),matS);s.position.x=-.9;
  mag.add(n,s);mag.position.y=.36;scene.add(mag);
  // compasses
  const comps=[];const needleG=new T.ConeGeometry(.09,.42,12);
  for(let i=-6;i<=6;i++)for(let j=-4;j<=4;j++){
    const x=i*1.8,z=j*1.6;if(Math.abs(z)<1.2&&Math.abs(x)<2.8)continue;
    const g=new T.Group();g.position.set(x,.05,z);
    const base=new T.Mesh(new T.CylinderGeometry(.36,.36,.06,24),new T.MeshStandardMaterial({color:0xe9edf7,roughness:.6}));g.add(base);
    const nd=new T.Group();nd.position.y=.08;
    const red=new T.Mesh(needleG,new T.MeshStandardMaterial({color:0xe5354f}));red.rotation.z=-Math.PI/2;red.position.x=.21;
    const wht=new T.Mesh(needleG,new T.MeshStandardMaterial({color:0x8a93ad}));wht.rotation.z=Math.PI/2;wht.position.x=-.21;
    nd.add(red,wht);g.add(nd);scene.add(g);comps.push({g,nd,a:0});
  }
  let strength=1,earth=true,showLines=false,lines=null;
  const field=(x,z)=>{const ang=mag.rotation.y,dx=Math.cos(ang),dz=-Math.sin(ang);const L=1.5,mx=mag.position.x,mz=mag.position.z;
    const P=[[mx+dx*L,mz+dz*L,1],[mx-dx*L,mz-dz*L,-1]];let bx=0,bz=0;
    P.forEach(([px,pz,q])=>{const rx=x-px,rz=z-pz,r2=rx*rx+rz*rz+.05,r3=r2*Math.sqrt(r2);bx+=q*strength*6*rx/r3;bz+=q*strength*6*rz/r3;});
    if(earth){bz+=-.08;}return [bx,bz];};
  function buildLines(){
    if(lines){scene.remove(lines);lines.geometry.dispose();lines=null;}if(!showLines)return;
    const pts=[];const ang=mag.rotation.y,dx=Math.cos(ang),dz=-Math.sin(ang);
    for(let k=0;k<14;k++){const a=k/14*Math.PI*2;let x=mag.position.x+dx*1.5+Math.cos(a)*.35,z=mag.position.z+dz*1.5+Math.sin(a)*.35;
      for(let st=0;st<260;st++){const [bx,bz]=field(x,z);const m=Math.hypot(bx,bz)||1;const nx=x+bx/m*.09,nz=z+bz/m*.09;pts.push(x,.12,z,nx,.12,nz);x=nx;z=nz;
        if(Math.abs(x)>13||Math.abs(z)>8.5)break;const sx=mag.position.x-dx*1.5,sz=mag.position.z-dz*1.5;if(Math.hypot(x-sx,z-sz)<.3)break;}}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pts,3));
    lines=new T.LineSegments(g,new T.LineBasicMaterial({color:0x3ee0f0,transparent:true,opacity:.55}));scene.add(lines);
  }
  const ctl=X.ctl;
  H.button(ctl,'mRot','دوّر المغناطيس ٤٥°',()=>{mag.rotation.y+=Math.PI/4;buildLines();});
  H.button(ctl,'mFlip','اقلب الأقطاب',()=>{mag.rotation.y+=Math.PI;buildLines();});
  H.slider(ctl,{id:'mStr',label:'قوة المغناطيس',min:.2,max:2,step:.1,value:1,unit:'×',on:v=>{strength=v;buildLines();}}).init();
  H.seg(ctl,'mEarth','المجال المغناطيسي الأرضي',[['1','مفعّل'],['0','بدون']],'1',v=>{earth=v==='1';buildLines();});
  H.seg(ctl,'mLines','خطوط المجال',[['0','مخفية'],['1','إظهار']],'0',v=>{showLines=v==='1';buildLines();});
  H.note(ctl,'<b>لاحظ:</b> القطب الشمالي (الأحمر) لإبرة كل بوصلة يتجه مع خطوط المجال: يخرج من N ويدخل في S. وكلما ابتعدت عن المغناطيس صار تأثير المجال الأرضي أوضح.');
  // drag
  const plane=new T.Plane(new T.Vector3(0,1,0),-.36),hit=new T.Vector3();let dragging=false,off=new T.Vector3();
  const el=S.renderer.domElement;
  el.addEventListener('pointerdown',e=>{const h=pick(e,[n,s]);if(h.length){dragging=true;if(controls)controls.enabled=false;pick(e).ray.intersectPlane(plane,hit);off.copy(hit).sub(mag.position);el.setPointerCapture(e.pointerId);}});
  el.addEventListener('pointermove',e=>{if(!dragging)return;if(pick(e).ray.intersectPlane(plane,hit)){mag.position.x=Math.max(-11,Math.min(11,hit.x-off.x));mag.position.z=Math.max(-7,Math.min(7,hit.z-off.z));if(showLines)buildLines();}});
  const up=()=>{dragging=false;if(controls)controls.enabled=true;};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  const L=H.loop(dt=>{comps.forEach(c=>{const [bx,bz]=field(c.g.position.x,c.g.position.z);const tgt=Math.atan2(-bz,bx);let d=tgt-c.a;d=Math.atan2(Math.sin(d),Math.cos(d));c.a+=d*Math.min(1,dt*6);c.nd.rotation.y=c.a;});S.render();});
  S.render();return L;
}});

/* ---------- 3. Faraday's law 3D ---------- */
labDef({id:'faraday3d',grade:'3',icon:'↻',title:'قانون فاراداي: مغناطيس وملف 3D',ch:'الفصل السادس',desc:'حرّك المغناطيس داخل الملف وراقب المصباح والكلفانوميتر',c1:'#8e6bff',c2:'#c3adff',tags:['3D','اسحب المغناطيس'],
init(X,H){
  const S=H.three(X,16/9,'اسحب المغناطيس يمينًا ويسارًا • دوّر المشهد');if(!S)return;
  const {T,scene,cam,controls,pick}=S;
  cam.position.set(0,5.5,10.5);if(controls){controls.target.set(0,.6,0);controls.minDistance=6;controls.maxDistance=20;controls.maxPolarAngle=1.45;}
  const floor=new T.Mesh(new T.PlaneGeometry(30,16),new T.MeshStandardMaterial({color:0x1a2340,roughness:.95}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.4;scene.add(floor);
  const copper=new T.MeshStandardMaterial({color:0xd27a3a,metalness:.65,roughness:.32});
  let coil=null,loops=10;
  function makeCoil(){if(coil){scene.remove(coil);coil.geometry.dispose();}
    class Helix extends T.Curve{getPoint(t,v=new T.Vector3()){const Lc=2.6,r=1.15;return v.set(-Lc/2+Lc*t,r*Math.cos(2*Math.PI*loops*t),r*Math.sin(2*Math.PI*loops*t));}}
    coil=new T.Mesh(new T.TubeGeometry(new Helix(),loops*40,.07,8,false),copper);coil.position.y=.6;scene.add(coil);}
  makeCoil();
  // wires + bulb
  const wireMat=new T.MeshStandardMaterial({color:0x2b3350,roughness:.6});
  const w1=new T.CatmullRomCurve3([new T.Vector3(-1.3,1.75,0),new T.Vector3(-1.6,2.6,-1.2),new T.Vector3(-.5,2.9,-2.6),new T.Vector3(-.15,2.2,-3)]);
  const w2=new T.CatmullRomCurve3([new T.Vector3(1.3,1.75,0),new T.Vector3(1.6,2.6,-1.2),new T.Vector3(.5,2.9,-2.6),new T.Vector3(.15,2.2,-3)]);
  scene.add(new T.Mesh(new T.TubeGeometry(w1,40,.04,6),wireMat),new T.Mesh(new T.TubeGeometry(w2,40,.04,6),wireMat));
  const baseB=new T.Mesh(new T.CylinderGeometry(.28,.32,.5,24),new T.MeshStandardMaterial({color:0x9aa3bf,metalness:.7,roughness:.3}));baseB.position.set(0,2.2,-3);scene.add(baseB);
  const glassMat=new T.MeshStandardMaterial({color:0xfff3c4,emissive:0xffc040,emissiveIntensity:0,transparent:true,opacity:.55,roughness:.1});
  const bulb=new T.Mesh(new T.SphereGeometry(.6,32,24),glassMat);bulb.position.set(0,3,-3);scene.add(bulb);
  const glow=new T.PointLight(0xffc860,0,8);glow.position.copy(bulb.position);scene.add(glow);
  // magnet
  const mag=new T.Group();
  const mN=new T.Mesh(new T.BoxGeometry(1.3,.55,.55),[0,0,new T.MeshStandardMaterial({map:H.textTex('N','#e5354f','#fff')}),0,0,0].map(m=>m||new T.MeshStandardMaterial({color:0xe5354f,roughness:.4})));mN.position.x=.65;
  const mS=new T.Mesh(new T.BoxGeometry(1.3,.55,.55),[0,0,new T.MeshStandardMaterial({map:H.textTex('S','#3a5bff','#fff')}),0,0,0].map(m=>m||new T.MeshStandardMaterial({color:0x3a5bff,roughness:.4})));mS.position.x=-.65;
  mag.add(mN,mS);mag.position.set(-5,.6,0);scene.add(mag);
  const track=new T.Mesh(new T.BoxGeometry(14,.06,.9),new T.MeshStandardMaterial({color:0x2a355f}));track.position.set(0,.28,0);scene.add(track);
  // galvanometer overlay
  X.stage.insertAdjacentHTML('beforeend',`<svg class="galv" viewBox="0 0 160 100" style="position:absolute;top:10px;inset-inline-end:10px;width:min(34%,170px);height:auto;background:rgba(5,8,18,.75);border-radius:14px;border:1px solid rgba(160,180,255,.25)"><path d="M20 85 A60 60 0 0 1 140 85" fill="none" stroke="#cdd5f2" stroke-width="2"/><g stroke="#8f9bc4">${[-60,-40,-20,0,20,40,60].map(a=>`<line x1="80" y1="30" x2="80" y2="22" transform="rotate(${a} 80 85)"/>`).join('')}</g><text x="80" y="62" text-anchor="middle" fill="#8f9bc4" font-size="13" font-family="Readex Pro">G</text><line id="gNeedle" x1="80" y1="85" x2="80" y2="32" stroke="#ff6b92" stroke-width="3" stroke-linecap="round"/><circle cx="80" cy="85" r="5" fill="#cdd5f2"/></svg>`);
  const needle=X.stage.querySelector('#gNeedle');
  let strength=1,flip=1,auto=false,t0=0,prevPhi=null,emfS=0;
  const ctl=X.ctl;
  H.seg(ctl,'fTurns','عدد لفات الملف',[['6','قليلة'],['10','متوسطة'],['16','كثيرة']],'10',v=>{loops=+v;makeCoil();});
  H.slider(ctl,{id:'fStr',label:'قوة المغناطيس',min:.3,max:2,step:.1,value:1,unit:'×',on:v=>strength=v}).init();
  H.button(ctl,'fFlip','اقلب المغناطيس',()=>{flip*=-1;mag.rotation.y+=Math.PI;});
  const ab=H.button(ctl,'fAuto','حركة تلقائية',b=>{auto=!auto;b.textContent=auto?'أوقف الحركة':'حركة تلقائية';});
  H.note(ctl,'<b>لاحظ:</b> لا يتولد تيار إلا عندما يتغير المجال داخل الملف. حرّك المغناطيس أسرع أو زد عدد اللفات فيزداد توهج المصباح. وعند الإخراج ينحرف المؤشر بالاتجاه المعاكس.');
  const R=H.reads(X);
  const plane=new T.Plane(new T.Vector3(0,0,1),0),hit=new T.Vector3();let dragging=false,ox=0;const el=S.renderer.domElement;
  el.addEventListener('pointerdown',e=>{if(pick(e,[mN,mS]).length){dragging=true;auto=false;ab.textContent='حركة تلقائية';if(controls)controls.enabled=false;pick(e).ray.intersectPlane(plane,hit);ox=hit.x-mag.position.x;el.setPointerCapture(e.pointerId);}});
  el.addEventListener('pointermove',e=>{if(dragging&&pick(e).ray.intersectPlane(plane,hit))mag.position.x=Math.max(-6.5,Math.min(6.5,hit.x-ox));});
  const up=()=>{dragging=false;if(controls)controls.enabled=true;};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  let tick=0;
  const L=H.loop((dt,t)=>{
    if(auto)mag.position.x=Math.sin(t/650)*5.2;
    const d=mag.position.x/1.4;const phi=flip*strength*loops*Math.sign(1)*1/Math.pow(1+d*d,1.5);
    const emf=prevPhi==null||dt===0?0:-(phi-prevPhi)/dt;prevPhi=phi;
    emfS+= (emf-emfS)*Math.min(1,dt*12);
    const mag01=Math.min(1,Math.abs(emfS)/60);
    glassMat.emissiveIntensity=mag01*2.2;glow.intensity=mag01*3;
    needle.setAttribute('transform',`rotate(${Math.max(-65,Math.min(65,emfS*1.1))} 80 85)`);
    if(++tick%8===0)R.innerHTML=H.rd([['القوة الدافعة المحتثة (نسبية)',(emfS/10).toFixed(2)],['إضاءة المصباح',Math.round(mag01*100)+'%'],['الحالة',Math.abs(emfS)<1.5?'لا يتولد تيار':emfS>0?'تيار محتث باتجاه':'تيار محتث بالاتجاه المعاكس',1]]);
    S.render();
  });
  S.render();return L;
}});

/* ---------- 4. Circuit lab (realistic, electrons flow) ---------- */
labDef({id:'circuit',grade:'3',icon:'Ω',title:'مختبر الدوائر الكهربائية',ch:'الفصل الثالث',desc:'بطارية ومفتاح ومصباحان، توالٍ وتوازٍ، وحركة الإلكترونات',c1:'#2ec795',c2:'#8af0cc',tags:['محاكاة','اضغط المفتاح والمصباح'],wide:true,
init(X,H){
  const {ctx,W,H:Hh,pt,c}=H.canvas(X,900,520,'اضغط على المفتاح لفتحه/غلقه • اضغط على مصباح لتلفه');
  let V=6,R1=6,R2=3,mode='s',closed=true,br=[false,false],off=0;
  const ctl=X.ctl;
  H.slider(ctl,{id:'cV',label:'فولطية البطارية',min:1.5,max:12,step:1.5,value:6,unit:'V',on:v=>V=v}).init();
  H.slider(ctl,{id:'cR1',label:'مقاومة المصباح الأول',min:1,max:20,value:6,unit:'Ω',on:v=>R1=v}).init();
  H.slider(ctl,{id:'cR2',label:'مقاومة المصباح الثاني',min:1,max:20,value:3,unit:'Ω',on:v=>R2=v}).init();
  H.seg(ctl,'cMode','طريقة الربط',[['s','على التوالي'],['p','على التوازي']],'s',v=>mode=v);
  H.button(ctl,'cFix','أصلح المصابيح',()=>br=[false,false]);
  const R=H.reads(X);
  const geo={
    s:{segs:[{p:[[440,460],[110,460],[110,90],[300,90]],k:'I'},{p:[[300,90],[600,90]],k:'I'},{p:[[600,90],[790,90],[790,460],[520,460]],k:'I'}],bulbs:[[300,90],[600,90]],sw:[110,280],am:[790,280]},
    p:{segs:[{p:[[440,460],[110,460],[110,90],[360,90]],k:'I'},{p:[[360,90],[620,90]],k:'I2'},{p:[[360,90],[360,330]],k:'I1'},{p:[[620,90],[620,330]],k:'I2'},{p:[[360,330],[620,330]],k:'I1'},{p:[[620,330],[790,330],[790,460],[520,460]],k:'I'}],bulbs:[[360,210],[620,210]],sw:[110,280],am:[790,400]}
  };
  c.addEventListener('pointerdown',e=>{const p=pt(e),g=geo[mode];
    if(Math.hypot(p.x-g.sw[0],p.y-g.sw[1])<40){closed=!closed;return;}
    g.bulbs.forEach((b,i)=>{if(Math.hypot(p.x-b[0],p.y-b[1])<38)br[i]=!br[i];});});
  function solve(){let I=0,I1=0,I2=0;
    if(!closed)return {I,I1,I2,Req:Infinity};
    if(mode==='s'){const Req=br[0]||br[1]?Infinity:R1+R2;I=isFinite(Req)?V/Req:0;return {I,I1:I,I2:I,Req};}
    I1=br[0]?0:V/R1;I2=br[1]?0:V/R2;I=I1+I2;return {I,I1,I2,Req:I?V/I:Infinity};}
  const segLen=p=>{let L=0;for(let i=1;i<p.length;i++)L+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);return L};
  const at=(p,s)=>{for(let i=1;i<p.length;i++){const l=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);if(s<=l){const t=s/l;return [p[i-1][0]+(p[i][0]-p[i-1][0])*t,p[i-1][1]+(p[i][1]-p[i-1][1])*t]}s-=l}return p[p.length-1]};
  function bulb(x,y,P,broken){
    const g=Math.min(1,P/8);
    if(g>0&&!broken){const rg=ctx.createRadialGradient(x,y-6,4,x,y-6,40+70*g);rg.addColorStop(0,`rgba(255,220,120,${.55*g+.2})`);rg.addColorStop(1,'rgba(255,220,120,0)');ctx.fillStyle=rg;ctx.beginPath();ctx.arc(x,y-6,40+70*g,0,7);ctx.fill();}
    ctx.fillStyle='#8f97ab';ctx.fillRect(x-14,y+14,28,20);ctx.strokeStyle='#6b7388';for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(x-14,y+18+k*4);ctx.lineTo(x+14,y+18+k*4);ctx.stroke();}
    const gg=ctx.createRadialGradient(x-8,y-14,2,x,y-6,30);gg.addColorStop(0,'rgba(255,255,255,.95)');gg.addColorStop(1,broken?'rgba(180,190,210,.6)':`rgba(255,${230-60*g},${150-120*g},${.35+.5*g})`);
    ctx.fillStyle=gg;ctx.strokeStyle='#5a6378';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y-6,24,Math.PI*.78,Math.PI*2.22);ctx.lineTo(x+10,y+14);ctx.lineTo(x-10,y+14);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle=broken?'#5a6378':`rgb(255,${180-80*g},${60})`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-8,y+12);ctx.lineTo(x-6,y-6);for(let k=0;k<4;k++)ctx.lineTo(x-4+k*3,y-12+(k%2)*6);ctx.lineTo(x+6,y-6);ctx.lineTo(x+8,y+12);ctx.stroke();
    if(broken){ctx.strokeStyle='#e5354f';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-16,y-26);ctx.lineTo(x+16,y+6);ctx.moveTo(x+16,y-26);ctx.lineTo(x-16,y+6);ctx.stroke();}
  }
  function meter(x,y,val,max,label,unit){ctx.fillStyle='#fff';ctx.strokeStyle='#38415c';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,34,0,7);ctx.fill();ctx.stroke();
    ctx.strokeStyle='#c3cada';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y+6,24,Math.PI*1.15,Math.PI*1.85);ctx.stroke();
    const a=Math.PI*1.15+Math.PI*.7*Math.min(1,val/max);ctx.strokeStyle='#e5354f';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y+6);ctx.lineTo(x+Math.cos(a)*24,y+6+Math.sin(a)*24);ctx.stroke();
    ctx.fillStyle='#1d2540';ctx.font='700 15px Readex Pro';ctx.textAlign='center';ctx.fillText(label,x,y+24);
    ctx.fillStyle='#fff';ctx.strokeStyle='#38415c';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(x-40,y+38,80,24,8);ctx.fill();ctx.stroke();ctx.fillStyle='#1d2540';ctx.font='600 13px Readex Pro';ctx.fillText(val.toFixed(2)+' '+unit,x,y+55);}
  function draw(dt){
    const g=geo[mode],s=solve();
    ctx.fillStyle='#f3f5fa';ctx.fillRect(0,0,W,Hh);ctx.strokeStyle='#e3e7f0';ctx.lineWidth=1;for(let x=0;x<W;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,Hh);ctx.stroke()}for(let y=0;y<Hh;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
    // wires
    g.segs.forEach(sg=>{ctx.strokeStyle='#b5651d';ctx.lineWidth=9;ctx.lineJoin='round';ctx.beginPath();sg.p.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.strokeStyle='#e39a55';ctx.lineWidth=3;ctx.stroke();});
    // electrons
    off+=(H.RM?0:dt*60);
    g.segs.forEach(sg=>{const I=sg.k==='I'?s.I:sg.k==='I1'?s.I1:s.I2;const L=segLen(sg.p),sp=24,o=(off*I*1.4)%sp;ctx.fillStyle='#2f5bff';for(let d=o;d<L;d+=sp){const [x,y]=at(sg.p,d);ctx.beginPath();ctx.arc(x,y,3.6,0,7);ctx.fill();}});
    // battery
    ctx.save();const bx=440,by=460;const bg=ctx.createLinearGradient(0,by-24,0,by+24);bg.addColorStop(0,'#3b3f4c');bg.addColorStop(.5,'#6b7080');bg.addColorStop(1,'#2a2d38');ctx.fillStyle=bg;ctx.beginPath();ctx.roundRect(bx,by-24,80,48,6);ctx.fill();
    ctx.fillStyle='#e8a33a';ctx.fillRect(bx+56,by-24,24,48);ctx.fillStyle='#c9ccd6';ctx.fillRect(bx+80,by-9,8,18);
    ctx.fillStyle='#fff';ctx.font='700 14px Readex Pro';ctx.textAlign='center';ctx.fillText(V+' V',bx+28,by+5);ctx.fillStyle='#2a2d38';ctx.fillText('+',bx+68,by+5);ctx.fillStyle='#fff';ctx.fillText('−',bx+8,by+5);ctx.restore();
    // switch
    const [sx,sy]=g.sw;ctx.fillStyle='#3a4258';ctx.beginPath();ctx.roundRect(sx-22,sy-46,44,92,10);ctx.fill();ctx.fillStyle='#c9ccd6';ctx.beginPath();ctx.arc(sx,sy+30,6,0,7);ctx.arc(sx,sy-30,6,0,7);ctx.fill();
    ctx.strokeStyle='#e9edf7';ctx.lineWidth=6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(sx,sy+30);ctx.lineTo(closed?sx:sx+30,sy-28);ctx.stroke();ctx.lineCap='butt';
    ctx.fillStyle=closed?'#2ec795':'#e5354f';ctx.font='600 13px Readex Pro';ctx.fillText(closed?'مغلق':'مفتوح',sx,sy+68);
    // bulbs
    g.bulbs.forEach((b,i)=>{ctx.fillStyle='#f3f5fa';ctx.fillRect(b[0]-30,b[1]-34,60,72);const I=i?s.I2:s.I1,Rr=i?R2:R1;bulb(b[0],b[1],I*I*Rr,br[i]);ctx.fillStyle='#38415c';ctx.font='600 13px Readex Pro';ctx.fillText(`R${i?'₂':'₁'} = ${Rr} Ω`,b[0],b[1]+56);});
    meter(g.am[0],g.am[1],s.I,6,'A','A');
    R.innerHTML=H.rd([['المقاومة المكافئة',(isFinite(s.Req)?s.Req.toFixed(2):'∞')+' Ω'],['التيار الكلي',s.I.toFixed(2)+' A'],['تيار المصباح ١ / ٢',s.I1.toFixed(2)+' / '+s.I2.toFixed(2)+' A'],['جهد المصباح ١ / ٢',(s.I1*R1).toFixed(2)+' / '+(s.I2*R2).toFixed(2)+' V'],['قدرة المصباح ١ / ٢',(s.I1*s.I1*R1).toFixed(2)+' / '+(s.I2*s.I2*R2).toFixed(2)+' W']]);
  }
  const L=H.loop(dt=>draw(dt));draw(0);return L;
}});

/* ===================== GRADE 3 — quick interactive tools ===================== */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

labDef({id:'coulomb',grade:'3',icon:'±',title:'قانون كولوم',ch:'الفصل الأول',desc:'غيّر الشحنتين والبعد بينهما ولاحظ القوة',c1:'#5a74ff',c2:'#b18cff',tags:['أداة سريعة'],
init(X,H){
  let q1=2,q2=6,r=3;
  X.stage.classList.add('light');
  X.stage.innerHTML=`<svg viewBox="0 0 520 200" role="img" aria-label="شحنتان والقوة بينهما"><defs><marker id="arC" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#151b2e"/></marker></defs><line x1="20" y1="150" x2="500" y2="150" stroke="#cfd6ea" stroke-dasharray="4 4"/><g class="cL"></g></svg>`;
  const R=H.reads(X);
  const draw=()=>{const F=9e9*Math.abs(q1*q2)*1e-12/((r/100)**2);const x1=260-r*10,x2=260+r*10,col=q=>q>0?'#ff4d7d':q<0?'#2f6bff':'#9aa3bf',rad=q=>10+Math.abs(q)*1.6;
    const rep=q1*q2>0,len=Math.min(90,12+Math.log10(F+1)*28);let a='';
    if(F>0){const d=rep?-1:1;a=`<line x1="${x1+d*(rad(q1)+4)}" y1="90" x2="${x1+d*(rad(q1)+4+len)}" y2="90" stroke="#151b2e" stroke-width="3" marker-end="url(#arC)"/><line x1="${x2-d*(rad(q2)+4)}" y1="90" x2="${x2-d*(rad(q2)+4+len)}" y2="90" stroke="#151b2e" stroke-width="3" marker-end="url(#arC)"/>`;}
    $('.cL',X.stage).innerHTML=`${a}<circle cx="${x1}" cy="90" r="${rad(q1)}" fill="${col(q1)}"/><text x="${x1}" y="96" text-anchor="middle" fill="#fff" font-size="18" font-weight="700">${q1>0?'+':q1<0?'−':'0'}</text><circle cx="${x2}" cy="90" r="${rad(q2)}" fill="${col(q2)}"/><text x="${x2}" y="96" text-anchor="middle" fill="#fff" font-size="18" font-weight="700">${q2>0?'+':q2<0?'−':'0'}</text><line x1="${x1}" y1="150" x2="${x2}" y2="150" stroke="#151b2e"/><text x="260" y="175" text-anchor="middle" font-size="14" fill="#151b2e">r = ${r} cm</text>`;
    R.innerHTML=H.rd([['مقدار القوة F',H.sci(F,3)+' N'],['نوع القوة',F===0?'لا توجد قوة':rep?'تنافر':'تجاذب',1],['القانون','F = k q₁q₂ / r²']]);};
  H.slider(X.ctl,{id:'cq1',label:'الشحنة الأولى q₁',min:-10,max:10,value:2,unit:'μC',on:v=>{q1=v;draw()}}).init();
  H.slider(X.ctl,{id:'cq2',label:'الشحنة الثانية q₂',min:-10,max:10,value:6,unit:'μC',on:v=>{q2=v;draw()}}).init();
  H.slider(X.ctl,{id:'cr',label:'البعد r',min:2,max:20,value:3,unit:'cm',on:v=>{r=v;draw()}}).init();
  H.note(X.ctl,'<b>مثال وزاري:</b> ‎2 μC و 6 μC على بعد 3 cm تعطي 120 N. ضاعف البعد مرتين فتصير القوة ربع قيمتها.');
}});

labDef({id:'scope',grade:'3',icon:'ϟ',title:'الكشاف الكهربائي',ch:'الفصل الأول',desc:'اشحن الكشاف بالتماس أو بالحث وراقب الورقتين',c1:'#5a74ff',c2:'#b18cff',tags:['أداة سريعة'],
init(X,H){
  let s=1,near=false,gnd=false,Q=0;
  X.stage.classList.add('light');
  X.stage.innerHTML=`<svg viewBox="0 0 360 300" role="img" aria-label="كشاف كهربائي"><g class="esc"></g></svg>`;
  const say=t=>log.textContent=t;
  H.seg(X.ctl,'scS','شحنة الساق',[['1','موجبة (زجاج دُلك بالحرير)'],['-1','سالبة (مطاط دُلك بالصوف)']],'1',v=>{s=+v;say('غيّرت شحنة الساق.');draw();});
  X.ctl.insertAdjacentHTML('beforeend',`<div class="seg" role="group" aria-label="الخطوات"><button type="button" data-a="near">قرّب الساق</button><button type="button" data-a="touch">لامِس القرص</button><button type="button" data-a="far">أبعد الساق</button><button type="button" data-a="gnd">وصّل/افصل الأرض</button><button type="button" data-a="reset">ابدأ من جديد</button></div><div class="log" aria-live="polite"></div>`);
  const log=$('.log',X.ctl);
  $$('[data-a]',X.ctl).forEach(b=>b.onclick=()=>{const a=b.dataset.a;
    if(a==='near'){near=true;if(gnd)Q=-2*s;say(gnd?'الساق قريبة والكشاف متصل بالأرض: تتسرب الشحنات الطليقة وتبقى المقيدة على القرص.':'ظهرت على القرص شحنة مخالفة (مقيدة)، وتنافرت المشابهة نحو الورقتين فانفرجتا.');}
    if(a==='touch'){Q+=2*s;near=true;say('بالتماس انتقلت للكشاف شحنة مشابهة لشحنة الساق.');if(gnd){Q=-2*s;say('الكشاف متصل بالأرض فالشحنة تتسرب إليها.');}}
    if(a==='far'){near=false;if(gnd)Q=0;say(Q?'أبعدنا الساق: بقي الكشاف مشحونًا فبقيت الورقتان منفرجتين.':'أبعدنا الساق: الكشاف متعادل فانطبقت الورقتان.');}
    if(a==='gnd'){gnd=!gnd;if(gnd)Q=near?-2*s:0;say(gnd?(near?'وصّلنا الأرض والساق قريبة: افصل الأرض أولًا ثم أبعد الساق لتحصل على الشحن بالحث.':'وصّلنا الأرض: تفرّغ الكشاف.'):(near&&Q?'فصلنا الأرض: إذا أبعدت الساق يبقى الكشاف مشحونًا بشحنة مخالفة لشحنة الساق.':'فصلنا الأرض.'));}
    if(a==='reset'){near=false;gnd=false;Q=0;say('الكشاف متعادل والورقتان منطبقتان.');}
    draw();});
  const sym=(n,x,y,dx)=>{let t='';const c=n>0?'+':'−',col=n>0?'#ff4d7d':'#2f6bff';for(let k=0;k<Math.min(Math.abs(n),4);k++)t+=`<text x="${x+k*dx}" y="${y}" font-size="15" font-weight="700" fill="${col}" text-anchor="middle">${c}</text>`;return t};
  const R=H.reads(X);
  function draw(){const leaves=near?(gnd?0:Q+2*s):(gnd?0:Q),disc=near?-2*s:0,ang=Math.min(Math.abs(leaves),5)*8;
    $('.esc',X.stage).innerHTML=`<rect x="70" y="110" width="220" height="170" rx="14" fill="#f2f5ff" stroke="#b9c4e6" stroke-width="2"/><rect x="172" y="104" width="16" height="14" fill="#c8a46a"/><line x1="180" y1="60" x2="180" y2="200" stroke="#8a93ad" stroke-width="5"/><ellipse cx="180" cy="58" rx="42" ry="9" fill="#c9cfdd" stroke="#8a93ad" stroke-width="2"/>
     <g transform="rotate(${ang} 180 200)"><path d="M180 200 l-5 60 l5 4 z" fill="#f2b400"/></g><g transform="rotate(${-ang} 180 200)"><path d="M180 200 l5 60 l-5 4 z" fill="#f2b400"/></g>${sym(disc,160,50,12)}${sym(leaves,150,235,0)}${sym(leaves,210,235,0)}
     ${near?`<rect x="140" y="10" width="80" height="16" rx="8" fill="${s>0?'#ffb3c6':'#b8c8ff'}" stroke="${s>0?'#ff4d7d':'#2f6bff'}"/>${sym(s*3,160,23,18)}`:''}
     ${gnd?'<path d="M290 200 h40 v40 M318 240 h24 M322 247 h16 M327 254 h6" stroke="#0a9d72" stroke-width="3" fill="none"/><line x1="188" y1="200" x2="290" y2="200" stroke="#0a9d72" stroke-width="2"/>':''}`;
    R.innerHTML=H.rd([['انفراج الورقتين',Math.round(ang*2)+'°'],['شحنة الكشاف',Q>0?'موجبة':Q<0?'سالبة':'متعادل',1],['الأرض',gnd?'متصل':'مفصول',1]]);}
  say('جرّب: قرّب الساق ← وصّل الأرض ← افصل الأرض ← أبعد الساق (الشحن بالحث).');draw();
}});

labDef({id:'bill',grade:'3',icon:'kWh',title:'حاسبة فاتورة الكهرباء',ch:'الفصل الخامس',desc:'احسب الطاقة المستهلكة وكلفتها بالدينار',c1:'#ff9a3c',c2:'#ffc65c',tags:['أداة سريعة'],wide:true,
init(X,H){
  const rows=[['مكيف هواء',2420,8],['مدفأة زيتية',1600,4],['مكواة',1000,0.5],['غسالة',500,1],['ثلاجة',200,24],['مصباح LED',10,6]];
  const inp='font-family:var(--ui);padding:6px 8px;border:1px solid var(--line);border-radius:8px;max-width:140px;background:var(--bg2);color:var(--ink)';
  X.ctl.innerHTML=`<div style="display:flex;gap:14px;flex-wrap:wrap"><label for="bp">سعر الكيلوواط·ساعة (دينار)<input id="bp" type="number" min="0" value="100" style="${inp}"></label><label for="bd">عدد الأيام<input id="bd" type="number" min="1" max="31" value="30" style="${inp}"></label></div>`;
  X.stage.classList.add('dark');X.stage.style.padding='12px';
  X.stage.innerHTML=`<div style="overflow-x:auto"><table class="bill"><thead><tr><th>الجهاز</th><th>القدرة (W)</th><th>ساعات/يوم</th><th>الطاقة (kWh)</th><th>الكلفة (دينار)</th></tr></thead><tbody></tbody><tfoot><tr><td colspan="3">المجموع</td><td class="numx" id="bkwh"></td><td class="numx" id="bcost"></td></tr></tfoot></table></div>`;
  $('tbody',X.stage).innerHTML=rows.map((r,i)=>`<tr><td>${r[0]}</td><td><input id="bw${i}" type="number" min="0" value="${r[1]}" aria-label="قدرة ${r[0]}"></td><td><input id="bh${i}" type="number" min="0" max="24" step="0.5" value="${r[2]}" aria-label="ساعات ${r[0]}"></td><td class="numx" id="bk${i}"></td><td class="numx" id="bc${i}"></td></tr>`).join('');
  const calc=()=>{const p=+$('#bp').value||0,d=+$('#bd').value||0;let K=0,C=0;rows.forEach((r,i)=>{const k=(+$('#bw'+i).value||0)/1000*(+$('#bh'+i).value||0)*d;K+=k;C+=k*p;$('#bk'+i).textContent=k.toFixed(1);$('#bc'+i).textContent=Math.round(k*p).toLocaleString('en');});$('#bkwh').textContent=K.toFixed(1);$('#bcost').textContent=Math.round(C).toLocaleString('en');};
  X.el.addEventListener('input',calc);calc();
  X.stage.insertAdjacentHTML('afterend',`<p class="note"><b>القانون:</b> الكلفة = القدرة (kW) × الزمن (h) × سعر الوحدة. القيم أعلاه أمثلة، غيّرها حسب أجهزة بيتك.</p>`);
}});

labDef({id:'oersted',grade:'3',icon:'⊙',title:'تجربة أورستد',ch:'الفصل السادس',desc:'مرّر تيارًا في السلك وراقب إبرة البوصلة',c1:'#8e6bff',c2:'#c3adff',tags:['أداة سريعة'],
init(X,H){
  let I=3;X.stage.classList.add('light');
  X.stage.innerHTML=`<svg viewBox="0 0 420 220" role="img" aria-label="سلك وبوصلة"><g class="oe"></g></svg>`;
  const R=H.reads(X);
  const draw=()=>{const ang=Math.sign(I)*Math.atan(Math.abs(I)/1.5)*180/Math.PI;let rings='';if(I!==0)for(let k=1;k<=3;k++)rings+=`<circle cx="320" cy="110" r="${k*22}" fill="none" stroke="#8e6bff" stroke-opacity="${Math.min(1,Math.abs(I)/5)}" stroke-width="2"/>`;
    $('.oe',X.stage).innerHTML=`<line x1="20" y1="70" x2="220" y2="70" stroke="#b46b2a" stroke-width="7" stroke-linecap="round"/>${I!==0?`<path d="M${I>0?'40 55 l20 0 l-6 -5 m6 5 l-6 5':'200 55 l-20 0 l6 -5 m-6 5 l6 5'}" stroke="#d6164b" stroke-width="2.5" fill="none"/><text x="120" y="50" text-anchor="middle" font-size="13" fill="#d6164b">I = ${Math.abs(I)} A</text>`:''}
     <circle cx="120" cy="150" r="48" fill="#fff" stroke="#151b2e" stroke-width="2"/><text x="120" y="112" text-anchor="middle" font-size="12" fill="#5f6784">N</text><g transform="rotate(${ang} 120 150)"><path d="M120 108 l8 42 h-16z" fill="#ff4d7d"/><path d="M120 192 l8 -42 h-16z" fill="#2f6bff"/></g><circle cx="120" cy="150" r="4" fill="#151b2e"/>
     ${rings}<circle cx="320" cy="110" r="9" fill="#fff" stroke="#151b2e" stroke-width="2"/><text x="320" y="115" text-anchor="middle" font-size="14" font-weight="700" fill="#151b2e">${I>0?'•':I<0?'×':''}</text><text x="320" y="200" text-anchor="middle" font-size="12" fill="#5f6784">منظر علوي للمجال حول السلك</text>`;
    R.innerHTML=H.rd([['انحراف الإبرة',Math.round(ang)+'°'],['اتجاه المجال (منظر علوي)',I>0?'عكس عقارب الساعة':I<0?'مع عقارب الساعة':'لا يوجد مجال',1]]);};
  H.slider(X.ctl,{id:'oi',label:'التيار في السلك (السالب = اتجاه معاكس)',min:-6,max:6,value:3,unit:'A',on:v=>{I=v;draw()}}).init();
  H.note(X.ctl,'<b>الاستنتاج:</b> التيار يولّد حول السلك مجالًا مغناطيسيًا، وعكس التيار يعكس انحراف الإبرة. حدّد الاتجاه بقاعدة الكف اليمنى.');
}});

labDef({id:'trans',grade:'3',icon:'⇅',title:'المحوّلة الكهربائية',ch:'الفصل السابع',desc:'غيّر عدد اللفات والفولطية، وجرّب التيار المستمر',c1:'#3e8bff',c2:'#7fd0ff',tags:['أداة سريعة'],
init(X,H){
  let V1=220,N1=550,N2=50,I1=1,ac=true;X.stage.classList.add('light');
  X.stage.innerHTML=`<svg viewBox="0 0 420 200" role="img" aria-label="محولة"><g class="tr"></g></svg>`;
  const R=H.reads(X);
  const wave=(x,amp,col)=>{let p=`M${x} 100`;for(let k=0;k<=60;k++)p+=` L${x+k} ${100-amp*Math.sin(k/60*4*Math.PI)}`;return `<path d="${p}" fill="none" stroke="${col}" stroke-width="2.5"/>`};
  function draw(){const k=N2/N1,V2=ac?V1*k:0,I2=ac?I1/k:0;let w1='',w2='';
    for(let i=0;i<Math.min(12,Math.round(N1/120)+2);i++)w1+=`<line x1="118" x2="160" y1="${42+i*10}" y2="${42+i*10}" stroke="#ff4d7d" stroke-width="3"/>`;
    for(let i=0;i<Math.min(14,Math.round(N2/150)+2);i++)w2+=`<line x1="260" x2="302" y1="${38+i*9}" y2="${38+i*9}" stroke="#0ea5bd" stroke-width="3"/>`;
    $('.tr',X.stage).innerHTML=`<path d="M140 30H280V170H140Z M160 50H260V150H160Z" fill="#d9deeb" fill-rule="evenodd" stroke="#8a93ad"/>${w1}${w2}${ac?wave(40,Math.min(40,V1/6),'#ff4d7d'):`<line x1="40" y1="${100-Math.min(40,V1/6)}" x2="100" y2="${100-Math.min(40,V1/6)}" stroke="#ff4d7d" stroke-width="2.5"/>`}${wave(320,Math.min(45,V2/6),'#0ea5bd')}<text x="70" y="160" text-anchor="middle" font-size="13" fill="#151b2e">V₁ = ${V1} V</text><text x="350" y="160" text-anchor="middle" font-size="13" fill="#151b2e">V₂ = ${+V2.toFixed(1)} V</text>`;
    R.innerHTML=H.rd([['نسبة التحويل N₂/N₁',+k.toFixed(3)],['فولطية الثانوي V₂',+V2.toFixed(2)+' V'],['تيار الثانوي I₂',+I2.toFixed(3)+' A'],['نوع المحوّلة',!ac?'لا تعمل على DC':k>1?'رافعة للفولطية':k<1?'خافضة للفولطية':'نسبة التحويل = 1',1]]);}
  H.slider(X.ctl,{id:'tv',label:'فولطية الابتدائي V₁',min:10,max:240,value:220,unit:'V',on:v=>{V1=v;draw()}}).init();
  H.slider(X.ctl,{id:'tn1',label:'لفات الابتدائي N₁',min:50,max:2000,step:50,value:550,unit:'turn',on:v=>{N1=v;draw()}}).init();
  H.slider(X.ctl,{id:'tn2',label:'لفات الثانوي N₂',min:25,max:4000,step:25,value:50,unit:'turn',on:v=>{N2=v;draw()}}).init();
  H.slider(X.ctl,{id:'ti',label:'تيار الابتدائي I₁',min:0.1,max:10,step:0.1,value:1,unit:'A',on:v=>{I1=v;draw()}}).init();
  H.seg(X.ctl,'tac','نوع التيار في الابتدائي',[['ac','متناوب AC'],['dc','مستمر DC']],'ac',v=>{ac=v==='ac';draw()});
  H.note(X.ctl,'<b>مثال وزاري:</b> ‎220 V و N₁ = 550 والحمل على 20 V، فالثانوي فيه 50 لفة والمحوّلة خافضة.');
}});

labDef({id:'solar',grade:'3',icon:'☀',title:'كفاءة الخلية الشمسية',ch:'الفصل الثامن',desc:'احسب القدرة الداخلة والخارجة وكفاءة الخلية',c1:'#2ec795',c2:'#b6e35a',tags:['أداة سريعة'],
init(X,H){
  let E=1400,a=.2,b=.25,I=.14,V=10;X.stage.classList.add('light');
  X.stage.innerHTML=`<svg viewBox="0 0 420 200" role="img" aria-label="خلية شمسية"><g class="so"></g></svg>`;
  const R=H.reads(X);
  function draw(){const A=a*b,Pin=E*A,Pout=I*V,eta=Pin?Pout/Pin*100:0;let rays='';for(let k=0;k<Math.round(E/200);k++)rays+=`<line x1="${70+k*14}" y1="40" x2="${150+k*14}" y2="120" stroke="#f2b400" stroke-width="2" stroke-opacity=".8"/>`;
    $('.so',X.stage).innerHTML=`<circle cx="50" cy="35" r="${10+E/100}" fill="#ffd166"/>${rays}<g transform="translate(150 110) skewX(-20)"><rect width="${60+a*400}" height="${20+b*200}" fill="#1d4ed8" stroke="#0ea5bd" stroke-width="2"/></g><circle cx="360" cy="80" r="${8+Math.min(20,Pout*6)}" fill="#ffd166" opacity="${Math.min(.9,Pout/2)}"/><circle cx="360" cy="80" r="12" fill="#fff6c9" stroke="#151b2e" stroke-width="2"/>`;
    R.innerHTML=H.rd([['المساحة A',+A.toFixed(4)+' m²'],['القدرة الداخلة E×A',+Pin.toFixed(2)+' W'],['القدرة الخارجة I×V',+Pout.toFixed(2)+' W'],['الكفاءة η',+eta.toFixed(2)+' %']]);}
  H.slider(X.ctl,{id:'se',label:'شدة الإشعاع الشمسي E',min:0,max:1400,step:50,value:1400,unit:'W/m²',on:v=>{E=v;draw()}}).init();
  H.slider(X.ctl,{id:'sa',label:'طول الخلية',min:.05,max:.5,step:.05,value:.2,unit:'m',on:v=>{a=v;draw()}}).init();
  H.slider(X.ctl,{id:'sb',label:'عرض الخلية',min:.05,max:.5,step:.05,value:.25,unit:'m',on:v=>{b=v;draw()}}).init();
  H.slider(X.ctl,{id:'si',label:'التيار المتولد I',min:0,max:1,step:.02,value:.14,unit:'A',on:v=>{I=v;draw()}}).init();
  H.slider(X.ctl,{id:'sv',label:'فرق الجهد V',min:0,max:20,step:.5,value:10,unit:'V',on:v=>{V=v;draw()}}).init();
  H.note(X.ctl,'<b>مثال وزاري ٢٠١٩:</b> خلية ‎0.2×0.25 m وإشعاع 1400 W/m² وتيار 0.14 A وجهد 10 V، كفاءتها 2%.');
}});
})();

/* ===================== GRADE 1 — simulations ===================== */

/* ---------- 1. Density & buoyancy ---------- */
labDef({id:'density',grade:'1',icon:'ρ',title:'الكثافة والطفو',ch:'الأول المتوسط',desc:'اختر جسمًا وسائلًا ولاحظ هل يطفو أم يغطس',c1:'#2ec795',c2:'#8af0cc',tags:['محاكاة','اسحب الجسم'],
init(X,H){
  const {ctx,W,H:Hh,pt,c}=H.canvas(X,900,520,'اسحب المكعب وأسقطه في السائل');
  const MATS={wood:['خشب',600,'#b07a43'],cork:['فلين',250,'#d8b57a'],ice:['ثلج',920,'#cfeefc'],al:['ألمنيوم',2700,'#b8c0cc'],iron:['حديد',7870,'#5d6474'],gold:['ذهب',19300,'#e7b938']};
  const LIQ={water:['ماء عذب',1000,'rgba(64,156,255,.55)'],salt:['ماء مالح',1030,'rgba(40,140,200,.6)'],oil:['زيت',920,'rgba(230,190,60,.55)'],hg:['زئبق',13600,'rgba(170,175,190,.85)']};
  let mat='wood',liq='water',side=10;const TANK={x:330,y:140,w:460,h:330};const base=TANK.y+TANK.h-150;const SC=10; // px per cm
  let b={x:150,y:260,vy:0,drag:false,inLiquid:false};
  const ctl=X.ctl;
  ctl.insertAdjacentHTML('beforeend',`<label for="dMat">الجسم<select id="dMat">${Object.entries(MATS).map(([k,v])=>`<option value="${k}">${v[0]} (${v[1]} kg/m³)</option>`).join('')}</select></label><label for="dLiq">السائل<select id="dLiq">${Object.entries(LIQ).map(([k,v])=>`<option value="${k}">${v[0]} (${v[1]} kg/m³)</option>`).join('')}</select></label>`);
  ctl.querySelector('#dMat').onchange=e=>{mat=e.target.value;b.vy=0;};ctl.querySelector('#dLiq').onchange=e=>{liq=e.target.value;b.vy=0;};
  H.slider(ctl,{id:'dSide',label:'طول ضلع المكعب',min:5,max:14,value:10,unit:'cm',on:v=>{side=v}}).init();
  H.button(ctl,'dReset','أخرج الجسم',()=>{b={x:150,y:260,vy:0,drag:false};});
  H.note(ctl,'<b>القاعدة:</b> إذا كانت كثافة الجسم أقل من كثافة السائل يطفو، وإذا كانت أكبر يغطس. الكثافة = الكتلة ÷ الحجم.');
  const R=H.reads(X);
  const s=()=>side*SC;
  c.addEventListener('pointerdown',e=>{const p=pt(e);if(Math.abs(p.x-b.x)<s()/2&&Math.abs(p.y-b.y)<s()/2){b.drag={dx:p.x-b.x,dy:p.y-b.y};c.setPointerCapture(e.pointerId);}});
  c.addEventListener('pointermove',e=>{if(!b.drag)return;const p=pt(e);b.x=Math.max(s()/2,Math.min(W-s()/2,p.x-b.drag.dx));b.y=Math.max(s()/2,Math.min(Hh-40-s()/2,p.y-b.drag.dy));b.vy=0;});
  const up=()=>{b.drag=false};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
  let level=base,sub=0;
  function step(dt){
    const S=s(),inTank=b.x>TANK.x+S/2-4&&b.x<TANK.x+TANK.w-S/2+4;
    const rhoB=MATS[mat][1],rhoL=LIQ[liq][1];
    const top=b.y-S/2,bot=b.y+S/2;
    sub=inTank?Math.max(0,Math.min(1,(bot-level)/S)):0;
    level=base-(sub*S*S)/TANK.w*1.0;
    if(b.drag)return;
    const floor=inTank?TANK.y+TANK.h-6:Hh-40;
    const a=9.8*(1-(rhoL/rhoB)*sub);let damp=inTank&&sub>0?0.9:0.995;
    b.vy=(b.vy+a*dt*60)*damp;b.y+=b.vy*dt*4;
    if(b.y+S/2>floor){b.y=floor-S/2;b.vy=0;}
    if(!inTank&&b.y+S/2>=Hh-40){b.y=Hh-40-S/2;}
  }
  function draw(){
    const S=s();ctx.fillStyle='#eef2fb';ctx.fillRect(0,0,W,Hh);ctx.fillStyle='#c9cfdf';ctx.fillRect(0,Hh-40,W,40);
    // tank
    ctx.fillStyle=LIQ[liq][2];ctx.fillRect(TANK.x,level,TANK.w,TANK.y+TANK.h-level);
    ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(TANK.x,level);ctx.lineTo(TANK.x+TANK.w,level);ctx.stroke();
    // block
    const col=MATS[mat][2];const g=ctx.createLinearGradient(b.x-S/2,b.y-S/2,b.x+S/2,b.y+S/2);g.addColorStop(0,'#ffffff');g.addColorStop(.18,col);g.addColorStop(1,col);
    ctx.fillStyle=g;ctx.strokeStyle='rgba(20,30,60,.45)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(b.x-S/2,b.y-S/2,S,S,4);ctx.fill();ctx.stroke();
    if(mat==='wood'){ctx.strokeStyle='rgba(90,50,20,.35)';for(let k=1;k<4;k++){ctx.beginPath();ctx.moveTo(b.x-S/2+3,b.y-S/2+k*S/4);ctx.bezierCurveTo(b.x,b.y-S/2+k*S/4-6,b.x,b.y-S/2+k*S/4+6,b.x+S/2-3,b.y-S/2+k*S/4);ctx.stroke();}}
    // liquid over block (overlay so submerged part looks tinted)
    ctx.fillStyle=LIQ[liq][2].replace(/[\d.]+\)$/,'0.35)');const ty=Math.max(level,b.y-S/2);if(sub>0)ctx.fillRect(b.x-S/2,ty,S,b.y+S/2-ty);
    // glass
    ctx.strokeStyle='#7e8aa8';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(TANK.x,TANK.y-20);ctx.lineTo(TANK.x,TANK.y+TANK.h);ctx.lineTo(TANK.x+TANK.w,TANK.y+TANK.h);ctx.lineTo(TANK.x+TANK.w,TANK.y-20);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(TANK.x+8,TANK.y,10,TANK.h-6);
    ctx.fillStyle='#2a3149';ctx.font='600 15px Readex Pro';ctx.textAlign='center';ctx.fillText(LIQ[liq][0],TANK.x+TANK.w/2,TANK.y+TANK.h+28);
    const V=(side/100)**3,m=MATS[mat][1]*V,rhoB=MATS[mat][1],rhoL=LIQ[liq][1];
    R.innerHTML=H.rd([['الكتلة m',m.toFixed(3)+' kg'],['الحجم V',(V*1e6).toFixed(0)+' cm³'],['الكثافة ρ = m/V',rhoB+' kg/m³'],['النتيجة',rhoB<rhoL?'يطفو':'يغطس',1],['الجزء المغمور',Math.round(sub*100)+'%']]);
  }
  const L=H.loop(dt=>{step(dt);draw();});draw();return L;
}});

/* ---------- 2. Pendulum 3D ---------- */
labDef({id:'pendulum3d',grade:'1',icon:'⟳',title:'البندول البسيط 3D',ch:'الأول المتوسط',desc:'غيّر الطول والجاذبية وقِس الزمن الدوري',c1:'#3e8bff',c2:'#7fd0ff',tags:['3D','اسحب الثقل'],
init(X,H){
  const S=H.three(X,16/10,'اسحب الكرة جانبًا واتركها • دوّر المشهد');if(!S)return;
  const {T,scene,cam,controls,pick}=S;
  cam.position.set(0,1.2,7.5);if(controls){controls.target.set(0,1.2,0);controls.minDistance=4;controls.maxDistance=14;}
  const floor=new T.Mesh(new T.PlaneGeometry(20,12),new T.MeshStandardMaterial({color:0x1a2340,roughness:.95}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.6;scene.add(floor);
  const metal=new T.MeshStandardMaterial({color:0x9aa3bf,metalness:.75,roughness:.3});
  const post=new T.Mesh(new T.CylinderGeometry(.06,.06,5.2,16),metal);post.position.set(-2.4,1,0);scene.add(post);
  const arm=new T.Mesh(new T.CylinderGeometry(.05,.05,2.5,16),metal);arm.rotation.z=Math.PI/2;arm.position.set(-1.15,3.55,0);scene.add(arm);
  const baseP=new T.Mesh(new T.BoxGeometry(1.6,.15,1.2),metal);baseP.position.set(-2.4,-1.55,0);scene.add(baseP);
  const pivot=new T.Vector3(0,3.55,0);
  const strGeo=new T.BufferGeometry().setFromPoints([pivot.clone(),pivot.clone()]);const string=new T.Line(strGeo,new T.LineBasicMaterial({color:0xe9edf7}));scene.add(string);
  const bob=new T.Mesh(new T.SphereGeometry(.28,32,24),new T.MeshStandardMaterial({color:0xff6b92,metalness:.35,roughness:.25}));scene.add(bob);
  const trailN=90,trailPts=new Float32Array(trailN*3);const trailG=new T.BufferGeometry();trailG.setAttribute('position',new T.BufferAttribute(trailPts,3));
  const trail=new T.Line(trailG,new T.LineBasicMaterial({color:0x3ee0f0,transparent:true,opacity:.5}));scene.add(trail);
  let L=1,g=9.8,th=0.35,om=0,damp=false,drag=false,lastCross=null,periods=[],prevTh=th,tsim=0;const SC=2.2;
  const ctl=X.ctl;
  H.slider(ctl,{id:'pL',label:'طول الخيط L',min:.3,max:2,step:.05,value:1,unit:'m',on:v=>{L=v;periods=[];lastCross=null;}}).init();
  H.seg(ctl,'pG','مكان التجربة',[['9.8','الأرض'],['1.6','القمر'],['3.7','المريخ'],['24.8','المشتري']],'9.8',v=>{g=+v;periods=[];lastCross=null;});
  H.slider(ctl,{id:'pM',label:'كتلة الثقل (لا تؤثر على الزمن الدوري!)',min:.1,max:2,step:.1,value:.5,unit:'kg',on:v=>{bob.scale.setScalar(.7+v*.35);}}).init();
  H.seg(ctl,'pD','الاحتكاك مع الهواء',[['0','بدون'],['1','موجود']],'0',v=>damp=v==='1');
  H.note(ctl,'<b>القانون:</b> الزمن الدوري T = 2π√(L/g). كلما زاد طول الخيط زاد الزمن الدوري، والكتلة لا تؤثر عليه.');
  const R=H.reads(X);
  const plane=new T.Plane(new T.Vector3(0,0,1),0),hit=new T.Vector3();const el=S.renderer.domElement;
  el.addEventListener('pointerdown',e=>{if(pick(e,[bob]).length){drag=true;if(controls)controls.enabled=false;el.setPointerCapture(e.pointerId);}});
  el.addEventListener('pointermove',e=>{if(!drag)return;if(pick(e).ray.intersectPlane(plane,hit)){const dx=hit.x-pivot.x,dy=pivot.y-hit.y;th=Math.max(-1.3,Math.min(1.3,Math.atan2(dx,Math.max(.05,dy))));om=0;periods=[];lastCross=null;}});
  const up=()=>{drag=false;if(controls)controls.enabled=true;};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  let tick=0;
  const loop=H.loop(dt=>{
    if(!drag){const n=8,h=dt/n;for(let k=0;k<n;k++){const a=-(g/L)*Math.sin(th)-(damp?.35*om:0);om+=a*h;th+=om*h;tsim+=h;
      if(prevTh<0&&th>=0){if(lastCross!=null){periods.push(tsim-lastCross);if(periods.length>5)periods.shift();}lastCross=tsim;}prevTh=th;}}
    const len=L*SC,pos=new T.Vector3(pivot.x+len*Math.sin(th),pivot.y-len*Math.cos(th),0);
    bob.position.copy(pos);strGeo.setFromPoints([pivot,pos]);
    trailPts.copyWithin(3,0,(trailN-1)*3);trailPts[0]=pos.x;trailPts[1]=pos.y;trailPts[2]=pos.z;trailG.attributes.position.needsUpdate=true;
    if(++tick%10===0){const Tm=periods.length?periods.reduce((a,b)=>a+b)/periods.length:null;
      R.innerHTML=H.rd([['الزمن الدوري المقيس',Tm?Tm.toFixed(2)+' s':'…'],['الزمن الدوري النظري',(2*Math.PI*Math.sqrt(L/g)).toFixed(2)+' s'],['زاوية الإزاحة',Math.round(th*180/Math.PI)+'°']]);}
    S.render();
  });
  S.render();return loop;
}});

/* ---------- 3. Lever / see-saw ---------- */
labDef({id:'lever',grade:'1',icon:'⚖',title:'الرافعة والتوازن',ch:'الأول المتوسط',desc:'ضع الأثقال على الرافعة وحقق التوازن',c1:'#ffb020',c2:'#ffd27a',tags:['محاكاة','اسحب الأثقال'],
init(X,H){
  const {ctx,W,H:Hh,pt,c}=H.canvas(X,900,500,'اسحب الأثقال من الأسفل وضعها على الرافعة');
  const F={x:450,y:300},U=62;let ang=0;
  const masses=[{m:1,x:120,y:440,pos:null},{m:2,x:220,y:440,pos:null},{m:2,x:330,y:440,pos:null},{m:5,x:600,y:440,pos:null},{m:1,x:720,y:440,pos:null},{m:5,x:810,y:440,pos:null}];
  const home=masses.map(o=>({x:o.x,y:o.y}));
  let drag=null;
  const size=m=>26+m*7;
  const plankPt=d=>({x:F.x+d*U*Math.cos(ang),y:F.y-14+d*U*Math.sin(ang)});
  const torque=()=>masses.reduce((t,o)=>o.pos==null?t:t+o.m*o.pos,0);
  c.addEventListener('pointerdown',e=>{const p=pt(e);for(let i=masses.length-1;i>=0;i--){const o=masses[i],s=size(o.m);let cx=o.x,cy=o.y;if(o.pos!=null){const q=plankPt(o.pos);cx=q.x;cy=q.y-s/2;}if(Math.abs(p.x-cx)<s/2&&Math.abs(p.y-cy)<s/2){drag=o;o.pos=null;o.x=p.x;o.y=p.y;c.setPointerCapture(e.pointerId);break;}}});
  c.addEventListener('pointermove',e=>{if(!drag)return;const p=pt(e);drag.x=p.x;drag.y=p.y;});
  c.addEventListener('pointerup',()=>{if(!drag)return;const d=Math.round((drag.x-F.x)/U);if(Math.abs(drag.y-F.y)<110&&Math.abs(d)<=5&&d!==0&&!masses.some(o=>o!==drag&&o.pos===d)){drag.pos=d;}else{const i=masses.indexOf(drag);drag.x=home[i].x;drag.y=home[i].y;}drag=null;});
  H.button(X.ctl,'lClear','أنزل كل الأثقال',()=>masses.forEach((o,i)=>{o.pos=null;o.x=home[i].x;o.y=home[i].y;}));
  H.note(X.ctl,'<b>شرط التوازن:</b> الثقل × ذراعه في جهة = الثقل × ذراعه في الجهة الأخرى. جرّب ثقل 2 kg على بعد 5 مقابل 5 kg على بعد 2.');
  const R=H.reads(X);
  function draw(dt){
    const tq=torque(),target=Math.max(-0.2,Math.min(0.2,tq*0.02));ang+=(target-ang)*Math.min(1,dt*3);
    ctx.fillStyle='#eef2fb';ctx.fillRect(0,0,W,Hh);ctx.fillStyle='#c9cfdf';ctx.fillRect(0,Hh-40,W,40);
    // fulcrum
    ctx.fillStyle='#5d6474';ctx.beginPath();ctx.moveTo(F.x,F.y);ctx.lineTo(F.x-50,Hh-40);ctx.lineTo(F.x+50,Hh-40);ctx.closePath();ctx.fill();
    // plank
    ctx.save();ctx.translate(F.x,F.y-8);ctx.rotate(ang);const pg=ctx.createLinearGradient(0,-12,0,12);pg.addColorStop(0,'#d9a066');pg.addColorStop(1,'#a8703a');ctx.fillStyle=pg;ctx.fillRect(-5.6*U,-12,11.2*U,20);
    ctx.fillStyle='#2a3149';ctx.font='600 13px Readex Pro';ctx.textAlign='center';for(let d=-5;d<=5;d++){ctx.fillRect(d*U-1,-12,2,8);if(d)ctx.fillText(Math.abs(d),d*U,26);}ctx.restore();
    masses.forEach(o=>{const s=size(o.m);let x=o.x,y=o.y;if(o.pos!=null&&o!==drag){const q=plankPt(o.pos);x=q.x;y=q.y-s/2-6;}
      const gg=ctx.createLinearGradient(x-s/2,y-s/2,x+s/2,y+s/2);gg.addColorStop(0,'#9aa3bf');gg.addColorStop(1,'#4b5470');ctx.fillStyle=gg;ctx.beginPath();ctx.roundRect(x-s/2,y-s/2,s,s,6);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='700 '+(12+o.m)+'px Readex Pro';ctx.textAlign='center';ctx.fillText(o.m+' kg',x,y+5);});
    const left=masses.filter(o=>o.pos<0).map(o=>`${o.m}×${-o.pos}`).join(' + ')||'0',right=masses.filter(o=>o.pos>0).map(o=>`${o.m}×${o.pos}`).join(' + ')||'0';
    const lt=masses.filter(o=>o.pos<0).reduce((a,o)=>a-o.m*o.pos,0),rt=masses.filter(o=>o.pos>0).reduce((a,o)=>a+o.m*o.pos,0);
    R.innerHTML=H.rd([['العزم في الجهة اليسرى',`${left} = ${lt}`],['العزم في الجهة اليمنى',`${right} = ${rt}`],['الحالة',lt===rt?(lt?'متوازنة ✓':'فارغة'):(lt>rt?'تميل لليسار':'تميل لليمين'),1]]);
  }
  const L=H.loop(dt=>draw(dt));draw(0);return L;
}});

/* ---------- 4. Motion: distance–time ---------- */
labDef({id:'motion',grade:'1',icon:'→',title:'الحركة: المسافة والزمن والسرعة',ch:'الأول المتوسط',desc:'شغّل السيارة وارسم منحني المسافة–الزمن',c1:'#ff6b92',c2:'#ffa3bd',tags:['محاكاة'],wide:true,
init(X,H){
  const {ctx,W,H:Hh}=H.canvas(X,900,460);
  let v=10,a=0,mode='u',run=false,t=0,x=0,vel=10,data=[];
  const ctl=X.ctl;
  let pb=null;H.seg(ctl,'mvMode','نوع الحركة',[['u','سرعة منتظمة'],['a','حركة متسارعة']],'u',v2=>{mode=v2;reset();});
  H.slider(ctl,{id:'mvV',label:'السرعة الابتدائية',min:0,max:30,value:10,unit:'m/s',on:x2=>{v=x2;if(!run&&pb)reset();}}).init();
  H.slider(ctl,{id:'mvA',label:'التعجيل (للحركة المتسارعة)',min:0,max:4,step:.5,value:2,unit:'m/s²',on:x2=>{a=x2;}}).init();
  pb=H.button(ctl,'mvGo','ابدأ',b=>{run=!run;b.textContent=run?'إيقاف':'استمر';});
  H.button(ctl,'mvR','إعادة',()=>{reset();});
  H.note(ctl,'<b>لاحظ:</b> في السرعة المنتظمة يكون المنحني خطًا مستقيمًا، وميله يساوي السرعة: السرعة = المسافة ÷ الزمن.');
  const R=H.reads(X);
  function reset(){run=false;if(pb)pb.textContent='ابدأ';t=0;x=0;vel=v;data=[[0,0]];}
  reset();
  function draw(dt){
    if(run&&t<10){t+=dt;const acc=mode==='a'?a:0;vel+=acc*dt;x+=vel*dt;data.push([t,x]);if(t>=10){run=false;pb.textContent='انتهى';}}
    ctx.fillStyle='#eef2fb';ctx.fillRect(0,0,W,Hh);
    // road
    ctx.fillStyle='#3a4258';ctx.fillRect(0,110,W,60);ctx.strokeStyle='#ffd27a';ctx.setLineDash([20,16]);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,140);ctx.lineTo(W,140);ctx.stroke();ctx.setLineDash([]);
    const maxX=Math.max(100,(v+(mode==='a'?a*10:0))*10);const px=40+(x/maxX)*(W-120);
    ctx.fillStyle='#2a3149';ctx.font='600 12px Readex Pro';ctx.textAlign='center';for(let k=0;k<=5;k++){const xx=40+k*(W-120)/5;ctx.fillRect(xx,170,2,8);ctx.fillText(Math.round(maxX*k/5)+' m',xx,192);}
    // car
    ctx.save();ctx.translate(px,118);ctx.fillStyle='#ff4d7d';ctx.beginPath();ctx.roundRect(-10,8,80,26,8);ctx.fill();ctx.fillStyle='#ff7ea0';ctx.beginPath();ctx.roundRect(8,-6,44,20,8);ctx.fill();ctx.fillStyle='#bfe3ff';ctx.fillRect(14,-2,14,12);ctx.fillRect(32,-2,14,12);
    ctx.fillStyle='#151b2e';ctx.beginPath();ctx.arc(8,36,9,0,7);ctx.arc(52,36,9,0,7);ctx.fill();ctx.restore();
    // graph
    const gx=70,gy=220,gw=W-110,gh=200,maxY=Math.max(50,maxX);
    ctx.strokeStyle='#2a3149';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx,gy+gh);ctx.lineTo(gx+gw,gy+gh);ctx.stroke();
    ctx.strokeStyle='#d5dbe8';ctx.lineWidth=1;for(let k=1;k<=5;k++){ctx.beginPath();ctx.moveTo(gx,gy+gh-k*gh/5);ctx.lineTo(gx+gw,gy+gh-k*gh/5);ctx.stroke();}
    ctx.fillStyle='#2a3149';ctx.font='600 12px Readex Pro';ctx.textAlign='center';for(let k=0;k<=10;k+=2)ctx.fillText(k+' s',gx+k*gw/10,gy+gh+18);ctx.textAlign='right';for(let k=0;k<=5;k++)ctx.fillText(Math.round(maxY*k/5),gx-6,gy+gh-k*gh/5+4);
    ctx.save();ctx.translate(18,gy+gh/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';H.rtl(ctx,'المسافة (m)',0,0);ctx.restore();ctx.textAlign='center';H.rtl(ctx,'الزمن (s)',gx+gw/2,gy+gh+36);
    ctx.strokeStyle='#ff4d7d';ctx.lineWidth=3;ctx.beginPath();data.forEach(([tt,xx],i)=>{const X2=gx+tt/10*gw,Y2=gy+gh-Math.min(1,xx/maxY)*gh;i?ctx.lineTo(X2,Y2):ctx.moveTo(X2,Y2);});ctx.stroke();
    R.innerHTML=H.rd([['الزمن',t.toFixed(1)+' s'],['المسافة',x.toFixed(1)+' m'],['السرعة الآنية',vel.toFixed(1)+' m/s'],['متوسط السرعة',(t?x/t:0).toFixed(1)+' m/s']]);
  }
  const L=H.loop(dt=>draw(dt));draw(0);return L;
}});

/* ===================== More PhET-style simulations ===================== */

/* ---------- shared: magnetic field scene (needle grid, compass, field meter) ---------- */
function magScene(X,H,cfg){
  const {ctx,W,H:Hh,pt,c}=H.canvas(X,960,560,cfg.hint);
  X.stage.classList.remove('light');X.stage.classList.add('dark');
  const S={grid:true,earth:false,compass:{x:cfg.cx||760,y:cfg.cy||420,th:0,w:0,on:true},probe:{x:200,y:450,on:false}};
  const SOFT=60,EARTH=0.06,REF=3,GS=22;
  function raw(x,y){let bx=0,by=0;for(const p of cfg.poles()){const dx=x-p.x,dy=y-p.y,d2=dx*dx+dy*dy+SOFT,f=p.q/(d2*Math.sqrt(d2));bx+=dx*f;by+=dy*f;}return [bx,by];}
  function field(x,y){
    let b=raw(x,y);const ins=cfg.inside&&cfg.inside(x,y);
    if(ins){const m=Math.hypot(...raw(ins.cx,ins.cy));b=[ins.ux*m,ins.uy*m];}
    if(S.earth)b=[b[0],b[1]-EARTH];
    return b;
  }
  function needle(x,y,ux,uy,l,w,a,sCol){
    ctx.globalAlpha=a;
    ctx.fillStyle='#e8263a';ctx.beginPath();ctx.moveTo(x+ux*l,y+uy*l);ctx.lineTo(x-uy*w,y+ux*w);ctx.lineTo(x+uy*w,y-ux*w);ctx.closePath();ctx.fill();
    ctx.fillStyle=sCol;ctx.beginPath();ctx.moveTo(x-ux*l,y-uy*l);ctx.lineTo(x-uy*w,y+ux*w);ctx.lineTo(x+uy*w,y-ux*w);ctx.closePath();ctx.fill();
    ctx.globalAlpha=1;
  }
  function drawGrid(){
    const sp=40;
    for(let y=sp/2;y<Hh;y+=sp)for(let x=sp/2;x<W;x+=sp){
      if(cfg.skip&&cfg.skip(x,y))continue;
      const [bx,by]=field(x,y),m=Math.hypot(bx,by);if(m<1e-6)continue;
      needle(x,y,bx/m,by/m,sp*.36,sp*.085,Math.min(1,Math.pow(m/REF,.5)),'#d6dbe6');
    }
  }
  function drawCompass(){
    const C=S.compass;if(!C.on)return;
    ctx.save();ctx.translate(C.x,C.y);
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.arc(3,4,46,0,7);ctx.fill();
    const g=ctx.createRadialGradient(-12,-14,6,0,0,46);g.addColorStop(0,'#f4f6fb');g.addColorStop(1,'#9aa2b4');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,46,0,7);ctx.fill();
    ctx.fillStyle='#1a1f2e';ctx.beginPath();ctx.arc(0,0,36,0,7);ctx.fill();
    ctx.fillStyle='#1a1f2e';for(let k=0;k<8;k++){const a=k*Math.PI/4;ctx.beginPath();ctx.arc(Math.cos(a)*41,Math.sin(a)*41,3.2,0,7);ctx.fill();}
    ctx.rotate(C.th);
    ctx.fillStyle='#e8263a';ctx.beginPath();ctx.moveTo(32,0);ctx.lineTo(0,-7);ctx.lineTo(0,7);ctx.closePath();ctx.fill();
    ctx.fillStyle='#f2f4f8';ctx.beginPath();ctx.moveTo(-32,0);ctx.lineTo(0,-7);ctx.lineTo(0,7);ctx.closePath();ctx.fill();
    ctx.fillStyle='#1a1f2e';ctx.beginPath();ctx.arc(0,0,3,0,7);ctx.fill();
    ctx.restore();
  }
  function drawProbe(){
    const P=S.probe;if(!P.on)return;
    const [bx,by]=field(P.x,P.y),m=Math.hypot(bx,by);
    ctx.save();ctx.translate(P.x,P.y);
    ctx.strokeStyle='#3f7bff';ctx.lineWidth=3;ctx.fillStyle='rgba(63,123,255,.15)';ctx.beginPath();ctx.arc(0,0,16,0,7);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(10,0);ctx.moveTo(0,-10);ctx.lineTo(0,10);ctx.stroke();
    ctx.fillStyle='#3f7bff';ctx.fillRect(-4,16,8,26);
    const bxW=150,bxH=96,ox=P.x>W-190?-bxW-26:26,oy=P.y<110?20:-bxH-10;
    ctx.fillStyle='rgba(222,232,255,.96)';ctx.strokeStyle='#3f7bff';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(ox,oy,bxW,bxH,10);ctx.fill();ctx.stroke();
    ctx.fillStyle='#14204a';ctx.font='600 14px Readex Pro';ctx.textAlign='left';
    const th=Math.atan2(-by,bx)*180/Math.PI;
    [['B',(m*GS).toFixed(1)+' G'],['Bx',(bx*GS).toFixed(1)+' G'],['By',(-by*GS).toFixed(1)+' G'],['θ',th.toFixed(0)+'°']].forEach(([k,v],i)=>{ctx.fillText(k,ox+12,oy+24+i*21);ctx.textAlign='right';ctx.fillText(v,ox+bxW-12,oy+24+i*21);ctx.textAlign='left';});
    ctx.restore();
    return m;
  }
  // dragging: compass > probe > scene objects
  let drag=null;
  c.addEventListener('pointerdown',e=>{
    const p=pt(e),C=S.compass,P=S.probe;
    if(C.on&&Math.hypot(p.x-C.x,p.y-C.y)<48)drag={o:C,dx:p.x-C.x,dy:p.y-C.y};
    else if(P.on&&Math.hypot(p.x-P.x,p.y-P.y)<30)drag={o:P,dx:p.x-P.x,dy:p.y-P.y};
    else{const o=cfg.hit&&cfg.hit(p);if(o)drag={o,dx:p.x-o.x,dy:p.y-o.y};}
    if(drag){c.setPointerCapture(e.pointerId);e.preventDefault();}
  });
  c.addEventListener('pointermove',e=>{if(!drag)return;const p=pt(e);drag.o.x=Math.max(20,Math.min(W-20,p.x-drag.dx));drag.o.y=Math.max(20,Math.min(Hh-20,p.y-drag.dy));});
  const up=()=>{drag=null};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
  function step(dt){
    const C=S.compass;if(!C.on)return;
    const [bx,by]=field(C.x,C.y),m=Math.hypot(bx,by);if(m<1e-6)return;
    const phi=Math.atan2(by,bx);let d=C.th-phi;d=Math.atan2(Math.sin(d),Math.cos(d));
    C.w+=(-90*Math.sin(d)*Math.min(1,m/.4))*dt;C.w*=Math.pow(.04,dt);C.th+=C.w*dt;
  }
  function frame(dt){
    step(dt);
    ctx.fillStyle='#000';ctx.fillRect(0,0,W,Hh);
    if(S.earth){ctx.fillStyle='rgba(120,200,255,.55)';ctx.font='600 14px Readex Pro';ctx.textAlign='center';H.rtl(ctx,'↑ الشمال الجغرافي (مجال الأرض)',W/2,22);}
    if(S.grid)drawGrid();
    cfg.draw(ctx,dt);
    drawCompass();
    return drawProbe();
  }
  return {S,ctx,W,Hh,field,frame,needle};
}

/* ---------- 1. Bar magnet (PhET style) ---------- */
labDef({id:'barmagnet',grade:'3',icon:'⫴',title:'المغناطيس القضيبي ومجاله',ch:'الفصل الثاني',desc:'مثل محاكي PhET: شبكة بوصلات، قوة المغناطيس، رؤية الداخل، مقياس المجال',c1:'#e8263a',c2:'#5a7dff',tags:['محاكاة','PhET'],
init(X,H){
  const M={x:420,y:250,w:250,h:62,flip:false,str:.75,inside:false};
  const L=()=>M.w*.42;
  const sc=magScene(X,H,{hint:'اسحب المغناطيس أو البوصلة أو مقياس المجال',
    poles:()=>{const s=M.flip?-1:1,q=M.str*42000;return [{x:M.x+s*L(),y:M.y,q},{x:M.x-s*L(),y:M.y,q:-q}];},
    inside:(x,y)=>Math.abs(x-M.x)<M.w/2&&Math.abs(y-M.y)<M.h/2?{cx:M.x,cy:M.y,ux:M.flip?-1:1,uy:0}:null,
    skip:(x,y)=>Math.abs(x-M.x)<M.w/2+6&&Math.abs(y-M.y)<M.h/2+6,
    hit:p=>Math.abs(p.x-M.x)<M.w/2&&Math.abs(p.y-M.y)<M.h/2?M:null,
    draw(ctx){
      const x0=M.x-M.w/2,y0=M.y-M.h/2,half=M.w/2;
      const red=['#ff5a5f','#d9202c','#a3121c'],blue=['#6f8dff','#3550c8','#22358f'];
      const left=M.flip?red:blue,right=M.flip?blue:red;
      [[x0,left],[M.x,right]].forEach(([x,cl])=>{const g=ctx.createLinearGradient(0,y0,0,y0+M.h);g.addColorStop(0,cl[0]);g.addColorStop(.45,cl[1]);g.addColorStop(1,cl[2]);ctx.fillStyle=g;ctx.fillRect(x,y0,half,M.h);});
      ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x0,y0,M.w,M.h,8);ctx.stroke();
      if(M.inside){for(let i=0;i<5;i++)for(let j=0;j<2;j++){const x=x0+M.w*(i+.5)/5,y=y0+M.h*(j+.5)/2;sc.needle(x,y,M.flip?-1:1,0,15,4,1,'#e9edf5');}}
      else{ctx.fillStyle='#fff';ctx.font='800 34px Readex Pro';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(M.flip?'N':'S',x0+34,M.y+2);ctx.fillText(M.flip?'S':'N',x0+M.w-34,M.y+2);ctx.textBaseline='alphabetic';}
    }});
  const ctl=X.ctl;
  H.slider(ctl,{id:'bmS',label:'قوة المغناطيس',min:0,max:100,value:75,unit:'%',on:v=>{M.str=v/100}}).init();
  H.check(ctl,'bmF','المجال المغناطيسي (B)',true,v=>sc.S.grid=v);
  H.check(ctl,'bmI','رؤية داخل المغناطيس',false,v=>M.inside=v);
  H.check(ctl,'bmE','مجال الأرض',false,v=>sc.S.earth=v);
  H.check(ctl,'bmC','البوصلة',true,v=>sc.S.compass.on=v);
  H.check(ctl,'bmP','مقياس المجال',false,v=>sc.S.probe.on=v);
  H.button(ctl,'bmFlip','اقلب الأقطاب ⇄',()=>{M.flip=!M.flip;});
  H.button(ctl,'bmR','إعادة الوضع ↺',()=>{Object.assign(M,{x:420,y:250,flip:false});Object.assign(sc.S.compass,{x:760,y:420,w:0});Object.assign(sc.S.probe,{x:200,y:450});});
  H.note(ctl,'<b>لاحظ:</b> خطوط المجال تخرج من القطب الشمالي N وتدخل في الجنوبي S، وداخل المغناطيس يكون اتجاهها من S إلى N. كلما ابتعدت قلّت شدة المجال (البوصلات أبهت).');
  const R=H.reads(X);let tAcc=0;
  const Lp=H.loop(dt=>{const m=sc.frame(dt);tAcc+=dt;if(tAcc>.2){tAcc=0;const [bx,by]=sc.field(sc.S.compass.x,sc.S.compass.y);
    R.innerHTML=H.rd([['قوة المغناطيس',Math.round(M.str*100)+'%'],['المجال عند البوصلة',(Math.hypot(bx,by)*22).toFixed(1)+' G'],['القطب الشمالي',M.flip?'يسار':'يمين',1]]);}});
  sc.frame(0);return Lp;
}});

/* ---------- 2. Electromagnet ---------- */
labDef({id:'electromagnet',grade:'3',icon:'⌁',title:'المغناطيس الكهربائي',ch:'الفصل السادس',desc:'ملف وبطارية: غيّر الفولطية وعدد اللفات ونوع التيار ولاحظ المجال',c1:'#ff9f1c',c2:'#ffd166',tags:['محاكاة','PhET'],wide:false,
init(X,H){
  const E={x:430,y:250,len:190,r:52,n:3,V:6,ac:false,f:.5,t:0,phase:0,elec:true};
  const I=()=>E.ac?E.V*Math.sin(2*Math.PI*E.f*E.t):E.V;
  const sc=magScene(X,H,{hint:'اسحب الملف أو البوصلة أو مقياس المجال',cx:780,cy:250,
    poles:()=>{const q=I()*E.n*1600;return [{x:E.x+E.len/2,y:E.y,q},{x:E.x-E.len/2,y:E.y,q:-q}];},
    inside:(x,y)=>Math.abs(x-E.x)<E.len/2&&Math.abs(y-E.y)<E.r?{cx:E.x,cy:E.y,ux:Math.sign(I())||1,uy:0}:null,
    skip:(x,y)=>Math.abs(x-E.x)<E.len/2+14&&Math.abs(y-E.y)<E.r+14||(y>E.y+E.r&&y<E.y+E.r+160&&Math.abs(x-E.x)<E.len/2+40),
    hit:p=>Math.abs(p.x-E.x)<E.len/2+10&&Math.abs(p.y-E.y)<E.r+150&&p.y<E.y+E.r+150?E:null,
    draw(ctx,dt){
      const i=I(),x0=E.x-E.len/2,x1=E.x+E.len/2,top=E.y-E.r,bot=E.y+E.r,by=E.y+E.r+110;
      E.phase+=dt*i*0.35;
      // wires to source
      ctx.strokeStyle='#c98a3a';ctx.lineWidth=5;ctx.lineJoin='round';
      ctx.beginPath();ctx.moveTo(x0,bot);ctx.lineTo(x0-20,by);ctx.lineTo(E.x-60,by);ctx.moveTo(E.x+60,by);ctx.lineTo(x1+20,by);ctx.lineTo(x1,bot);ctx.stroke();
      // source
      if(E.ac){ctx.fillStyle='#f2f4f8';ctx.strokeStyle='#ffd166';ctx.lineWidth=4;ctx.beginPath();ctx.arc(E.x,by,40,0,7);ctx.fill();ctx.stroke();
        ctx.strokeStyle='#1a1f2e';ctx.lineWidth=3;ctx.beginPath();for(let k=-28;k<=28;k++){const yy=by-16*Math.sin(k/28*Math.PI);k===-28?ctx.moveTo(E.x+k,yy):ctx.lineTo(E.x+k,yy);}ctx.stroke();}
      else{const s=Math.sign(E.V)||1,g=ctx.createLinearGradient(0,by-22,0,by+22);g.addColorStop(0,'#5b6478');g.addColorStop(.5,'#2b3142');g.addColorStop(1,'#151925');
        ctx.fillStyle=g;ctx.fillRect(E.x-60,by-22,120,44);ctx.fillStyle='#d4a53c';ctx.fillRect(s>0?E.x+28:E.x-60,by-22,32,44);
        ctx.fillStyle='#fff';ctx.font='700 16px Readex Pro';ctx.textAlign='center';ctx.fillText(Math.abs(E.V).toFixed(1)+' V',E.x-(s>0?10:-14),by+6);
        ctx.fillStyle='#1a1f2e';ctx.fillText('+',s>0?E.x+44:E.x-44,by+6);}
      // iron core hint + back halves of loops
      const loops=E.n*4,dx=E.len/loops;
      ctx.lineWidth=7;ctx.strokeStyle='#8a5a22';
      for(let k=0;k<loops;k++){const x=x0+dx*(k+.5);ctx.beginPath();ctx.moveTo(x-dx*.3,top);ctx.lineTo(x+dx*.3,bot);ctx.stroke();}
      // electrons on back side
      const drawE=front=>{if(!E.elec)return;ctx.fillStyle=front?'#7fd0ff':'rgba(127,208,255,.45)';
        for(let k=0;k<loops;k++)for(let j=0;j<2;j++){let u=((j/2+E.phase)%1+1)%1;const x=x0+dx*(k+.5);
          if(front){const xx=x+dx*.3-u*dx*.6,yy=top+u*(bot-top);ctx.beginPath();ctx.arc(xx,yy,3.4,0,7);ctx.fill();}
          else{const xx=x-dx*.3+u*dx*.6,yy=bot-u*(bot-top);ctx.beginPath();ctx.arc(xx,yy,3,0,7);ctx.fill();}}};
      drawE(false);
      // front halves
      ctx.strokeStyle='#e7a14c';ctx.lineWidth=8;
      for(let k=0;k<loops;k++){const x=x0+dx*(k+.5);ctx.beginPath();ctx.moveTo(x+dx*.3,top);ctx.lineTo(x-dx*.3,bot);ctx.stroke();}
      drawE(true);
      ctx.fillStyle='rgba(255,255,255,.75)';ctx.font='600 13px Readex Pro';ctx.textAlign='center';H.rtl(ctx,'التيار: '+i.toFixed(1)+' A',E.x,top-14);
    }});
  const ctl=X.ctl;
  H.seg(ctl,'emType','مصدر التيار',[['dc','بطارية (مستمر)'],['ac','متناوب AC']],'dc',v=>{E.ac=v==='ac';E.t=0;});
  H.slider(ctl,{id:'emV',label:'الفولطية',min:-10,max:10,step:.5,value:6,unit:'V',on:v=>{E.V=v}}).init();
  H.slider(ctl,{id:'emN',label:'عدد اللفات',min:1,max:4,value:3,on:v=>{E.n=v}}).init();
  H.slider(ctl,{id:'emF',label:'تردد التيار المتناوب',min:.1,max:2,step:.1,value:.5,unit:'Hz',on:v=>{E.f=v}}).init();
  H.check(ctl,'emG','المجال المغناطيسي (B)',true,v=>sc.S.grid=v);
  H.check(ctl,'emEl','إظهار الإلكترونات',true,v=>E.elec=v);
  H.check(ctl,'emC','البوصلة',true,v=>sc.S.compass.on=v);
  H.check(ctl,'emP','مقياس المجال',false,v=>sc.S.probe.on=v);
  H.note(ctl,'<b>لاحظ:</b> يزداد المجال بزيادة التيار وعدد اللفات، وعكس قطبي البطارية يعكس قطبي المغناطيس. مع التيار المتناوب تنقلب الأقطاب باستمرار.');
  const R=H.reads(X);let acc=0;
  const L=H.loop(dt=>{E.t+=dt;sc.frame(dt);acc+=dt;if(acc>.15){acc=0;const i=I();
    R.innerHTML=H.rd([['التيار',i.toFixed(2)+' A'],['عدد اللفات',E.n],['القطب الشمالي',Math.abs(i)<.05?'لا يوجد':i>0?'يمين الملف':'يسار الملف',1]]);}});
  sc.frame(0);return L;
}});

/* ---------- 3. Ohm's law ---------- */
labDef({id:'ohm',grade:'3',icon:'V=IR',title:'قانون أوم',ch:'الفصل الثالث',desc:'غيّر الفولطية والمقاومة ولاحظ كيف يتغير التيار',c1:'#3e8bff',c2:'#9fd0ff',tags:['محاكاة','PhET'],
init(X,H){
  const {ctx,W,H:Hh}=H.canvas(X,900,540);
  let V=4.5,Rr=500,ph=0;
  const ctl=X.ctl;
  H.slider(ctl,{id:'ohV',label:'الفولطية V',min:.1,max:9,step:.1,value:4.5,unit:'V',fmt:v=>v.toFixed(1),on:v=>{V=v}}).init();
  H.slider(ctl,{id:'ohR',label:'المقاومة R',min:10,max:1000,step:10,value:500,unit:'Ω',on:v=>{Rr=v}}).init();
  H.note(ctl,'<b>قانون أوم:</b> التيار يتناسب طرديًا مع الفولطية وعكسيًا مع المقاومة: I = V ÷ R. لاحظ حجم الحروف في المعادلة.');
  const R=H.reads(X);
  function draw(dt){
    const I=V/Rr*1000;ph+=dt*I*.02;
    ctx.fillStyle='#f6f8fe';ctx.fillRect(0,0,W,Hh);
    // equation with scaled letters
    const sV=40+V/9*120,sI=34+Math.max(0,Math.min(1,Math.log10(Math.max(I,.1)*10)/Math.log10(9000)))*150,sR=40+Rr/1000*120;
    ctx.textBaseline='alphabetic';ctx.textAlign='center';const base=200;
    ctx.font=`700 ${sV}px Readex Pro`;ctx.fillStyle='#2f6bff';ctx.fillText('V',170,base);
    ctx.font='600 70px Readex Pro';ctx.fillStyle='#2a3149';ctx.fillText('=',300,base-20);
    ctx.font=`700 ${sI}px Readex Pro`;ctx.fillStyle='#e8263a';ctx.fillText('I',450,base);
    ctx.font=`700 ${sR}px Readex Pro`;ctx.fillStyle='#16a36b';ctx.fillText('R',660,base);
    // circuit
    const x0=110,x1=790,y0=280,y1=500;
    ctx.strokeStyle='#2a3149';ctx.lineWidth=6;ctx.beginPath();ctx.rect(x0,y0,x1-x0,y1-y0);ctx.stroke();
    // batteries on bottom
    const nb=Math.max(1,Math.ceil(V/1.5));const bw=60;const bx0=(x0+x1)/2-nb*bw/2;
    ctx.fillStyle='#f6f8fe';ctx.fillRect(bx0-4,y1-24,nb*bw+8,48);
    for(let k=0;k<nb;k++){const x=bx0+k*bw;const full=k<nb-1||V%1.5===0?1:(V%1.5)/1.5;
      ctx.fillStyle='#3a4256';ctx.fillRect(x,y1-20,bw-8,40);ctx.fillStyle='#d4a53c';ctx.fillRect(x+bw-14,y1-20,6,40);
      ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(x+3,y1-17,(bw-20)*full,6);}
    ctx.fillStyle='#2a3149';ctx.font='600 15px Readex Pro';ctx.fillText(nb+' × 1.5 V',(x0+x1)/2,y1+44);
    // resistor on top
    const rx=330,rw=240;ctx.fillStyle='#e9d8b5';ctx.strokeStyle='#8a6a2f';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(rx,y0-30,rw,60,10);ctx.fill();ctx.stroke();
    const dots=Math.round(Rr/1000*160)+6;let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
    ctx.fillStyle='#5b4520';for(let k=0;k<dots;k++){ctx.beginPath();ctx.arc(rx+8+rnd()*(rw-16),y0-22+rnd()*44,2.2,0,7);ctx.fill();}
    // current arrows (conventional, clockwise)
    const per=2*((x1-x0)+(y1-y0)),n=14;ctx.fillStyle='#e8263a';
    for(let k=0;k<n;k++){let s=((k/n+ph)%1)*per;let x,y,a;
      if(s<x1-x0){x=x0+s;y=y0;a=0;}else if((s-=x1-x0)<y1-y0){x=x1;y=y0+s;a=Math.PI/2;}else if((s-=y1-y0)<x1-x0){x=x1-s;y=y1;a=Math.PI;}else{s-=x1-x0;x=x0;y=y1-s;a=-Math.PI/2;}
      if(y===y0&&x>rx-6&&x<rx+rw+6)continue;if(y===y1&&x>bx0-8&&x<bx0+nb*bw+8)continue;
      const sz=4+Math.min(1,I/900)*9;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.beginPath();ctx.moveTo(sz,0);ctx.lineTo(-sz,-sz*.8);ctx.lineTo(-sz,sz*.8);ctx.closePath();ctx.fill();ctx.restore();}
    R.innerHTML=H.rd([['الفولطية V',V.toFixed(1)+' V'],['المقاومة R',Rr+' Ω'],['التيار I = V/R',I.toFixed(1)+' mA']]);
  }
  const L=H.loop(draw);draw(0);return L;
}});

/* ---------- 4. Resistance of a wire ---------- */
labDef({id:'wireres',grade:'3',icon:'ρL/A',title:'العوامل المؤثرة في المقاومة',ch:'الفصل الثالث',desc:'نوع المادة والطول ومساحة المقطع ودرجة الحرارة',c1:'#16a36b',c2:'#8af0cc',tags:['محاكاة','PhET'],
init(X,H){
  const {ctx,W,H:Hh}=H.canvas(X,900,520);
  let rho=.5,Lw=10,A=7.5,T=20;
  const ctl=X.ctl;
  H.slider(ctl,{id:'wrRho',label:'المقاومية ρ (نوع المادة)',min:.01,max:1,step:.01,value:.5,unit:'Ω·cm',fmt:v=>v.toFixed(2),on:v=>{rho=v}}).init();
  H.slider(ctl,{id:'wrL',label:'طول السلك L',min:.1,max:20,step:.1,value:10,unit:'cm',fmt:v=>v.toFixed(1),on:v=>{Lw=v}}).init();
  H.slider(ctl,{id:'wrA',label:'مساحة المقطع A',min:.01,max:15,step:.01,value:7.5,unit:'cm²',fmt:v=>v.toFixed(2),on:v=>{A=v}}).init();
  H.slider(ctl,{id:'wrT',label:'درجة الحرارة',min:0,max:200,value:20,unit:'°C',on:v=>{T=v}}).init();
  H.note(ctl,'<b>القاعدة:</b> تزداد المقاومة بزيادة الطول وبزيادة المقاومية، وتقل بزيادة مساحة المقطع: R = ρL ÷ A. وفي الموصلات المعدنية تزداد المقاومة بارتفاع درجة الحرارة.');
  const R=H.reads(X);
  function draw(){
    const Rv=rho*Lw/A*(1+.004*(T-20));
    ctx.fillStyle='#f6f8fe';ctx.fillRect(0,0,W,Hh);ctx.textAlign='center';ctx.textBaseline='alphabetic';
    const fR=40+Math.min(1,Math.log10(Rv*100+1)/5)*120,fp=30+rho*80,fL=30+Lw/20*80,fA=30+A/15*80;
    ctx.font=`700 ${fR}px Readex Pro`;ctx.fillStyle='#16a36b';ctx.fillText('R',130,190);
    ctx.font='600 60px Readex Pro';ctx.fillStyle='#2a3149';ctx.fillText('=',240,175);
    ctx.font=`700 ${fp}px Readex Pro`;ctx.fillStyle='#8e44ad';ctx.fillText('ρ',360,140);
    ctx.font=`700 ${fL}px Readex Pro`;ctx.fillStyle='#2f6bff';ctx.fillText('L',470,140);
    ctx.fillStyle='#2a3149';ctx.fillRect(310,160,220,5);
    ctx.font=`700 ${fA}px Readex Pro`;ctx.fillStyle='#e8263a';ctx.fillText('A',420,170+fA*.85);
    ctx.font='600 26px Readex Pro';ctx.fillStyle='#2a3149';ctx.fillText('R = '+(Rv<.1?Rv.toFixed(4):Rv.toFixed(3))+' Ω',720,160);
    // wire as a cylinder
    const len=60+Lw/20*620,d=14+Math.sqrt(A/15)*150,cx=450,cy=380,x0=cx-len/2,x1=cx+len/2;
    const heat=Math.min(1,T/200);const col=`rgb(${Math.round(196+heat*59)},${Math.round(140-heat*60)},${Math.round(70-heat*40)})`;
    const g=ctx.createLinearGradient(0,cy-d/2,0,cy+d/2);g.addColorStop(0,'#fff3dc');g.addColorStop(.3,col);g.addColorStop(1,'#6a4317');
    ctx.fillStyle=g;ctx.fillRect(x0,cy-d/2,len,d);
    ctx.fillStyle='#d9a75c';ctx.beginPath();ctx.ellipse(x1,cy,d*.16,d/2,0,0,7);ctx.fill();ctx.strokeStyle='#6a4317';ctx.lineWidth=2;ctx.stroke();
    ctx.beginPath();ctx.ellipse(x0,cy,d*.16,d/2,0,Math.PI/2,Math.PI*1.5);ctx.stroke();
    // impurity dots ∝ rho
    let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
    const n=Math.round(rho*len*d/180);ctx.fillStyle='rgba(40,25,10,.55)';
    for(let k=0;k<n;k++){ctx.beginPath();ctx.arc(x0+4+rnd()*(len-8),cy-d/2+3+rnd()*(d-6),1.8,0,7);ctx.fill();}
    // dimension marks
    ctx.strokeStyle='#2f6bff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,cy+d/2+22);ctx.lineTo(x1,cy+d/2+22);ctx.stroke();
    ctx.fillStyle='#2f6bff';ctx.font='600 14px Readex Pro';ctx.fillText('L = '+Lw.toFixed(1)+' cm',cx,cy+d/2+42);
    R.innerHTML=H.rd([['المقاومة R',(Rv<.1?Rv.toFixed(4):Rv.toFixed(3))+' Ω'],['المقاومية ρ',rho.toFixed(2)+' Ω·cm'],['الطول L',Lw.toFixed(1)+' cm'],['المساحة A',A.toFixed(2)+' cm²']]);
  }
  const L=H.loop(draw);draw();return L;
}});

/* ---------- 5. AC / DC generator ---------- */
labDef({id:'generator',grade:'3',icon:'⟳~',title:'المولّد الكهربائي',ch:'الفصل السادس',desc:'ملف يدور بين قطبي مغناطيس فيتولد تيار متناوب أو مستمر',c1:'#8e6bff',c2:'#c9b8ff',tags:['محاكاة','PhET'],wide:true,
init(X,H){
  const {ctx,W,H:Hh}=H.canvas(X,1000,520,'غيّر سرعة الدوران وعدد اللفات ونوع الحلقات');
  let rps=.6,turns=5,dc=false,th=0,hist=[];
  const ctl=X.ctl;
  H.slider(ctl,{id:'gnS',label:'سرعة الدوران',min:0,max:3,step:.1,value:.6,unit:'دورة/ث',fmt:v=>v.toFixed(1),on:v=>{rps=v}}).init();
  H.slider(ctl,{id:'gnN',label:'عدد لفات الملف',min:1,max:10,value:5,on:v=>{turns=v}}).init();
  H.seg(ctl,'gnT','نوع الحلقات',[['ac','حلقتا انزلاق (متناوب)'],['dc','مبدّل (مستمر)']],'ac',v=>{dc=v==='dc';hist=[];});
  H.note(ctl,'<b>لاحظ:</b> القوة الدافعة المحتثة أكبر ما يمكن عندما يكون مستوى الملف موازيًا للمجال، وصفر عندما يكون عموديًا عليه. زيادة السرعة أو عدد اللفات تزيد القيمة العظمى والتردد.');
  const R=H.reads(X);let acc=0;
  function draw(dt){
    th+=2*Math.PI*rps*dt;const emfMax=turns*rps*2.2;let e=emfMax*Math.sin(th);if(dc)e=Math.abs(e);
    hist.push(e);if(hist.length>360)hist.shift();
    ctx.fillStyle='#f6f8fe';ctx.fillRect(0,0,W,Hh);
    const cx=270,cy=200;
    // magnet poles
    const pole=(x,dir,cl,lbl)=>{const g=ctx.createLinearGradient(x,0,x+dir*90,0);g.addColorStop(0,cl[0]);g.addColorStop(1,cl[1]);ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,cy-110);ctx.lineTo(x+dir*90,cy-110);ctx.lineTo(x+dir*90,cy+110);ctx.lineTo(x,cy+110);ctx.quadraticCurveTo(x+dir*40,cy,x,cy-110);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='800 34px Readex Pro';ctx.textAlign='center';ctx.fillText(lbl,x+dir*55,cy+12);};
    pole(cx-150,-1,['#ff5a5f','#a3121c'],'N');pole(cx+150,1,['#6f8dff','#22358f'],'S');
    ctx.strokeStyle='rgba(47,107,255,.25)';ctx.lineWidth=2;ctx.setLineDash([6,6]);for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(cx-140,cy+k*28);ctx.lineTo(cx+140,cy+k*28);ctx.stroke();}ctx.setLineDash([]);
    // rotating coil (rotation about vertical axis)
    const hw=95*Math.cos(th),hh=75,depth=Math.sin(th);
    ctx.lineWidth=3+turns*.7;ctx.strokeStyle=depth>0?'#b8762e':'#e8a14c';
    ctx.beginPath();ctx.moveTo(cx-hw,cy-hh);ctx.lineTo(cx+hw,cy-hh);ctx.lineTo(cx+hw,cy+hh);ctx.lineTo(cx-hw,cy+hh);ctx.closePath();ctx.stroke();
    ctx.fillStyle=depth>0?'rgba(232,161,76,.12)':'rgba(232,161,76,.22)';ctx.fill();
    // axle, rings, brushes
    ctx.strokeStyle='#6b7489';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx,cy+hh);ctx.lineTo(cx,cy+170);ctx.stroke();
    if(dc){ctx.fillStyle='#c98a3a';ctx.fillRect(cx-22,cy+125,20,24);ctx.fillRect(cx+2,cy+125,20,24);}
    else{ctx.fillStyle='#c98a3a';ctx.fillRect(cx-22,cy+112,44,14);ctx.fillRect(cx-22,cy+136,44,14);}
    ctx.fillStyle='#3a4256';ctx.fillRect(cx-40,cy+118,14,26);ctx.fillRect(cx+26,cy+118,14,26);
    // external circuit: wires → bulb + galvanometer
    const bx=520,byy=150;ctx.strokeStyle='#2a3149';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(cx-40,cy+131);ctx.lineTo(cx-70,cy+131);ctx.lineTo(cx-70,cy+165);ctx.lineTo(bx+170,cy+165);ctx.lineTo(bx+170,byy+40);ctx.moveTo(cx+40,cy+131);ctx.lineTo(bx-10,cy+131);ctx.lineTo(bx-10,byy+40);ctx.stroke();
    // bulb
    const glow=Math.min(1,Math.abs(e)/30);
    if(glow>.02){const gg=ctx.createRadialGradient(bx+40,byy,4,bx+40,byy,90);gg.addColorStop(0,`rgba(255,220,90,${.85*glow})`);gg.addColorStop(1,'rgba(255,220,90,0)');ctx.fillStyle=gg;ctx.beginPath();ctx.arc(bx+40,byy,90,0,7);ctx.fill();}
    ctx.fillStyle=`rgb(${235},${Math.round(235-30*glow)},${Math.round(235-150*glow)})`;ctx.strokeStyle='#8a90a0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(bx+40,byy,30,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#8a90a0';ctx.fillRect(bx+26,byy+28,28,16);
    ctx.strokeStyle='#2a3149';ctx.beginPath();ctx.moveTo(bx-10,byy+40);ctx.lineTo(bx+26,byy+40);ctx.moveTo(bx+54,byy+40);ctx.lineTo(bx+90,byy+40);ctx.stroke();
    // galvanometer
    const gx=bx+130,gy=byy+20;ctx.fillStyle='#fff';ctx.strokeStyle='#2a3149';ctx.lineWidth=2;ctx.beginPath();ctx.arc(gx,gy,40,Math.PI,0);ctx.lineTo(gx+40,gy+12);ctx.lineTo(gx-40,gy+12);ctx.closePath();ctx.fill();ctx.stroke();
    const ang=-Math.PI/2+Math.max(-1.25,Math.min(1.25,e/40*1.25));ctx.strokeStyle='#e8263a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx,gy+6);ctx.lineTo(gx+Math.cos(ang)*34,gy+6+Math.sin(ang)*34);ctx.stroke();
    ctx.fillStyle='#2a3149';ctx.font='600 13px Readex Pro';ctx.textAlign='center';ctx.fillText('G',gx,gy+28);
    ctx.beginPath();ctx.moveTo(bx+90,byy+40);ctx.lineTo(gx-30,byy+40);ctx.moveTo(gx+30,byy+40);ctx.lineTo(bx+170,byy+40);ctx.stroke();
    // graph
    const G={x:430,y:385,w:540,h:120};ctx.fillStyle='#fff';ctx.strokeStyle='#c9cfdf';ctx.lineWidth=1;ctx.fillRect(G.x,G.y,G.w,G.h);ctx.strokeRect(G.x,G.y,G.w,G.h);
    ctx.strokeStyle='#9aa3b8';ctx.beginPath();ctx.moveTo(G.x,G.y+G.h/2);ctx.lineTo(G.x+G.w,G.y+G.h/2);ctx.stroke();
    ctx.strokeStyle='#8e6bff';ctx.lineWidth=2.5;ctx.beginPath();hist.forEach((v,i)=>{const x=G.x+i/360*G.w,y=G.y+G.h/2-v/(Math.max(6,emfMax)*1.1)*G.h/2;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
    ctx.fillStyle='#2a3149';ctx.font='600 13px Readex Pro';ctx.textAlign='right';ctx.fillText('القوة الدافعة المحتثة مع الزمن',G.x+G.w-8,G.y+18);
    acc+=dt;if(acc>.15){acc=0;R.innerHTML=H.rd([['القوة الدافعة الآن',e.toFixed(1)+' V'],['القيمة العظمى',emfMax.toFixed(1)+' V'],['التردد',rps.toFixed(1)+' Hz'],['نوع التيار',dc?'مستمر (موحّد الاتجاه)':'متناوب',1]]);}
  }
  const L=H.loop(draw);draw(0);return L;
}});

/* ---------- 6. Forces and motion (grade 1) ---------- */
labDef({id:'forces',grade:'1',icon:'F→',title:'القوة والحركة',ch:'الأول المتوسط',desc:'ادفع الصندوق بقوة، وغيّر الكتلة والاحتكاك، ولاحظ التعجيل والسرعة',c1:'#ff6b92',c2:'#ffc0d1',tags:['محاكاة','PhET'],wide:true,
init(X,H){
  const {ctx,W,H:Hh}=H.canvas(X,1000,460,'غيّر القوة المؤثرة من المنزلقة');
  const OBJ={crate:['صندوق',50,'#c58b4a'],fridge:['ثلاجة',200,'#dfe5ef'],box:['علبة صغيرة',10,'#e8a14c']};
  const SURF={none:['بدون احتكاك (جليد مثالي)',0],ice:['جليد',.05],wood:['خشب',.25],rough:['سطح خشن',.5]};
  let F=0,ob='crate',sf='wood',x=0,v=0,a=0,fr=0,arrows=true;
  const ctl=X.ctl;
  const fs=H.slider(ctl,{id:'fmF',label:'القوة المؤثرة F (موجبة = يمين)',min:-500,max:500,step:10,value:0,unit:'N',on:val=>{F=val}});fs.init();
  ctl.insertAdjacentHTML('beforeend',`<label for="fmO">الجسم<select id="fmO">${Object.entries(OBJ).map(([k,o])=>`<option value="${k}"${k==='crate'?' selected':''}>${o[0]} (${o[1]} kg)</option>`).join('')}</select></label>
    <label for="fmS">السطح<select id="fmS">${Object.entries(SURF).map(([k,s])=>`<option value="${k}"${k==='wood'?' selected':''}>${s[0]}${s[1]?' (μ = '+s[1]+')':''}</option>`).join('')}</select></label>`);
  ctl.querySelector('#fmO').onchange=e=>{ob=e.target.value;};ctl.querySelector('#fmS').onchange=e=>{sf=e.target.value;};
  H.check(ctl,'fmA','إظهار أسهم القوى',true,val=>arrows=val);
  H.button(ctl,'fmStop','إيقاف وإعادة ↺',()=>{F=0;fs.set(0);v=0;x=0;});
  H.note(ctl,'<b>قانون نيوتن الثاني:</b> محصلة القوى = الكتلة × التعجيل (ΣF = m·a). إذا كانت القوة المؤثرة أقل من الاحتكاك السكوني لا يتحرك الجسم.');
  const R=H.reads(X);let acc=0;
  function step(dt){
    const m=OBJ[ob][1],mu=SURF[sf][1],N=m*9.8,fk=mu*N,fs=mu*1.25*N;
    if(Math.abs(v)<1e-3){v=0;if(Math.abs(F)<=fs){fr=-F;a=0;}else{fr=-Math.sign(F)*fk;a=(F+fr)/m;v=a*dt;}}
    else{fr=-Math.sign(v)*fk;a=(F+fr)/m;const nv=v+a*dt;if(Math.sign(nv)!==Math.sign(v)&&Math.abs(F)<=fs){v=0;a=0;fr=-F;}else v=nv;}
    if(Math.abs(v)>20){v=Math.sign(v)*20;a=0;}
    x+=v*dt;
  }
  function arrow(x0,y,f,col,lbl){if(Math.abs(f)<1)return;const len=f*.32;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x0+len-Math.sign(len)*14,y);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x0+len,y);ctx.lineTo(x0+len-Math.sign(len)*20,y-14);ctx.lineTo(x0+len-Math.sign(len)*20,y+14);ctx.closePath();ctx.fill();
    ctx.font='700 14px Readex Pro';ctx.textAlign='center';H.rtl(ctx,lbl+' '+Math.abs(Math.round(f))+' N',x0+len/2,y-14);}
  function draw(dt){
    step(Math.min(dt,.05));
    const gy=330;const sky=ctx.createLinearGradient(0,0,0,gy);sky.addColorStop(0,'#bfe0ff');sky.addColorStop(1,'#eef7ff');ctx.fillStyle=sky;ctx.fillRect(0,0,W,gy);
    // scrolling background (mountains + ground marks)
    const off=(x*60)%W;ctx.fillStyle='#b9d7b0';for(let k=-1;k<3;k++){const bx=k*500-off*.3%500;ctx.beginPath();ctx.moveTo(bx,gy);ctx.lineTo(bx+160,gy-120);ctx.lineTo(bx+330,gy);ctx.fill();}
    ctx.fillStyle=sf==='ice'||sf==='none'?'#d9f0ff':sf==='rough'?'#8d7a63':'#c8a26e';ctx.fillRect(0,gy,W,Hh-gy);
    ctx.fillStyle='rgba(0,0,0,.15)';for(let k=-1;k<22;k++){const mx=k*50-((x*60)%50+50)%50;ctx.fillRect(mx,gy+6,24,4);}
    ctx.fillStyle='#2a3149';ctx.font='600 12px Readex Pro';ctx.textAlign='center';for(let k=-2;k<4;k++){const m0=Math.floor(x/5)*5+k*5,px=W/2+(m0-x)*60;if(px>0&&px<W)ctx.fillText(m0+' m',px,gy+30);}
    // object
    const o=OBJ[ob],sz=ob==='fridge'?[110,170]:ob==='box'?[60,50]:[110,100],cx=W/2,top=gy-sz[1];
    ctx.fillStyle=o[2];ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(cx-sz[0]/2,top,sz[0],sz[1],6);ctx.fill();ctx.stroke();
    if(ob==='crate'){ctx.beginPath();ctx.moveTo(cx-sz[0]/2,top);ctx.lineTo(cx+sz[0]/2,gy);ctx.moveTo(cx+sz[0]/2,top);ctx.lineTo(cx-sz[0]/2,gy);ctx.stroke();}
    if(ob==='fridge'){ctx.beginPath();ctx.moveTo(cx-sz[0]/2,top+60);ctx.lineTo(cx+sz[0]/2,top+60);ctx.stroke();ctx.fillStyle='#8a90a0';ctx.fillRect(cx+sz[0]/2-16,top+20,5,30);ctx.fillRect(cx+sz[0]/2-16,top+80,5,40);}
    ctx.fillStyle='#2a3149';ctx.font='700 14px Readex Pro';ctx.fillText(o[1]+' kg',cx,top-8);
    // pusher stick figure
    if(Math.abs(F)>0){const s=F>0?-1:1,px=cx+s*(sz[0]/2+34);ctx.strokeStyle='#2a3149';ctx.lineWidth=5;ctx.lineCap='round';
      ctx.beginPath();ctx.arc(px,gy-150,16,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(px,gy-134);ctx.lineTo(px+s*6,gy-70);ctx.lineTo(px-s*14,gy);ctx.moveTo(px+s*6,gy-70);ctx.lineTo(px+s*30,gy);
      ctx.moveTo(px,gy-115);ctx.lineTo(cx+s*sz[0]/2,gy-Math.min(sz[1],110)+20);ctx.stroke();ctx.lineCap='butt';}
    if(arrows){arrow(cx,top-60,F,'#2f6bff','القوة');arrow(cx,top-110,fr,'#e8263a','الاحتكاك');arrow(cx,top-160,F+fr,'#16a36b','المحصلة');}
    // speedometer
    const sx=110,sy=110;ctx.fillStyle='#fff';ctx.strokeStyle='#2a3149';ctx.lineWidth=3;ctx.beginPath();ctx.arc(sx,sy,62,0,7);ctx.fill();ctx.stroke();
    for(let k=0;k<=10;k++){const an=Math.PI*.75+k/10*Math.PI*1.5;ctx.beginPath();ctx.moveTo(sx+Math.cos(an)*52,sy+Math.sin(an)*52);ctx.lineTo(sx+Math.cos(an)*60,sy+Math.sin(an)*60);ctx.stroke();}
    const an=Math.PI*.75+Math.min(1,Math.abs(v)/20)*Math.PI*1.5;ctx.strokeStyle='#e8263a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+Math.cos(an)*48,sy+Math.sin(an)*48);ctx.stroke();
    ctx.fillStyle='#2a3149';ctx.font='700 15px Readex Pro';ctx.textAlign='center';ctx.fillText(Math.abs(v).toFixed(1)+' m/s',sx,sy+40);
    acc+=dt;if(acc>.12){acc=0;R.innerHTML=H.rd([['القوة المؤثرة',F+' N'],['قوة الاحتكاك',Math.round(fr)+' N'],['محصلة القوى',Math.round(F+fr)+' N'],['التعجيل a',a.toFixed(2)+' m/s²'],['السرعة',v.toFixed(2)+' m/s'],['المسافة',x.toFixed(1)+' m']]);}
  }
  const L=H.loop(draw);draw(0);return L;
}});

/* ---------- 7. States of matter (grade 1) ---------- */
labDef({id:'states',grade:'1',icon:'❄☁',title:'حالات المادة',ch:'الأول المتوسط',desc:'سخّن أو برّد الجزيئات وشاهد تحوّلها بين الصلب والسائل والغاز',c1:'#2fb7d6',c2:'#a6ecfa',tags:['محاكاة','PhET'],
init(X,H){
  const {ctx,W,H:Hh}=H.canvas(X,860,560,'استعمل منزلقة التسخين والتبريد');
  const SIG=30,BW=17,BH=15,N=81,G=.35,RC=2.5,RC2=RC*RC;
  const px=[],py=[],vx=[],vy=[],fx=new Float64Array(N),fy=new Float64Array(N);
  let Tt=.15,heat=0;
  function lattice(){px.length=py.length=vx.length=vy.length=0;const k=9,s=1.12;for(let i=0;i<N;i++){px.push(BW/2-(k-1)*s/2+(i%k)*s+((Math.floor(i/k))%2)*s/2*0);py.push(BH-.7-Math.floor(i/k)*s*.97);vx.push((Math.random()-.5)*.2);vy.push((Math.random()-.5)*.2);}}
  lattice();
  function forces(){
    fx.fill(0);fy.fill(0);
    for(let i=0;i<N;i++){fy[i]+=G;
      for(let j=i+1;j<N;j++){const dx=px[i]-px[j],dy=py[i]-py[j],r2=dx*dx+dy*dy;if(r2>RC2)continue;
        const r2c=Math.max(r2,.64),ir2=1/r2c,ir6=ir2*ir2*ir2;let f=24*ir2*ir6*(2*ir6-1);if(f>500)f=500;
        fx[i]+=f*dx;fy[i]+=f*dy;fx[j]-=f*dx;fy[j]-=f*dy;}}
  }
  function temp(){let k=0;for(let i=0;i<N;i++)k+=vx[i]*vx[i]+vy[i]*vy[i];return k/(2*N);}
  function integrate(sub){
    const dt=.004;
    for(let s=0;s<sub;s++){
      forces();
      for(let i=0;i<N;i++){vx[i]+=fx[i]*dt;vy[i]+=fy[i]*dt;const sp=Math.hypot(vx[i],vy[i]);if(sp>8){vx[i]*=8/sp;vy[i]*=8/sp;}
        px[i]+=vx[i]*dt;py[i]+=vy[i]*dt;
        if(px[i]<.5){px[i]=.5;vx[i]=Math.abs(vx[i]);}if(px[i]>BW-.5){px[i]=BW-.5;vx[i]=-Math.abs(vx[i]);}
        if(py[i]<.5){py[i]=.5;vy[i]=Math.abs(vy[i]);}if(py[i]>BH-.5){py[i]=BH-.5;vy[i]=-Math.abs(vy[i]);}}
    }
    const T=temp();if(T>1e-6){const lam=Math.max(.9,Math.min(1.1,Math.sqrt(1+.06*(Tt/T-1))));for(let i=0;i<N;i++){vx[i]*=lam;vy[i]*=lam;}}
  }
  const ctl=X.ctl;
  ctl.insertAdjacentHTML('beforeend','<div class="seg" id="stP" role="group" aria-label="الحالة"><button type="button" data-v="s">❄ صلب</button><button type="button" data-v="l">💧 سائل</button><button type="button" data-v="g">☁ غاز</button></div>');
  ctl.querySelectorAll('#stP button').forEach(b=>b.onclick=()=>{const v=b.dataset.v;Tt={s:.15,l:.45,g:1.1}[v];if(v==='s')lattice();});
  const hs=H.slider(ctl,{id:'stH',label:'تبريد ← → تسخين',min:-100,max:100,value:0,fmt:v=>v>0?'تسخين':v<0?'تبريد':'متوقف',on:v=>{heat=v/100}});hs.init();
  hs.input.addEventListener('pointerup',()=>{hs.set(0);heat=0;});hs.input.addEventListener('touchend',()=>{hs.set(0);heat=0;});
  H.note(ctl,'<b>لاحظ:</b> في الصلب تهتز الجزيئات حول مواضع ثابتة، وفي السائل تنزلق فوق بعضها، وفي الغاز تتحرك بحرية وبسرعة كبيرة. التسخين يزيد سرعة (طاقة) الجزيئات.');
  const R=H.reads(X);let acc=0;
  const toK=T=>120+T*420;
  function draw(dt){
    Tt=Math.max(.03,Math.min(1.6,Tt+heat*dt*.35));
    integrate(10);
    const T=temp(),K=toK(T),C=K-273,state=C<0?'صلب':C<100?'سائل':'غاز';
    ctx.fillStyle='#f6f8fe';ctx.fillRect(0,0,W,Hh);
    const ox=40,oy=30,bw=BW*SIG,bh=BH*SIG;
    ctx.fillStyle='#fff';ctx.fillRect(ox,oy,bw,bh);ctx.strokeStyle='#7e8aa8';ctx.lineWidth=5;ctx.strokeRect(ox,oy,bw,bh);
    for(let i=0;i<N;i++){const x=ox+px[i]*SIG,y=oy+py[i]*SIG,g=ctx.createRadialGradient(x-5,y-6,2,x,y,SIG*.5);g.addColorStop(0,'#d7f4ff');g.addColorStop(1,'#1f8fd0');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,SIG*.47,0,7);ctx.fill();}
    // stove
    const sy=oy+bh+14;ctx.fillStyle=heat>0?`rgba(255,${Math.round(140-heat*80)},40,1)`:heat<0?'#7fd0ff':'#9aa3b8';ctx.beginPath();ctx.roundRect(ox+bw/2-110,sy,220,26,8);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='700 14px Readex Pro';ctx.textAlign='center';ctx.fillText(heat>0?'🔥 تسخين':heat<0?'❄ تبريد':'—',ox+bw/2,sy+18);
    // thermometer
    const tx=ox+bw+70,ty=60,th=380;ctx.fillStyle='#fff';ctx.strokeStyle='#7e8aa8';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(tx-12,ty,24,th,12);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(tx,ty+th+16,22,0,7);ctx.fill();ctx.stroke();
    const frac=Math.max(0,Math.min(1,(K-100)/600));ctx.fillStyle='#e8263a';ctx.fillRect(tx-6,ty+th-frac*th,12,frac*th+10);ctx.beginPath();ctx.arc(tx,ty+th+16,15,0,7);ctx.fill();
    ctx.fillStyle='#2a3149';ctx.font='700 15px Readex Pro';ctx.fillText(Math.round(K)+' K',tx,ty-26);ctx.font='600 13px Readex Pro';ctx.fillText(Math.round(C)+' °C',tx,ty-8);
    [[273,'0°C'],[373,'100°C']].forEach(([k,l])=>{const yy=ty+th-Math.max(0,Math.min(1,(k-100)/600))*th;ctx.strokeStyle='#2a3149';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx+12,yy);ctx.lineTo(tx+22,yy);ctx.stroke();ctx.textAlign='left';ctx.fillText(l,tx+26,yy+5);ctx.textAlign='center';});
    ctx.font='700 20px Readex Pro';ctx.fillStyle='#1f8fd0';H.rtl(ctx,'الحالة: '+state,ox+bw/2,oy-8>12?oy-8:22);
    acc+=dt;if(acc>.15){acc=0;R.innerHTML=H.rd([['درجة الحرارة',Math.round(C)+' °C'],['بالكلفن',Math.round(K)+' K'],['حالة المادة (الماء)',state,1]]);}
  }
  const L=H.loop(dt=>draw(Math.min(dt,.05)));draw(0);return L;
}});

(function(){
/* Class features backed by Firebase (Firestore + Auth).
   Collections: settings/site, participants/{1|3}, announcements/{id},
   inbox/{studentUid} (+ msgs subcollection), chapters/{id}. */
const {ar,$,$$}=window.APP;
const {db,auth}=window.FB;
const CFG=window.SITE_CONFIG||{};
const OWNER=String(CFG.ownerEmail||'').trim().toLowerCase();
const ROLE={admin:'مدير',teacher:'أستاذ/ة'};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ss={get(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}};
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const GR={'1':'الأول المتوسط','3':'الثالث المتوسط','all':'كل الصفوف'};
const todayISO=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const fmtDay=iso=>{try{return new Date(iso+'T12:00:00').toLocaleDateString('ar-IQ',{weekday:'long',day:'numeric',month:'long'})}catch(e){return iso}};
const fmtTs=ts=>{try{return new Date(ts).toLocaleString('ar-IQ',{day:'numeric',month:'long',hour:'numeric',minute:'2-digit'})}catch(e){return ''}};
const errText=e=>({'permission-denied':'لا تملك صلاحية تنفيذ هذه العملية.','unavailable':'لا يوجد اتصال بالإنترنت، حاول مرة أخرى.','resource-exhausted':'تجاوزت الحد المسموح، حاول لاحقًا.'}[e&&e.code]||'تعذّر الحفظ، حاول مرة أخرى.');

/* ---------- live state ---------- */
const S={participants:{},announcements:[],settings:{studentMsgs:false},loaded:false};
const B={user:null,teacher:false,admin:false,role:'',name:'',authReady:false};
const PLOCK=Object.assign({},(window.__DATA__&&window.__DATA__.locked)||{});   // grade -> needs class code
const locked=g=>!B.teacher&&!!PLOCK[g];
const lockHint=(g,what)=>`<div class="empty-mini">🔐 أدخل رمز صف ${GR[g]} لعرض ${what}. <a href="#g${g}">إدخال الرمز</a></div>`;

function toast(t){let el=$('#rmToast');if(!el){el=document.createElement('div');el.id='rmToast';el.className='toast ui';el.setAttribute('role','status');document.body.append(el);}
  el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),3200);}

/* ---------- shared renderers ---------- */
const grade=()=>(window.APP.getGrade&&window.APP.getGrade())||'3';
function annFor(g){return S.announcements.filter(a=>a.grade==='all'||a.grade===g).sort((a,b)=>((b.pinned?1:0)-(a.pinned?1:0))||(b.ts-a.ts));}
function annCard(a,del){return `<article class="card ann${a.pinned?' pin':''}"><header><span class="tag" style="--gc:${a.grade==='1'?'#3ee8b0':a.grade==='3'?'#7c9cff':'#ffc65c'}">${GR[a.grade]||''}</span>${a.pinned?'<span class="tag" style="--gc:#ff6b92">مثبّت</span>':''}<time>${fmtTs(a.ts)}</time>${del?`<button type="button" class="btn sm danger" data-del="${esc(a.id)}">حذف</button>`:''}</header><h3>${esc(a.title)}</h3>${a.body?`<p>${esc(a.body)}</p>`:''}</article>`;}
function partBlock(g,big){
  if(!S.loaded)return '<div class="empty-mini">جارٍ التحميل…</div>';
  if(locked(g))return lockHint(g,'المشاركين');
  const p=S.participants[g];
  if(!p||!p.names||!p.names.length)return `<div class="empty-mini">لم تُضف أسماء لدرس ${GR[g]} بعد.</div>`;
  const isToday=p.date===todayISO();
  return `<div class="pmeta"><span class="kick" style="margin:0">${isToday?'درس اليوم':'آخر درس'} • ${esc(fmtDay(p.date))}</span>${p.lesson?`<b>${esc(p.lesson)}</b>`:''}</div>
    <ol class="stars${big?' big':''}">${p.names.map((n,i)=>`<li style="--d:${i*60}ms"><span class="st" aria-hidden="true">★</span>${esc(n)}</li>`).join('')}</ol>
    <p class="count">${ar(p.names.length)} ${p.names.length>10?'طالبًا':'طلاب'} شاركوا • أحسنتم 👏</p>`;
}
function unseen(){const last=+(ls.get('rm-seen')||0);return annFor(grade()).filter(a=>a.ts>last).length;}
function badge(){const n=unseen(),a=$('.nav a[data-nav="board"]');if(!a)return;let b=$('.nbadge',a);if(n&&!b){b=document.createElement('span');b.className='nbadge';a.append(b);}if(b){if(n)b.textContent=ar(n);else b.remove();}}

/* ---------- home ---------- */
function renderHome(){
  const g=grade(),host=$('#homeClass');if(!host)return;
  const anns=annFor(g).slice(0,3);
  host.innerHTML=`<div class="classgrid">
    <section class="card pcard"><h2 class="ctitle"><span class="ci">🏅</span>المشاركون في الدرس <small>${GR[g]}</small></h2>${partBlock(g)}</section>
    <section class="card acard"><h2 class="ctitle"><span class="ci">📢</span>تبليغات الأستاذة</h2>
      ${!anns.length&&locked(g)?lockHint(g,'التبليغات'):anns.length?anns.map(a=>`<a class="annmini" href="#board"><b>${esc(a.title)}</b><small>${fmtTs(a.ts)}${a.pinned?' • مثبّت':''}</small></a>`).join(''):`<div class="empty-mini">${S.loaded?'لا توجد تبليغات حاليًا.':'جارٍ التحميل…'}</div>`}
      <a class="btn" href="#board" style="margin-top:auto">كل التبليغات${S.settings.studentMsgs?' والمراسلة':''}</a></section></div>`;
}

/* ---------- board (students) ---------- */
let threadUnsub=null,msgBoxMode='';
function renderBoard(){
  const g=grade(),v=$('#v-board');
  if(!$('#boardAnn',v)){
    v.innerHTML=`<span class="kick">من الأستاذة روان محمد</span><h1 class="h1">التبليغات والمراسلة</h1>
      <p class="lede" id="boardLede"></p><div class="annlist" id="boardAnn"></div>
      <h2 class="sec-title">مشاركو الدرس</h2><div class="card pcard" id="boardPart"></div>
      <h2 class="sec-title">راسل الأستاذة</h2><div id="msgBox"></div>`;
    msgBoxMode='';
  }
  $('#boardLede').textContent=`هنا تنشر الأستاذة التبليغات والواجبات ومواعيد الامتحانات لطلاب ${GR[g]}.`;
  const anns=annFor(g);
  $('#boardAnn').innerHTML=!anns.length&&locked(g)?window.APP.lockCard(g):anns.length?anns.map(a=>annCard(a)).join(''):`<p class="card empty">${S.loaded?'لا توجد تبليغات حاليًا لهذا الصف.':'جارٍ التحميل…'}</p>`;
  $('#boardPart').innerHTML=partBlock(g,true);
  ls.set('rm-seen',String(Date.now()));badge();
  renderMsgBox();
}
function renderMsgBox(){
  const box=$('#msgBox');if(!box)return;
  const mode=!S.loaded?'wait':!S.settings.studentMsgs?'locked':B.teacher?'teacher':'open:'+(B.user?B.user.uid:'');
  if(mode===msgBoxMode)return;msgBoxMode=mode;
  if(threadUnsub){threadUnsub();threadUnsub=null;}
  if(mode==='wait'){box.innerHTML='<div class="card locked"><span class="ci">⏳</span><div><b>جارٍ التحميل…</b></div></div>';return;}
  if(mode==='locked'){box.innerHTML='<div class="card locked"><span class="ci">🔒</span><div><b>المراسلة مقفلة حاليًا</b><p>تفتح الأستاذة المراسلة عند الحاجة. تابع التبليغات.</p></div></div>';return;}
  if(mode==='teacher'){box.innerHTML='<div class="card locked"><span class="ci">👩‍🏫</span><div><b>أنت مسجّل في لوحة التحكم</b><p>رسائل الطلاب تظهر في <a href="#teacher">لوحة التحكم</a>.</p></div></div>';return;}
  const nm=ls.get('rm-name')||'';
  box.innerHTML=`<div class="card msgcard"><div class="thread" id="myThread"><p class="empty-mini">اكتب سؤالك أو استفسارك، وسترد عليك الأستاذة هنا.</p></div>
    <form id="msgForm" class="msgform"><input id="msgName" required maxlength="40" placeholder="اسمك الثلاثي" value="${esc(nm)}" aria-label="اسمك"><textarea id="msgText" required maxlength="600" rows="3" placeholder="رسالتك للأستاذة…" aria-label="الرسالة"></textarea><div class="row"><button class="btn pri" type="submit">إرسال</button><span class="count" id="msgSt" role="status"></span></div></form></div>`;
  if(B.user)watchMyThread(B.user.uid);
  $('#msgForm').onsubmit=async e=>{e.preventDefault();
    const name=$('#msgName').value.trim().slice(0,40),text=$('#msgText').value.trim().slice(0,600),st=$('#msgSt');if(!name||!text)return;
    ls.set('rm-name',name);st.textContent='جارٍ الإرسال…';
    try{
      if(!auth.currentUser)await auth.signInAnonymously();
      const uid=auth.currentUser.uid,ts=Date.now(),b=db.batch(),th=db.collection('inbox').doc(uid);
      b.set(th,{name,grade:grade(),updated:ts,unread:true});
      b.set(th.collection('msgs').doc(),{from:'s',text,ts});
      await b.commit();
      $('#msgText').value='';st.textContent='وصلت رسالتك ✔';
      if(!threadUnsub)watchMyThread(uid);
    }catch(err){st.textContent=err&&err.code==='auth/operation-not-allowed'?'المراسلة غير مفعّلة في إعدادات الموقع بعد.':errText(err);}
  };
}
function drawMsgs(host,msgs,mine){
  if(!host)return;if(!msgs.length)return;
  host.innerHTML=msgs.map(m=>{const own=mine?m.from==='s':m.from==='t';return `<div class="bub ${own?'s':'t'}"><small>${m.from==='t'?(mine?'الأستاذة':'أنتِ'):(mine?'أنت':esc(m._name||'الطالب'))} • ${fmtTs(m.ts)}</small>${esc(m.text)}</div>`;}).join('');
  host.scrollTop=host.scrollHeight;
}
function watchMyThread(uid){
  if(threadUnsub)threadUnsub();
  threadUnsub=db.collection('inbox').doc(uid).collection('msgs').orderBy('ts').limitToLast(100)
    .onSnapshot(s=>drawMsgs($('#myThread'),s.docs.map(d=>d.data()),true),()=>{});
}

/* ---------- teacher panel ---------- */
let inboxUnsub=null,inboxDocs=[],openThread=null,openUnsub=null;
function renderTeacher(){
  const v=$('#v-teacher');
  if(!B.authReady){v.innerHTML='<p class="card empty">جارٍ التحقق…</p>';return;}
  if(!B.teacher){
    const signedOther=B.user&&!B.user.isAnonymous;
    v.innerHTML=`<span class="kick">لوحة التحكم</span><h1 class="h1">تسجيل الدخول</h1>
      ${signedOther?`<p class="lede">الحساب <span dir="ltr">${esc(B.user.email)}</span> لا يملك صلاحية الدخول إلى لوحة التحكم. اطلب من المدير منحك الصلاحية. <button class="btn sm" type="button" id="lOut">تسجيل الخروج</button></p>`:''}
      <form class="card tform" id="loginForm" style="max-width:440px">
        <label>البريد الإلكتروني<input id="lEmail" type="email" autocomplete="username" required dir="ltr"></label>
        <label>كلمة المرور<input id="lPass" type="password" autocomplete="current-password" required dir="ltr"></label>
        <div class="row"><button class="btn pri">دخول</button><button class="btn" type="button" id="lReset">نسيت كلمة المرور</button></div><span class="count" id="lSt" role="status"></span>
      </form>`;
    const st=$('#lSt'),lo=$('#lOut');if(lo)lo.onclick=()=>auth.signOut();
    $('#loginForm').onsubmit=async e=>{e.preventDefault();st.textContent='جارٍ الدخول…';
      try{await auth.signInWithEmailAndPassword($('#lEmail').value.trim(),$('#lPass').value);st.textContent='';}
      catch(err){st.textContent={'auth/invalid-credential':'البريد أو كلمة المرور غير صحيحة.','auth/wrong-password':'البريد أو كلمة المرور غير صحيحة.','auth/user-not-found':'البريد أو كلمة المرور غير صحيحة.','auth/too-many-requests':'محاولات كثيرة، انتظري قليلًا ثم أعيدي.','auth/network-request-failed':'لا يوجد اتصال بالإنترنت.'}[err.code]||'تعذّر تسجيل الدخول.';}};
    $('#lReset').onclick=async()=>{const em=$('#lEmail').value.trim();if(!em){st.textContent='اكتبي البريد الإلكتروني أولًا.';return;}
      try{await auth.sendPasswordResetEmail(em);st.textContent='أُرسل رابط تغيير كلمة المرور إلى بريدك.';}catch(err){st.textContent='تعذّر إرسال الرابط.';}};
    return;
  }
  const g0=ss.get('rm-tg')||grade(),p=S.participants[g0]||{};
  v.innerHTML=`<span class="kick">لوحة التحكم • ${ROLE[B.role]||''}</span><h1 class="h1">أهلًا ${esc(B.name||'بك')}</h1>
    <p class="lede">كل ما تحفظينه هنا يُخزَّن في قاعدة البيانات ويظهر لجميع الطلاب فورًا.</p>
    <div class="tgrid">
    <section class="card tform"><h2 class="ctitle"><span class="ci">🏅</span>المشاركون في درس اليوم</h2>
      <div class="seg" id="tg" role="group" aria-label="الصف">${['3','1'].map(x=>`<button type="button" data-v="${x}" aria-pressed="${x===g0}">${GR[x]}</button>`).join('')}</div>
      <div class="two"><label>تاريخ الدرس<input id="pDate" type="date" value="${esc(p.date||todayISO())}"></label><label>عنوان الدرس<input id="pLesson" maxlength="80" placeholder="مثال: قانون أوم" value="${esc(p.lesson||'')}"></label></div>
      <label>أسماء المشاركين (كل اسم في سطر)<textarea id="pNames" rows="7" placeholder="علي حسين&#10;زهراء كريم&#10;…">${esc((p.names||[]).join('\n'))}</textarea></label>
      <div class="row"><button class="btn pri" id="pSave" type="button">حفظ ونشر على الواجهة</button><button class="btn" id="pToday" type="button">قائمة جديدة لليوم</button><button class="btn danger" id="pClear" type="button"${(p.names||[]).length?'':' disabled'}>🗑 مسح المشاركين</button><span class="count" id="pSt" role="status"></span></div>
    </section>
    <section class="card tform"><h2 class="ctitle"><span class="ci">📢</span>تبليغ جديد للطلاب</h2>
      <label>العنوان<input id="aTitle" maxlength="90" placeholder="مثال: امتحان الفصل الثالث يوم الأحد"></label>
      <label>التفاصيل<textarea id="aBody" rows="4" maxlength="1200" placeholder="اكتبي التفاصيل…"></textarea></label>
      <div class="two"><label>يظهر لـ<select id="aGrade"><option value="all">كل الصفوف</option><option value="3">الثالث المتوسط</option><option value="1">الأول المتوسط</option></select></label><label class="chk"><input id="aPin" type="checkbox"> تثبيت في الأعلى</label></div>
      <div class="row"><button class="btn pri" id="aSave" type="button">نشر التبليغ</button><span class="count" id="aSt" role="status"></span></div>
    </section>
    <section class="card tform"><h2 class="ctitle"><span class="ci">✉️</span>مراسلة الطلاب للأستاذة</h2>
      <label class="switch"><input type="checkbox" id="sMsgs" ${S.settings.studentMsgs?'checked':''}><span class="tr" aria-hidden="true"></span><span>السماح للطلاب بمراسلتي</span></label>
      <p class="count">عند الإيقاف تختفي خانة الإرسال عند الطلاب، وتبقى التبليغات ظاهرة.</p><span class="count" id="sSt" role="status"></span>
    </section>
    <section class="card tform"><h2 class="ctitle"><span class="ci">📚</span>المادة الدراسية</h2>
      <p class="count" id="cInfo">الفصول المرفوعة: ${ar((window.__DATA__.chapters||[]).length)}</p>
      <label>رفع ملف المادة (JSON)<input id="cFile" type="file" accept="application/json,.json"></label>
      <p class="count">يُستعمل لرفع مادة الفصول والأسئلة الوزارية إلى قاعدة البيانات أو تحديثها (مثل ملف <span dir="ltr">seed/chapters-g3.json</span>).</p>
      <span class="count" id="cSt" role="status"></span>
    </section>
    <section class="card tform" id="codesSec"><h2 class="ctitle"><span class="ci">🔐</span>رموز الصفوف</h2>
      ${['3','1'].map(g=>`<div class="coderow" data-g="${g}"><b>${GR[g]}</b><span class="cur" dir="ltr">…</span>
        <div class="row"><input maxlength="20" dir="ltr" placeholder="رمز جديد" aria-label="رمز جديد لصف ${GR[g]}"><button type="button" class="btn sm" data-gen>توليد</button><button type="button" class="btn sm pri" data-save>حفظ</button><button type="button" class="btn sm danger" data-open>فتح للجميع</button></div></div>`).join('')}
      <p class="count">بلا رمز تبقى مادة الصف مفتوحة للجميع. عند وضع رمز أو تغييره يُطلب من كل طالب إدخال الرمز الحالي مرة واحدة على جهازه.</p>
      <span class="count" id="ccSt" role="status"></span>
    </section>
    <section class="card tform"><h2 class="ctitle"><span class="ci">📄</span>الملزمة PDF <small>للكادر فقط</small></h2>
      <p class="count" id="fInfo">جارٍ التحقق…</p>
      <div class="row"><button class="btn pri" id="fGet" type="button" hidden>تنزيل الملزمة</button><span class="count" id="fSt" role="status"></span></div>
      <label>رفع الملزمة أو استبدالها (PDF)<input id="fFile" type="file" accept="application/pdf,.pdf"></label>
      <p class="count">الملف محفوظ في قاعدة البيانات ولا يستطيع الطلاب الوصول إليه.</p>
    </section>
    ${B.admin?`<section class="card tform wide" id="staffSec"><h2 class="ctitle"><span class="ci">👥</span>إدارة المستخدمين <small>للمدير فقط</small></h2>
      <form id="uForm" class="tform" autocomplete="off">
        <div class="two"><label>الاسم<input id="uName" maxlength="60" required placeholder="مثال: الأستاذة روان محمد"></label><label>الصلاحية<select id="uRole"><option value="teacher">أستاذ/ة: المحتوى والتبليغات والرسائل</option><option value="admin">مدير: كل شيء + إدارة المستخدمين</option></select></label></div>
        <div class="two"><label>البريد الإلكتروني<input id="uEmail" type="email" required dir="ltr" autocomplete="off"></label><label>كلمة المرور (٨ أحرف على الأقل)<input id="uPass" type="text" minlength="8" dir="ltr" autocomplete="new-password" placeholder="اتركها فارغة إذا كان الحساب موجودًا"></label></div>
        <div class="row"><button class="btn pri" type="submit">إنشاء المستخدم</button><span class="count" id="uSt" role="status"></span></div>
      </form>
      <div id="staffList" class="stafflist"></div>
    </section>`:''}
    <section class="card tform wide"><h2 class="ctitle"><span class="ci">📥</span>رسائل الطلاب <small id="inCount"></small></h2><div id="inbox"></div></section>
    <section class="tform wide"><h2 class="sec-title" style="margin-top:6px">التبليغات المنشورة (${ar(S.announcements.length)})</h2>
      <div class="annlist">${S.announcements.length?S.announcements.map(a=>annCard(a,true)).join(''):'<p class="card empty">لا توجد تبليغات بعد.</p>'}</div></section>
    </div><p class="footer">مسجّلة باسم <span dir="ltr">${esc(B.user.email)}</span> <button class="btn sm" id="tOut" type="button">تسجيل الخروج</button></p>`;
  $$('#tg button').forEach(b=>b.onclick=()=>{ss.set('rm-tg',b.dataset.v);renderTeacher();});
  $('#pToday').onclick=()=>{$('#pDate').value=todayISO();$('#pLesson').value='';$('#pNames').value='';$('#pNames').focus();};
  $('#pClear').onclick=async()=>{
    if(!confirm(`مسح أسماء المشاركين من واجهة ${GR[g0]}؟`))return;const st=$('#pSt');st.textContent='جارٍ المسح…';
    try{await db.collection('participants').doc(g0).delete();toast('مُسحت أسماء المشاركين ✔');}catch(e){st.textContent=errText(e);}
  };
  $('#pSave').onclick=async()=>{
    const names=[...new Set($('#pNames').value.split(/\n|،|,/).map(s=>s.trim().slice(0,40)).filter(Boolean))].slice(0,80),st=$('#pSt');
    st.textContent='جارٍ الحفظ…';
    try{await db.collection('participants').doc(g0).set({date:$('#pDate').value||todayISO(),lesson:$('#pLesson').value.trim().slice(0,80),names,updated:Date.now()});toast('حُفظت قائمة المشاركين ✔');}
    catch(e){st.textContent=errText(e);}
  };
  $('#aSave').onclick=async()=>{
    const title=$('#aTitle').value.trim(),st=$('#aSt');if(!title){st.textContent='اكتبي عنوان التبليغ';$('#aTitle').focus();return;}
    st.textContent='جارٍ النشر…';
    try{await db.collection('announcements').add({ts:Date.now(),title:title.slice(0,90),body:$('#aBody').value.trim().slice(0,1200),grade:$('#aGrade').value,pinned:$('#aPin').checked});toast('نُشر التبليغ ✔');}
    catch(e){st.textContent=errText(e);}
  };
  $$('[data-del]',v).forEach(b=>b.onclick=async()=>{if(!confirm('حذف هذا التبليغ؟'))return;try{await db.collection('announcements').doc(b.dataset.del).delete();toast('حُذف التبليغ');}catch(e){toast(errText(e));}});
  $('#sMsgs').onchange=async e=>{const on=e.target.checked;try{await db.collection('settings').doc('site').set({studentMsgs:on},{merge:true});toast(on?'فُتحت المراسلة للطلاب':'أُقفلت المراسلة');}catch(err){e.target.checked=!on;$('#sSt').textContent=errText(err);}};
  $('#cFile').onchange=e=>importChapters(e.target.files[0]);
  $('#tOut').onclick=()=>auth.signOut();
  if(B.admin){$('#uForm').onsubmit=createStaff;watchStaff();}
  $('#fFile').onchange=e=>uploadPdf(e.target.files[0]);
  $('#fGet').onclick=downloadPdf;
  wireCodes();
  pdfInfo();
  watchInbox();
}
/* ---------- teacher-only PDF: stored as base64 chunks in private_files/malzama/chunks ---------- */
const PDF=db.collection('private_files').doc('malzama'),CHUNK=700000;
const kb=n=>ar((n/1048576).toFixed(1))+' ميغابايت';
async function pdfInfo(){
  const info=$('#fInfo'),get=$('#fGet');if(!info)return;
  try{const s=await PDF.get();
    if(s.exists){const d=s.data();info.textContent=`الملف: ${d.name} • ${kb(d.size)} • آخر تحديث ${fmtTs(d.updated)}`;get.hidden=false;}
    else{info.textContent='لم تُرفع الملزمة بعد.';get.hidden=true;}}
  catch(e){info.textContent=errText(e);}
}
function b64(buf){let s='';const u=new Uint8Array(buf);for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s);}
async function uploadPdf(file){
  const st=$('#fSt');if(!file)return;
  if(file.type&&file.type!=='application/pdf'){st.textContent='اختاري ملف PDF.';return;}
  if(file.size>40*1048576){st.textContent='حجم الملف أكبر من ٤٠ ميغابايت.';return;}
  try{
    const data=b64(await file.arrayBuffer()),n=Math.ceil(data.length/CHUNK),old=await PDF.get();
    for(let k=0;k<n;k++){st.textContent=`جارٍ الرفع… ${ar(Math.round(k/n*100))}٪`;await PDF.collection('chunks').doc(String(k)).set({d:data.slice(k*CHUNK,(k+1)*CHUNK)});}
    await PDF.set({name:file.name.slice(0,120),size:file.size,chunks:n,updated:Date.now()});
    const was=old.exists?old.data().chunks||0:0;for(let k=n;k<was;k++)await PDF.collection('chunks').doc(String(k)).delete();
    st.textContent='رُفعت الملزمة ✔';$('#fFile').value='';pdfInfo();
  }catch(e){st.textContent=errText(e);}
}
async function downloadPdf(){
  const st=$('#fSt');
  try{
    const m=await PDF.get();if(!m.exists)return;const d=m.data(),parts=[];
    for(let k=0;k<d.chunks;k++){st.textContent=`جارٍ التنزيل… ${ar(Math.round(k/d.chunks*100))}٪`;const c=await PDF.collection('chunks').doc(String(k)).get();parts.push(c.data().d);}
    const bin=atob(parts.join('')),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
    const url=URL.createObjectURL(new Blob([u],{type:'application/pdf'})),a=document.createElement('a');
    a.href=url;a.download=d.name||'malzama.pdf';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
    st.textContent='';
  }catch(e){st.textContent=errText(e);}
}
/* ---------- user management (admins) ---------- */
let staffUnsub=null,staffDocs=[],creator=null;
function creatorAuth(){
  if(!creator){creator=firebase.initializeApp(window.FIREBASE_CONFIG,'creator');
    const a=creator.auth();if(CFG.emulators)a.useEmulator('http://127.0.0.1:9099',{disableWarnings:true});}
  return creator.auth();
}
async function createStaff(e){
  e.preventDefault();
  const st=$('#uSt'),name=$('#uName').value.trim().slice(0,60),email=$('#uEmail').value.trim().toLowerCase(),pass=$('#uPass').value,role=$('#uRole').value;
  if(!name||!email)return;
  if(email===OWNER){st.textContent='هذا هو حساب المالك، وصلاحيته ثابتة.';return;}
  st.textContent='جارٍ الإنشاء…';let made=false;
  try{
    if(pass){
      if(pass.length<8){st.textContent='كلمة المرور يجب أن تكون ٨ أحرف على الأقل.';return;}
      const a=creatorAuth();await a.setPersistence(firebase.auth.Auth.Persistence.NONE);
      try{await a.createUserWithEmailAndPassword(email,pass);made=true;}
      catch(err){if(err.code!=='auth/email-already-in-use')throw err;}
      finally{a.signOut().catch(()=>{});}
    }
    await db.collection('staff').doc(email).set({name,role,email,by:B.user.email.toLowerCase(),updated:Date.now()});
    $('#uForm').reset();
    st.textContent=made?`أُنشئ الحساب ومُنح صلاحية ${ROLE[role]} ✔`:`مُنحت صلاحية ${ROLE[role]} للحساب ✔ (الحساب كان موجودًا${pass?'، ولم تتغير كلمة مروره':''})`;
  }catch(err){st.textContent={'auth/invalid-email':'البريد الإلكتروني غير صحيح.','auth/weak-password':'كلمة المرور ضعيفة.','auth/operation-not-allowed':'الدخول بالبريد غير مفعّل في Firebase.','permission-denied':'لا تملك صلاحية إدارة المستخدمين.'}[err.code]||errText(err);}
}
function watchStaff(){
  if(staffUnsub){drawStaff();return;}
  staffUnsub=db.collection('staff').onSnapshot(s=>{staffDocs=s.docs.map(d=>({id:d.id,...d.data()}));drawStaff();},()=>{const h=$('#staffList');if(h)h.innerHTML='<p class="empty-mini">تعذّر تحميل المستخدمين.</p>';});
}
function drawStaff(){
  const h=$('#staffList');if(!h)return;const me=B.user.email.toLowerCase();
  const rows=[{id:OWNER,name:'المالك',role:'admin',owner:true}].concat(staffDocs.filter(d=>d.id!==OWNER).sort((a,b)=>(a.role>b.role?1:-1)||(a.name||'').localeCompare(b.name||'')));
  h.innerHTML=`<table class="cmp stafftab"><thead><tr><th>الاسم</th><th>البريد</th><th>الصلاحية</th><th></th></tr></thead><tbody>${rows.map(r=>`<tr data-id="${esc(r.id)}">
    <td>${esc(r.name||'')}${r.id===me?' <span class="tag">أنت</span>':''}</td><td dir="ltr">${esc(r.id)}</td>
    <td>${r.owner?'<span class="tag" style="--gc:#ffc65c">مالك (ثابت)</span>':`<select class="rsel" aria-label="الصلاحية"${r.id===me?' disabled':''}><option value="teacher"${r.role==='teacher'?' selected':''}>أستاذ/ة</option><option value="admin"${r.role==='admin'?' selected':''}>مدير</option></select>`}</td>
    <td class="acts"><button type="button" class="btn sm" data-reset>إعادة تعيين كلمة المرور</button>${r.owner||r.id===me?'':'<button type="button" class="btn sm danger" data-rm>إلغاء الصلاحية</button>'}</td></tr>`).join('')}</tbody></table>
    <p class="count">إلغاء الصلاحية يمنع الحساب فورًا من لوحة التحكم. «إعادة تعيين كلمة المرور» يرسل رابطًا إلى بريد المستخدم.</p>`;
  $$('tr[data-id]',h).forEach(tr=>{
    const id=tr.dataset.id,sel=$('.rsel',tr),rm=$('[data-rm]',tr);
    if(sel)sel.onchange=async()=>{try{await db.collection('staff').doc(id).update({role:sel.value,by:me,updated:Date.now()});toast('تغيّرت الصلاحية ✔');}catch(e){toast(errText(e));drawStaff();}};
    if(rm)rm.onclick=async()=>{if(!confirm('إلغاء صلاحية '+id+'؟'))return;try{await db.collection('staff').doc(id).delete();toast('أُلغيت الصلاحية');}catch(e){toast(errText(e));}};
    $('[data-reset]',tr).onclick=async()=>{try{await auth.sendPasswordResetEmail(id);toast('أُرسل رابط تغيير كلمة المرور إلى '+id);}catch(e){toast(e.code==='auth/user-not-found'?'لا يوجد حساب بهذا البريد.':'تعذّر إرسال الرابط.');}};
  });
}

/* ---------- class codes ---------- */
const CODE_CH='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const normCode=c=>String(c||'').trim().toUpperCase().replace(/\s+/g,'');
function wireCodes(){
  const st=$('#ccSt');
  $$('#codesSec .coderow').forEach(row=>{
    const g=row.dataset.g,cur=$('.cur',row),inp=$('input',row),ref=db.collection('classcodes').doc(g);
    const show=()=>ref.get().then(d=>{cur.textContent=d.exists?d.data().code:'مفتوح للجميع (بلا رمز)';cur.classList.toggle('open',!d.exists);}).catch(()=>{cur.textContent='—';});
    show();
    $('[data-gen]',row).onclick=()=>{let c='';const a=new Uint32Array(6);crypto.getRandomValues(a);a.forEach(x=>c+=CODE_CH[x%CODE_CH.length]);inp.value=c;};
    $('[data-save]',row).onclick=async()=>{const c=normCode(inp.value);if(c.length<4){st.textContent='الرمز يجب أن يكون ٤ أحرف على الأقل.';inp.focus();return;}
      try{await ref.set({code:c,updated:Date.now()});inp.value='';show();st.textContent=`حُفظ رمز ${GR[g]}: ${c}`;toast('حُفظ رمز الصف ✔');}catch(e){st.textContent=errText(e);}};
    $('[data-open]',row).onclick=async()=>{if(!confirm(`فتح مادة ${GR[g]} للجميع بلا رمز؟`))return;try{await ref.delete();show();toast('أصبحت المادة مفتوحة للجميع');}catch(e){st.textContent=errText(e);}};
  });
}
document.addEventListener('submit',async e=>{
  const f=e.target.closest&&e.target.closest('.lockform');if(!f)return;e.preventDefault();
  const g=f.dataset.g,code=normCode(f.elements.code.value),st=$('.lf-st',f),btn=$('button',f);if(!code)return;
  st.textContent='جارٍ التحقق…';btn.disabled=true;
  try{
    if(!auth.currentUser)await auth.signInAnonymously();
    await db.collection('access').doc(auth.currentUser.uid).collection('grades').doc(g).set({code,at:Date.now()});
    st.textContent='تم ✔ جارٍ فتح المادة…';setTimeout(()=>location.reload(),600);
  }catch(err){btn.disabled=false;st.textContent=err&&err.code==='permission-denied'?'الرمز غير صحيح. تأكد منه واطلبه من الأستاذة.':err&&err.code==='auth/operation-not-allowed'?'الدخول غير مفعّل في إعدادات الموقع.':errText(err);}
});

async function importChapters(file){
  const st=$('#cSt');if(!file)return;
  try{
    const J=JSON.parse(await file.text()),list=Array.isArray(J)?J:J.chapters;
    if(!Array.isArray(list)||!list.length)throw new Error('format');
    const keys=['i','grade','style','title','num','lead','goals','content','wz','hero','topics','ans'];
    st.textContent='جارٍ الرفع…';
    for(let k=0;k<list.length;k+=20){
      const b=db.batch();
      list.slice(k,k+20).forEach(c=>{const g=String(c.grade||'3'),d={};keys.forEach(x=>{if(c[x]!=null)d[x]=c[x];});d.grade=g;d.i=+c.i;
        b.set(db.collection('chapters').doc(`g${g}-ch${String(c.i).padStart(2,'0')}`),d);});
      await b.commit();
    }
    const n=list.length;st.textContent=`رُفع${n>2&&n<11?'ت':''} ${ar(n)} ${n>2&&n<11?'فصول':'فصلًا'} ✔ سيُعاد تحميل الصفحة…`;setTimeout(()=>location.reload(),1500);
  }catch(e){st.textContent=e.message==='format'?'الملف غير صالح: يجب أن يحتوي على قائمة الفصول.':errText(e);}
}
function watchInbox(){
  const host=$('#inbox');if(!host)return;
  if(inboxUnsub){drawInbox();return;}
  inboxUnsub=db.collection('inbox').orderBy('updated','desc').limit(100).onSnapshot(s=>{inboxDocs=s.docs.map(d=>({id:d.id,...d.data()}));drawInbox();},()=>{const h=$('#inbox');if(h)h.innerHTML='<p class="empty-mini">تعذّر تحميل الرسائل.</p>';});
}
function drawInbox(){
  const host=$('#inbox');if(!host)return;
  const docs=inboxDocs,un=docs.filter(d=>d.unread).length;
  const c=$('#inCount');if(c)c.textContent=docs.length?`${ar(docs.length)} محادثة${un?' • '+ar(un)+' جديدة':''}`:'';
  if(!docs.length){host.innerHTML=`<p class="empty-mini">${S.settings.studentMsgs?'لا توجد رسائل بعد.':'المراسلة مقفلة، افتحيها من الخيار أعلاه ليتمكن الطلاب من مراسلتك.'}</p>`;return;}
  host.innerHTML=docs.map(d=>`<details class="convo${d.unread?' new':''}" data-id="${esc(d.id)}"${d.id===openThread?' open':''}><summary><b>${esc(d.name||'طالب')}</b><span class="tag" style="--gc:${d.grade==='1'?'#3ee8b0':'#7c9cff'}">${GR[d.grade]||''}</span><small>${fmtTs(d.updated)}</small>${d.unread?'<span class="dot" aria-label="جديدة"></span>':''}</summary>
    <div class="thread"><p class="empty-mini">جارٍ التحميل…</p></div>
    <form class="msgform reply"><textarea required rows="2" maxlength="600" placeholder="ردّك…" aria-label="الرد"></textarea><div class="row"><button class="btn pri sm">إرسال الرد</button><span class="count" role="status"></span></div></form></details>`).join('');
  $$('.convo',host).forEach(el=>{
    const d=docs.find(x=>x.id===el.dataset.id);
    if(el.open)openConvo(el,d);
    el.addEventListener('toggle',()=>{if(el.open){$$('.convo[open]',host).forEach(o=>{if(o!==el)o.open=false;});openConvo(el,d);}else if(openThread===d.id){openThread=null;if(openUnsub){openUnsub();openUnsub=null;}}});
    $('form',el).onsubmit=async e=>{e.preventDefault();const ta=$('textarea',el),st=$('.count',el);const text=ta.value.trim().slice(0,600);if(!text)return;st.textContent='جارٍ الإرسال…';
      try{const ts=Date.now(),th=db.collection('inbox').doc(d.id),b=db.batch();b.set(th.collection('msgs').doc(),{from:'t',text,ts});b.update(th,{updated:ts,unread:false});await b.commit();ta.value='';}
      catch(err){st.textContent=errText(err);}};
  });
}
function openConvo(el,d){
  openThread=d.id;if(openUnsub)openUnsub();
  openUnsub=db.collection('inbox').doc(d.id).collection('msgs').orderBy('ts').limitToLast(100)
    .onSnapshot(s=>drawMsgs($('.thread',el),s.docs.map(x=>({...x.data(),_name:d.name})),false),()=>{});
  if(d.unread)db.collection('inbox').doc(d.id).update({unread:false}).catch(()=>{});
}

/* ---------- wiring ---------- */
function renderAll(){
  const t=$('#navTeacher');if(t)t.hidden=!B.teacher;
  const tl=$('#teacherLogin');if(tl)tl.hidden=B.teacher;
  badge();renderHome();
}
let curView='';
function refreshView(){
  renderAll();
  if(curView==='board')renderBoard();
  if(curView==='teacher')renderTeacher();
}
window.CLASS={
  views:{board:renderBoard,teacher:renderTeacher},
  onRoute(h){curView=h;if(h!=='board'){if(threadUnsub){threadUnsub();threadUnsub=null;}msgBoxMode='';}
    if(h!=='teacher'){if(inboxUnsub){inboxUnsub();inboxUnsub=null;}if(openUnsub){openUnsub();openUnsub=null;}openThread=null;}
    renderAll();},
  init(){
    renderAll();
    const tl=$('#teacherLogin');if(tl)tl.onclick=()=>{location.hash='teacher';};
    db.collection('settings').doc('site').onSnapshot(s=>{S.settings=Object.assign({studentMsgs:false},s.exists?s.data():{});refreshView();},()=>{});
    // participants & announcements: what each viewer may read depends on staff role / class codes
    let subs=[],subKey='';
    function subscribe(){
      const key=(B.teacher?'T':'S')+(B.user?B.user.uid:'-');if(key===subKey)return;subKey=key;
      subs.forEach(u=>u());subs=[];S.participants={};S.announcements=[];S.loaded=false;
      let pending=2;const done=()=>{if(--pending<=0)S.loaded=true;refreshView();};
      ['3','1'].forEach(g=>{let first=true;subs.push(db.collection('participants').doc(g).onSnapshot(d=>{PLOCK[g]=false;if(d.exists)S.participants[g]=d.data();else delete S.participants[g];if(first){first=false;done();}else refreshView();},
        err=>{if(err&&err.code==='permission-denied')PLOCK[g]=true;if(first){first=false;done();}else refreshView();}));});
      const parts={},merge=()=>{const m=new Map();Object.values(parts).forEach(l=>l.forEach(a=>m.set(a.id,a)));S.announcements=[...m.values()].sort((a,b)=>b.ts-a.ts);refreshView();};
      const q=B.teacher?{all:db.collection('announcements').orderBy('ts','desc').limit(60)}
        :{g3:db.collection('announcements').where('grade','==','3'),g1:db.collection('announcements').where('grade','==','1'),ga:db.collection('announcements').where('grade','==','all')};
      Object.entries(q).forEach(([k,qq])=>subs.push(qq.onSnapshot(s=>{parts[k]=s.docs.map(d=>({id:d.id,...d.data()}));merge();},()=>{parts[k]=[];merge();})));
    }
    let roleUnsub=null,wasTeacher=null;
    const applyRole=(role,name)=>{B.role=role;B.admin=role==='admin';B.teacher=role==='admin'||role==='teacher';B.name=name||'';
      // material is fetched once at start-up: after staff log out, reload so code-protected material leaves the page;
      // after staff log in, reload to fetch material that was locked for the visitor
      if(wasTeacher===true&&!B.teacher){location.reload();return;}
      if(wasTeacher===false&&B.teacher&&Object.values(window.__DATA__.locked||{}).some(Boolean)){location.reload();return;}
      wasTeacher=B.teacher;subscribe();
      if(!B.teacher&&inboxUnsub){inboxUnsub();inboxUnsub=null;}
      if(!B.admin&&staffUnsub){staffUnsub();staffUnsub=null;}
      B.authReady=true;msgBoxMode='';refreshView();};
    auth.onAuthStateChanged(u=>{
      B.user=u;if(roleUnsub){roleUnsub();roleUnsub=null;}
      const em=u&&!u.isAnonymous&&u.email?u.email.toLowerCase():'';
      if(!em){applyRole('','');return;}
      if(em===OWNER){applyRole('admin','');return;}
      B.authReady=false;refreshView();
      roleUnsub=db.collection('staff').doc(em).onSnapshot(s=>{const d=s.exists?s.data():{};applyRole(d.role==='admin'||d.role==='teacher'?d.role:'',d.name);},()=>applyRole('',''));
    });
  }
};
})();

/* ---------- decorative motion: particle background, count-up stats, scroll reveal ---------- */
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const {ar,$,$$}=window.APP;

/* particle field behind the page (home only) */
const cv=document.createElement('canvas');cv.id='bgfx';cv.setAttribute('aria-hidden','true');document.body.prepend(cv);
const g=cv.getContext('2d');let W=0,Hh=0,P=[],run=false,raf=0,mx=-1e4,my=-1e4,last=0;
const COLS=['124,156,255','62,224,240','177,140,255','255,107,146'];
function size(){const d=Math.min(2,devicePixelRatio||1);W=innerWidth;Hh=innerHeight;cv.width=W*d;cv.height=Hh*d;g.setTransform(d,0,0,d,0,0);
  const n=Math.round(Math.min(90,W*Hh/16000));P=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*Hh,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.8+.6,c:COLS[Math.random()*COLS.length|0],p:Math.random()*6.28}));}
function frame(t){
  if(!run)return;raf=requestAnimationFrame(frame);
  if(t-last<33)return;const dt=Math.min(3,(t-last)/16.7||1);last=t;
  g.clearRect(0,0,W,Hh);
  for(const a of P){
    const dx=a.x-mx,dy=a.y-my,d2=dx*dx+dy*dy;
    if(d2<14000){const f=(14000-d2)/14000*.6;a.vx+=dx/Math.sqrt(d2+1)*f*.08;a.vy+=dy/Math.sqrt(d2+1)*f*.08;}
    a.vx*=.985;a.vy*=.985;if(Math.abs(a.vx)<.05)a.vx+=(Math.random()-.5)*.02;if(Math.abs(a.vy)<.05)a.vy+=(Math.random()-.5)*.02;
    a.x+=a.vx*dt;a.y+=a.vy*dt;a.p+=.03*dt;
    if(a.x<-10)a.x=W+10;if(a.x>W+10)a.x=-10;if(a.y<-10)a.y=Hh+10;if(a.y>Hh+10)a.y=-10;
  }
  for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j],dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy;
    if(d2<12000){g.strokeStyle=`rgba(124,156,255,${(1-d2/12000)*.16})`;g.lineWidth=1;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();}}
  for(const a of P){const s=.55+.45*Math.sin(a.p);g.fillStyle=`rgba(${a.c},${.35+.45*s})`;g.beginPath();g.arc(a.x,a.y,a.r*(.8+.4*s),0,7);g.fill();}
}
function setRun(on){on=on&&!RM&&!document.hidden;if(on===run)return;run=on;if(on){last=0;raf=requestAnimationFrame(frame);}else{cancelAnimationFrame(raf);g.clearRect(0,0,W,Hh);}}
const onHome=()=>{const h=(location.hash||'#home').slice(1);return h===''||h==='home';};
size();addEventListener('resize',()=>{size();});
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;},{passive:true});
addEventListener('pointerleave',()=>{mx=my=-1e4;});
document.addEventListener('visibilitychange',()=>setRun(onHome()));
addEventListener('hashchange',()=>setRun(onHome()));
setRun(onHome());

/* count-up stats (they keep their Arabic digits and "+" sign) */
const toNum=s=>+String(s).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[^\d]/g,'');
function countUp(el){
  const txt=el.textContent,n=toNum(txt);if(!n||RM)return;const plus=txt.trim().startsWith('+');
  const t0=performance.now(),dur=1400;
  (function step(t){const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=(plus?'+':'')+ar(Math.round(n*e));if(k<1)requestAnimationFrame(step);else el.textContent=txt;})(t0);
}
const statIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){statIO.unobserve(e.target);setTimeout(()=>countUp(e.target),150);}}),{threshold:.6});
setTimeout(()=>$$('.stat b').forEach(b=>statIO.observe(b)),0);

/* reveal cards on scroll */
const rev=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rev.unobserve(e.target);}}),{rootMargin:'0px 0px -40px 0px'});
function watch(root){if(RM)return;$$('.stat,.gcard,.chcard',root||document).forEach((el,i)=>{if(el.dataset.rv)return;el.dataset.rv=1;el.classList.add('rv');el.style.setProperty('--rv',(i%6)*70+'ms');rev.observe(el);});}
watch();
new MutationObserver(ms=>{if(ms.some(m=>m.addedNodes.length))watch();}).observe($('main'),{childList:true,subtree:true});
})();

LABINIT();CLASS.init();APP.route();
};
