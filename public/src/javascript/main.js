
const Clock = (Enddate)=>{
  const interval = Enddate - Date.now();
  if(interval <= 0) return;
  const itervalId = setInterval(()=>{
    const newiterval = Enddate - Date.now();
    if(newiterval <= 0){
      clearInterval(itervalId);
      document.getElementById("claim").removeAttribute("disabled");
      return;
    }
    document.getElementById("spendtime").textContent = "You can claim after "+ 
    Math.floor((newiterval/1000/60) << 0) + " : " + Math.floor((newiterval/1000) % 60) + " minutes";
    document.getElementById("claim").setAttribute("disabled","true");
  },1000);
};

document.addEventListener("DOMContentLoaded", function(){
  const selectorGetTime = document.getElementById("time");
  Clock(new Date(selectorGetTime.value));
});
