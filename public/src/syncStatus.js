
const lastOnline  = document.getElementById('lastOnline')
const lastSync = document.getElementById('lastSync')
const mandatorySync = document.getElementById('mandatorySync')

function updateOnlineTime(){
    if(navigator.onLine){
      const currentTime = new Date()
      localStorage.setItem('lastOnlineTime', currentTime)
      console.log("User is online")
    } else{
      console.log("User is offline")
    }
}
updateOnlineTime()
function getTimeAgo(timestamp){
    const currentTime = new Date();
    const timeDiff = currentTime - timestamp;
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
  
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} days ago`;
    }    
}

function displayLastTimeOnline(){
    const lastOnlineTimeStamp = localStorage.getItem('lastOnlineTime')
    if(lastOnlineTimeStamp){
      const lastOnlineTime = new Date(lastOnlineTimeStamp)
      const timeAgo = getTimeAgo(lastOnlineTime);
      lastOnline.innerHTML = timeAgo
      console.log(`last online: ${timeAgo}`)
    }else{
      console.log('Last time online is not known')
    }
}

lastSync.innerHTML = localStorage.getItem('lastSyncTime')
mandatorySync.innerHTML = localStorage.getItem('mandatorySync')

displayLastTimeOnline()

