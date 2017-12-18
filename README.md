## FireStore Todo App
This the basic todo app created using firestore.
And also this app has a script file which helps you to push .json file directly to your firestore
i.e `node json-to-firestore.js`

# Make Sure you have these things
1. `GoogleService-Info.plist` file in iOS/yourAppName/ folder.
 if not download it from your firebase or follow this link https://support.google.com/firebase/answer/7015592?hl=en
2. Make sure you have serviceAccount for sending .json file to firestore if not you can follow this link https://hackernoon.com/filling-cloud-firestore-with-data-3f67d26bd66e

## iOS Setup
1. Clone the repo.
2. Do npm install.
3. Go to iOS folder, then -> run `pod install`.
4. Go back to your repo i.e `cd ..`.
5. run command `react-native link`.
6. run comman `react-native run-ios`.

