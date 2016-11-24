$(() => {

  const React = require("react");
  const ReactDOM = require("react-dom");
  class TouchPadGesture {
    constructor() {
      this.keyStatus = {
        ctrlKey: false,
        isShortCtrlKey: false,
        isTouchPad: false
      }

      document.addEventListener("keydown", (e) => {
        console.log(`down/${this.keyStatus.isTouchPad}/${e.ctrlKey}/${this.keyStatus.isShortCtrlKey}/${this.keyStatus.ctrlKey}`);
        if (e.keyCode == 17 && !this.keyStatus.ctrlKey) {
          this.keyStatus.ctrlKey = true;
          this.keyStatus.isShortCtrlKey = true;
          setTimeout(() => {
            this.keyStatus.isShortCtrlKey = false
            console.log("shortTime");
          }, 50);/*
    setTimeout( () => {
      this.keyStatus.isShortCtrlKey = false;
      this.keyStatus.ctrlKey = false;
      this.keyStatus.isTouchPad = false;
    console.log("longTimer"); 
    } , 10000);*/
        }
      });
      document.addEventListener("keyup", (e) => {
        console.log(`up/${this.keyStatus.isTouchPad}/${e.ctrlKey}/${this.keyStatus.isShortCtrlKey}/${this.keyStatus.ctrlKey}`);
        if (e.keyCode == 17) {
          this.keyStatus.ctrlKey = false;
          this.keyStatus.isShortCtrlKey = false;
          this.keyStatus.isTouchPad = false;
        }
      }
      );
      window.addEventListener("mousewheel", (e) => {
        console.log(`wheel/${this.keyStatus.isTouchPad}/${e.ctrlKey}/${this.keyStatus.isShortCtrlKey}/${this.keyStatus.ctrlKey}`);
        if (this.keyStatus.isTouchPad) //タッチパッド検出時は常にprevent
        {
          e.preventDefault();
          return;
        }
        if (e.ctrlKey && !this.keyStatus.ctrlKey) //時々keydownがこずにズームしようとする
        {
          e.preventDefault();
          return;
        }
        if (!e.ctrlKey || !this.keyStatus.isShortCtrlKey) return; //no zoom || real ctrl key is pushed by user
        console.log("touchpad!");
        this.keyStatus.isTouchPad = true;
        e.preventDefault();
        if (jQuery("#arutab-insert-iframe").length != 0) return;
        setTimeout(popupTablist, 0);
      });

      function popupTablist() {
        jQuery("<iframe>").attr("id", "arutab-insert-iframe").attr("src", chrome.runtime.getURL("tablist.html"))
          .on("load", (e) => {
            $(e.target).css("display", "block");
            setTimeout(() => $(e.target).addClass("arutab-iframe-visible"), 0);
            console.log($(e.target).attr("src"));
          }).css("display", "none").appendTo("body");;
        //setTimeout(() => jQuery("#arutab-insert-iframe").remove(), 10000); 
      }
    }
  }
  new TouchPadGesture();

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.message == "closeAruTab") jQuery("#arutab-insert-iframe").remove();
  });

});