import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentChannel = null;

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = 'login.html';
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  const data = userDoc.data();
  document.getElementById('userPfp').src = data.photoURL || 'https://via.placeholder.com/40';
  document.getElementById('userDisplay').innerText = data.displayName;
  document.getElementById('userPfp').onclick = () => location.href = 'profile.html';
  loadChannels();
});

window.createChannel = async () => {
  const name = document.getElementById('newChannelInput').value;
  if (!name) return;
  await addDoc(collection(db, 'channels'), { name });
  document.getElementById('newChannelInput').value = '';
};

async function loadChannels() {
  const channelsContainer = document.getElementById('channels');
  const snap = await getDocs(collection(db, 'channels'));
  snap.forEach(docSnap => {
    const div = document.createElement('div');
    div.innerText = '#' + docSnap.data().name;
    div.onclick = () => switchChannel(docSnap.id, docSnap.data().name);
    channelsContainer.appendChild(div);
  });
}

function switchChannel(id, name) {
  currentChannel = id;
  document.getElementById('channelName').innerText = '#' + name;
  const msgContainer = document.getElementById('messages');
  msgContainer.innerHTML = '';

  const q = query(collection(db, 'channels', id, 'messages'), orderBy('timestamp'));
  onSnapshot(q, snap => {
    msgContainer.innerHTML = '';
    snap.forEach(doc => {
      const msg = doc.data();
      const div = document.createElement('div');
      div.innerText = `${msg.username || msg.uid}: ${msg.text}`;
      div.onclick = () => viewUser(msg.uid);
      msgContainer.appendChild(div);
    });
  });
}

window.sendMessage = async () => {
  const text = document.getElementById('messageInput').value;
  if (!text || !currentChannel) return;
  const user = auth.currentUser;
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  await addDoc(collection(db, 'channels', currentChannel, 'messages'), {
    text,
    uid: user.uid,
    username: userDoc.data().displayName,
    timestamp: serverTimestamp()
  });
  document.getElementById('messageInput').value = '';
};

async function viewUser(uid) {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (docSnap.exists()) {
    const data = docSnap.data();
    alert(`Username: ${data.username}\nDisplay Name: ${data.displayName}`);
  }
}
