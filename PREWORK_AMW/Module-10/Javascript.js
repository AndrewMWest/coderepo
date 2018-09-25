var button = document.getElementById("button");

button.onclick = function(){
    if(box.className == "Grow"){
        //shrink the box
        box.className = ""; 
    } else{
        //expand the box
        box.className = "Reset";
    }
}