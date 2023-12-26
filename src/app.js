// import { log } from "console";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut
}from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAgY83mYkg3FJuUgSLaDAWlmwE-APr66P8",
  authDomain: "fir-practice-9cccc.firebaseapp.com",
  projectId: "fir-practice-9cccc",
  storageBucket: "fir-practice-9cccc.appspot.com",
  messagingSenderId: "525046612025",
  appId: "1:525046612025:web:2c607dc55cf11b079f0de8",
};

//   init the firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection refrence
const colRef = collection(db, "loginIDs");
// const q = query(colRef, where("name", "==", "fasiha"));
// real  time collection data
// getDocs(colRef)
//   .then((snapshots) => {
//     const loginIDS = [];
//     snapshots.docs.forEach((doc) => {
//       loginIDS.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(loginIDS);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

onSnapshot(colRef, (snapshots) => {
  const loginIDS = [];
  snapshots.docs.forEach((doc) => {
    loginIDS.push({ ...doc.data(), id: doc.id });
  });
  console.log(loginIDS);
});

const submitUser = document.querySelector(".add");
submitUser.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameOfUser = document.getElementById("name").value;
  const emailOfUser = document.getElementById("email").value;
  const passwordOfUser = document.getElementById("password").value;
  addDoc(colRef, {
    name: nameOfUser,
    email: emailOfUser,
    password: passwordOfUser,
  }).then(() => submitUser.reset());
});

const deleteUser = document.querySelector(".delete");
deleteUser.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("deleteID").value;
  const docRef = doc(db, "loginIDs", id);
  deleteDoc(docRef).then(() => deleteUser.reset());
});

const updateUser = document.querySelector(".update");
updateUser.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = updateUser.upemail.value;
  const queryEmail = query(colRef, where("email", "==", email));

  onSnapshot(queryEmail, (snapshots) => {
    let loginID;
    snapshots.docs.forEach((doc) => {
      loginID = doc.id;
    });
    console.log(loginID);
    const docRef = doc(db, "loginIDs", loginID);
    updateDoc(docRef, {
      password: updateUser.uppass.value,
    }).then(() => updateUser.reset());
  });
});

// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      signupForm.reset()
    })
   .catch(err => {
      console.log(err.message)
    })
})

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(()  => {
      loginForm.reset()
      window.location.href = 'login.html';
    })
    .catch(err => {
      console.log(err.message)
    })
})

// subscribing to auth changes
onAuthStateChanged(auth, (user) => {
  console.log('user status changed:', user)
})