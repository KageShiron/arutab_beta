import React from "react";
import ReactDOM from "react-dom";
class TouchPadGesture{
constructor(){
this.keyStatus  = {
 ctrlKey : false,
 isShortCtrlKey : false,
 isTouchPad : false}

document.addEventListener( "keydown" ,(e) => {
    console.log(`down/${this.keyStatus.isTouchPad}/${e.ctrlKey}/${this.keyStatus.isShortCtrlKey}/${this.keyStatus.ctrlKey}`);
  if(e.keyCode == 17 && !this.keyStatus.ctrlKey){
    this.keyStatus.ctrlKey = true;
    this.keyStatus.isShortCtrlKey = true;
    setTimeout( () => {
      this.keyStatus.isShortCtrlKey = false
      console.log("shortTime");
    } , 10);/*
    setTimeout( () => {
      this.keyStatus.isShortCtrlKey = false;
      this.keyStatus.ctrlKey = false;
      this.keyStatus.isTouchPad = false;
    console.log("longTimer"); 
    } , 10000);*/
  }
});
document.addEventListener( "keyup" ,(e) => {
    console.log(`up/${this.keyStatus.isTouchPad}/${e.ctrlKey}/${this.keyStatus.isShortCtrlKey}/${this.keyStatus.ctrlKey}`);
  if(e.keyCode == 17)
  {
    this.keyStatus.ctrlKey = false;
    this.keyStatus.isShortCtrlKey = false;
    this.keyStatus.isTouchPad = false;
  }
}
);
window.addEventListener( "mousewheel",(e) => {
  //  console.log(`wheel/${this.keyStatus.isTouchPad}/${e.ctrlKey}/${this.keyStatus.isShortCtrlKey}/${this.keyStatus.ctrlKey}`);
  if( !this.keyStatus.isTouchPad && (!e.ctrlKey || !this.keyStatus.isShortCtrlKey) )return; //no zoom || real ctrl key is pushed by user
  //console.log("touchpad!");
  this.keyStatus.isTouchPad = true;
  e.preventDefault();
  if(jQuery("#arutab-insert-iframe").length != 0)return;
  setTimeout(popupTablist,0);
});

function popupTablist()
{
  //console.log("popup");
  jQuery("<iframe>").attr("id","arutab-insert-iframe").attr("src", chrome.runtime.getURL("tablist.html") ).appendTo("body");
}
}
}
new TouchPadGesture();