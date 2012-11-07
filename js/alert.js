//TODO make this configurable.
var limit = {
  tickrate: 27,
  jvmmemory: 80,
  cpuload: 3
};

var playing = false;
var sound = new Audio();
var red = false;
function alertCheck(data){
  if(data['tps'] < limit['tickrate']){
    //start the flasing of the gauge.
    //todo playsound("main_thread_deadlock");
  //$('#tps_chart').css("background", "#FF0000");
  }
}

function playsound(filename){
  if((new Audio()).canPlayType("audio/ogg; codecs=vorbis")){
    //play ogg file
    if(!playing){
      sound = new Audio("sound/ogg/"+ filename + ".ogg");
      sound.loadstart = function(){
        alert("loaded started");
      } 
    }
    sound.play();
    
  }
  else {
    //play wave
    var soundw = new Audio("sound/wav/"+ filename + ".wav");
    soundw.play();
  }
}

function flash(element){
  if(flashing == true){
    alert("flashing");
    if(!red){
      $(element).css("background", "#FF0000");
      red = true;
    } else{
      $(element).css("background", "#FFF");
      red = false;
    }
    setTimeout(flashing(element), 1000);
  }
}
  