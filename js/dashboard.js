$(document).ready(function(){
    $('#perform_GC').click(function(){
       json.call("mineload.performGC", null, function(res){
           console.log(res);
           if(res.result === "success"){
               alertify.log("Server running garbage collector.");
           }
       });
    });
});