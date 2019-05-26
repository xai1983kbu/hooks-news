In order to work with Firebase on server install firebase-tools
$yarn global add firebase-tools

$firebase login
$firebase init functions

Deploy with --only flag to specify that we only want to deploy functions folder
$firebase deploy --only functions

 https://us-central1-hooks-news-app-2b577.cloudfunctions.net/linksPagination


function/index.js
```
const functions = require('firebase-functions')
LINKS_PER_PAGE = 5

const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://hooks-news-app-2b577.firebaseio.com'
})
const db = admin.firestore()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.linksPagination = functions.https.onRequest((request, response) => {
  response.set('Access-Control-Allow-Origin', '*')
  let linksRef = db.collection('links')
  const offset = Number(request.query.offset)
  linksRef
    .orderBy('created', 'desc')
    .limit(LINKS_PER_PAGE)
    .offset(offset)
    .get()
    .then(snapshot => {
      const links = snapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() }
      })
      response.json(links)
    })
})
```