const React = require('react')
const ReactDOM = require('react-dom')


class TabTail extends React.Component {

constructor()
{
  super();
  window.addEventListener("mousewheel",(e) => preventDefault());
  this.state = {
    ctrlKey : false
  }
}

  render() {
    const cname = "tab " + ( this.props.actived == "actived" ? "actived" : "") + " size" + this.props.size;
    return (
    <li className={cname}>
        <div className="header">
            <img className="favicon" src={ this.props.favicon } />
            <div className="title_url">
                <span className="title">{ this.props.title }</span><br />
                <span className="url">{ this.props.url }</span>
            </div>
        </div>
        <div className="thumbarea">
            <img src={ this.props.thumb } className="thumb" />
        </div>
    </li>
    );
  }
}

class TabTailList extends React.Component{

    initConnection(){
        this.port = chrome.runtime.connect(null,{});
        this.port.onMessage.addListener( (arg) => {
            switch(arg.message)
            {
                case "getTabs" :
                for( const l of this.getTabsListeners )l(arg.tabs);
                this.getTabsListeners = []; 
                break;
            }

        });
        this.getTabsListeners = [];
    }

    getTabs( callback ){
        this.port.postMessage( { "message" : "getTabs" } );
        this.getTabsListeners.push(callback);
    }

    constructor(){
        super();
        this.state = {
            tabs : [],
            captures : { }
        }
        this.initConnection();
        this.getTabs((tabs) =>
        {
         this.setState({tabs : tabs});
         for( const t of tabs)
         {
             var def = {};
             def[t.id] = "";
             chrome.storage.local.get( def , (items) => {
                var caps = this.state.captures;
                caps[t.id] = items[t.id];
                this.setState({captures : caps});
            });
         }
        }
         );
    }

    calcSize(){
        if( this.state.tabs.length <= 9)return 30;
        if( this.state.tabs.length <= 16)return 25;
        return 20;
    }

    render() {
        console.log(this.state);
        const list = this.state.tabs.map( (t) => <TabTail key={t.id} title={t.id+t.title} url={t.url} favicon={t.favIconUrl || "chrome://favicon/" + t.url} thumb={ this.state.captures[t.id] } actived={t.active ? "actived" : ""} size={this.calcSize()} />)
        return <ul>{list}</ul>
    }
}


ReactDOM.render(
    <TabTailList />,
    document.getElementById("tablist")
);