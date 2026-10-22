(function(){
  var C=window.FIREBASE_CONFIG||{},boot=document.getElementById('boot');
  function stop(html){if(boot)boot.innerHTML='<div class="bootmsg">'+html+'</div>';}
  if(!window.firebase){stop('<b>تعذّر تحميل مكتبة Firebase.</b><br>تأكد من رفع مجلد <span dir="ltr">vendor</span> كاملًا.');return;}
  if(!C.apiKey||!C.projectId||/YOUR|ضع/.test(C.apiKey+C.projectId)){stop('<b>المنصة غير مربوطة بقاعدة البيانات بعد.</b><br>ضع إعدادات مشروعك في ملف <span dir="ltr">firebase-config.js</span> كما في دليل التشغيل.');return;}
  firebase.initializeApp(C);
  var db=firebase.firestore(),auth=firebase.auth(),S=window.SITE_CONFIG||{};
  if(S.emulators){db.useEmulator('127.0.0.1',8080);auth.useEmulator('http://127.0.0.1:9099',{disableWarnings:true});}
  else db.enablePersistence({synchronizeTabs:true}).catch(function(){});
  window.FB={db:db,auth:auth};
  db.collection('chapters').get().then(function(s){
    var all=s.docs.map(function(d){return d.data();});
    window.__DATA__={all:all,chapters:all.filter(function(c){return c.grade==='3';}).sort(function(a,b){return a.i-b.i;})};
  }).catch(function(e){window.__DATA__={all:[],chapters:[]};console.error(e);})
  .then(function(){if(boot)boot.remove();window.RUNAPP();});
})();
