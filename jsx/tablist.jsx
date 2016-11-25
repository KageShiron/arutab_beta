const React = require('react')
const ReactDOM = require('react-dom')

window.addEventListener("wheel", (e) => {
    if(e.ctrlKey)e.preventDefault()
});

class TabTail extends React.Component {

    constructor() {
        super();
        this.state = {
            ctrlKey: false,
            style:"",
            deltaX:0,
            deltaY:0,
            opacity:1,
            isRemoving:false
        }
        this.touch = {
            x:NaN,
            y:NaN
        }
        this.li = null;
    }

    handleTouchStart( e )
    {
        this.touch.x = e.touches[0].pageX;
        this.touch.y = e.touches[0].pageY;
    }

    handleTouchMove( e )
    {
        e.preventDefault();
        const deltaX = e.touches[0].pageX - this.touch.x;
        const deltaY  = e.touches[0].pageY - this.touch.y;
        //const delta = Math.sqrt( deltaX * deltaX + deltaY * deltaY );
        if( deltaX < -100 || deltaX > 100 )
        {
            this.setState({"deltaX": deltaX,"deltaY": deltaY,"opacity" : (300 - Math.abs(deltaX ))/200 + 0.5});
        }else{
            this.setState({"deltaX":0 ,"deltaY": 0,"opacity" : 1});
        }
    }

    handleTouchEnd(e)
    {
        this.touch.x = NaN;
        this.touch.y = NaN;
        //const delta = Math.sqrt( this.state.deltaX *  this.state.deltaX +  this.state.deltaY *  this.state.deltaY );
        const delta = Math.abs(this.state.deltaX);
        if(delta > 300)
        {
            this.props.onClose({ "target" : this , "tabId" : this.props.tabId});
        }else{
            this.setState({"deltaX": 0,"deltaY": 0,"opacity":1});
        
        }
    }

    render() {
        const cname = "tab " + (this.props.actived == "actived" ? "actived" : "") + " size" + this.props.size + ( this.state.isRemoving ?  " removing" : "");
        const li = <li style={{ backgroundColor: (( this.state.deltaX < -300 ||this.state.deltaX > 300 ) ? "#FCC" : "initial") , left:this.state.deltaX + "px" , top:this.state.deltaY + "px",opacity:this.state.opacity }}
         className={cname} onTouchStart={ (e) => this.handleTouchStart(e) }
               onTouchMove={ e => this.handleTouchMove(e)}
               onTouchEnd={ e=> this.handleTouchEnd(e)}
              onClick={ (e) => this.props.onClick(this.props.tabId) }>
                <div className="header">
                    <img className="favicon" src={ this.props.favicon } />
                    <div className="title_url">
                        <span className="title">{ this.props.title }</span><br />
                        <span className="url">{ this.props.url }</span>
                    </div>
                </div>
                <div className="closebutton" onClick={ (e) => { e.stopPropagation(); this.props.onClose({ "target" : this , "tabId" : this.props.tabId});}} >
                        <img src="img/close.svg" />
                </div>
                <div className="thumbarea">
                    <img src={ this.props.thumb } className="thumb" />
                </div>
            </li>;
        return li;  
    }
}

class TabTailList extends React.Component {

    initConnection() {
        this.port = chrome.runtime.connect(null, {});
        this.port.onMessage.addListener((arg) => {
            switch (arg.message) {
                case "getTabs":
                    for (const l of this.getTabsListeners) l(arg.tabs);
                    this.getTabsListeners = [];
                    break;
            }

        });
        this.getTabsListeners = [];
    }

    getTabs(callback) {
        this.port.postMessage({ "message": "getTabs" });
        this.getTabsListeners.push(callback);
    }

    constructor() {
        super();
        this.state = {
            tabs: [],
            captures: {}
        }
        this.removeTimer = null;
        this.initConnection();
        this.initTabs();
    }

    initTabs(){
        this.getTabs((tabs) => {
            this.setState({ tabs: tabs });
            for (const t of tabs) {
                var def = {};
                def[t.id] = "";
                chrome.storage.local.get(def, (items) => {
                    var caps = this.state.captures;
                    caps[t.id] = items[t.id];
                    this.setState({ captures: caps });
                });
            }
        }
        );
    }

    calcSize() {
        if (this.state.tabs.length <= 9) return 30;
        if (this.state.tabs.length <= 16) return 25;
        return 20;
    }

    render() {
        const list = this.state.tabs.map((t) =>
         <TabTail key={t.id} tabId={t.id} onClick={(e) => this.handleTabClick(e) }
            title={t.title} url={t.url} favicon={t.favIconUrl || "chrome://favicon/" + t.url} 
            thumb={ this.state.captures[t.id]} actived={t.active ? "actived" : ""} size={this.calcSize() }
            onClose={ (e) => this.handleCloseTab(e) }
             />)
        return <ul>{list}</ul>
    }

    handleCloseTab(e){
        this.port.postMessage({ message:"requestTabClose",tabId:e.tabId });
        e.target.setState({"isRemoving" : "removing"});
        if(this.removeTimer)clearTimeout(this.removeTimer);
        this.removeTimer = setTimeout( () => this.clearRemoved() , 1000 );
    }

    clearRemoved() {
        const _this = this;
        $(".removing").animate({width:"hide"},100).delay(1000).queue(() => {$(this).remove(); _this.initTabs()});
    }

    handleTabClick(tabId) {
        this.props.onRemoving();    // iframe change to invisible
        this.port.postMessage({ message: "requestTabChange", tabId: tabId });
    }
}


ReactDOM.render(   
    <TabTailList onRemoving={ () => {document.body.style.backgroundColor="transparent";document.body.style.display="none";} } />,
    document.getElementById("tablist")
);
