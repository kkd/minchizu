console.log("--- 開始 ---" + Date.now());


const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyBo0bx6nzgBv9JDIIUNXDCRw_AH7PezWoo",
  authDomain: "minchizu-e6818.firebaseapp.com",
  databaseURL: "https://minchizu-e6818.firebaseio.com",
  projectId: "minchizu-e6818",
  storageBucket: "minchizu-e6818.appspot.com",
  messagingSenderId: "72268103386"
});

var db = firebase.firestore();
var totalcnt = 0;
var patchcnt = 0;

db.collection("OurMaps").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    totalcnt += 1;

    if (!doc.data().hasOwnProperty("oldFlg")){
      console.log(doc.id);
      patchcnt +=1;
      
      doc.ref.set({
          oldFlg: false,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }
  });

  console.log("--- 終了 ---" + Date.now());
  console.log("総件数　　：" + totalcnt + "件");
  console.log("パッチ件数：" + patchcnt + "件");  
  
});
