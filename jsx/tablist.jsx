const React = require('react')
const ReactDOM = require('react-dom')

window.addEventListener("wheel", (e) => {
    if(e.ctrlKey)e.preventDefault()
});

class TabTail extends React.Component {

    constructor() {
        super();
        this.state = {
            ctrlKey: false
        }
    }

    render() {
        const cname = "tab " + (this.props.actived == "actived" ? "actived" : "") + " size" + this.props.size;
        return (
            <li className={cname} onClick={ (e) => this.props.onClick(this.props.tabId) }>
                <div className="header">
                    <img className="favicon" src={ this.props.favicon } />
                    <div className="title_url">
                        <span className="title">{ this.props.title }</span><br />
                        <span className="url">{ this.props.url }</span>
                    </div>
                </div>
                <div className="closebutton" onClick={ (e) => { e.stopPropagation(); this.props.onClose(this.props.tabId);}} >
                        <img src="img/close.svg" />
                </div>
                <div className="thumbarea">
                    <img src={ this.props.thumb } className="thumb" />
                </div>
            </li>
        );
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
        this.initConnection();
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
        console.log(this.state);
        const list = this.state.tabs.map((t) =>
         <TabTail key={t.id} tabId={t.id} onClick={(e) => this.handleTabClick(e) }
            title={t.title} url={t.url} favicon={t.favIconUrl || "chrome://favicon/" + t.url} 
            thumb={ this.state.captures[t.id]} actived={t.active ? "actived" : ""} size={this.calcSize() }
            onClose={ (e) => this.handleCloseTab(e) }
             />)
        return <ul>{list}</ul>
    }

    handleCloseTab(tabId){
        this.port.postMessage({ message:"requestTabClose",tabId:tabId });
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
