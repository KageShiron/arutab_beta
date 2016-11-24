let port = null;
let captureTabTimer = null;
function capture(tabId) {
    if(captureTabTimer)clearTimeout(captureTabTimer);
    captureTabTimer = setTimeout(() => {
        chrome.tabs.captureVisibleTab(null, { "format": "png" }, capt => {
            chrome.windows.getCurrent( win => chrome.tabs.getSelected( win.id, tab => {    //check is the same tab;
                console.log(tab);
                if(tab.id == tabId)reductionImage(capt,tabId);
            })) 
        })
    },1000);
}

// create/remove/updated tabs
function updatedTabs()
{
    if(port)port.postMessage({"message":"updatedTabs"})
}

function closeAruTab()
{
    if(port)chrome.tabs.sendMessage(port.sender.tab.id,{"message" : "closeAruTab" });
}

chrome.tabs.onActivated.addListener((info) => {
    capture(info.tabId);
    closeAruTab();
});
chrome.tabs.onUpdated.addListener((id, changeInfo, tab) => { 
    if (changeInfo.status) capture(id); 
    updatedTabs();
});
chrome.tabs.onRemoved.addListener((id,_) => {
    chrome.storage.remove(id);
    updatedTabs();
}); 
chrome.tabs.onReplaced.addListener( (add,remove) => 
{
    chrome.storage.remove(remove);
    updatedTabs();
}); 
chrome.tabs.onCreated.addListener( (add) => 
{
    updatedTabs();
}); 

function reductionImage( source , id )
{
    var img = new Image();
    img.onload = () => {
        const can = document.createElement("canvas");
        can.width = img.width /2;
        can.height = img.height /2;
        const ctx = can.getContext("2d");
        ctx.drawImage(img,0,0,img.width,img.height,0,0,can.width,can.height);
        let obj = {};
        obj[id] = can.toDataURL();
        chrome.storage.local.set(obj, () => { });
    };

    img.src=source;
}

chrome.runtime.onConnect.addListener(p => {
    closeAruTab();
    port = p;
    p.onMessage.addListener((msg) => {
        switch (msg.message) {
            case "getTabs":
                chrome.tabs.getAllInWindow(null, (tabs) => {
                    p.postMessage({ "message": "getTabs", "tabs": tabs });
                });
                break;
            case "requestTabChange":
                chrome.tabs.update(msg.tabId,{active:true});
                closeAruTab();
                break;
        }
    });
    p.onDisconnect.addListener(
         () => port = null
         );
})

