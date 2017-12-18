const admin = require('./node_modules/firebase-admin');

const serviceAccount = require("./key/eCommerce-a75c2e5a680b.json");

const data = require("./data.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ecommerce-9f8a5.firebaseio.com"
});

// console.log(data, "YYO")

data && Object.keys(data).forEach(key => {
    const nestedContent = data[key];

    // console.log(nestedContent, typeof nestedContent, "YYo");

    if (typeof nestedContent === "object") {
        Object.keys(nestedContent).forEach(docTitle => {
            // console.log(nestedContent[docTitle], "OOPS")
            admin.firestore()
                .collection(key)
                .doc(docTitle)
                .set(nestedContent[docTitle])  //It should be a plain javascript object
                .then((res) => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        });
    }
});