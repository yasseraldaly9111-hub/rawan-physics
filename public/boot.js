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
  // ننتظر معرفة المستخدم أولًا، ثم نجلب مادة كل صف على حدة (الصف المقفل برمز يُرفض من قاعدة البيانات)
  var D={all:[],chapters:[],locked:{}},started=false;
  function load(g){
    return db.collection('chapters').where('grade','==',g).get()
      .then(function(s){return s.docs.map(function(d){return d.data();});})
      .catch(function(e){if(e&&e.code==='permission-denied')D.locked[g]=true;else console.error(e);return [];});
  }
  var stop=auth.onAuthStateChanged(function(){
    if(started)return;started=true;stop();
    Promise.all([load('3'),load('1')]).then(function(r){
      D.all=r[0].concat(r[1]);D.chapters=r[0].sort(function(a,b){return a.i-b.i;});
      window.__DATA__=D;if(boot)boot.remove();window.RUNAPP();
    });
  });
})();
