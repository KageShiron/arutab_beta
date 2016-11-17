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

  componentDidMount(){
  }
  
  render() {
    return (
    <li className="tab">
    <div className="header">
        <img className="favicon" src={ this.props.favicon } />
        <div className="title_url">
            <span className="title">{ this.props.title }</span><br />
            <span className="url">{ this.props.url }</span>
        </div>
    </div>
    <img src={ this.props.thumb } className="thumb" />
    </li>
    );
  }
} 

class TabTailList extends React.Component{
    constructor(){
        super();
        this.state = {
            tabs : [],
            captures : { }
        }
        chrome.tabs.getAllInWindow(null , (tabs) =>
        {
         this.setState({tabs : tabs});/*
         for( const t of tabs)
         {
            let port = chrome.tabs.connect(t.id,null);
            port.onMessage.addListener((msg) =>  {
                var caps = this.state.captures;
                caps[t.id] = msg.data;
                console.log(msg);
                this.setState({captures : caps});
            });
            port.postMessage( "GetCapture");
         }*/
        }
         );
    }

    render() {
        console.log(this.state);
        const list = this.state.tabs.map( (t) => <TabTail key={t.id} title={t.id+t.title} url={t.url} favicon={t.favIconUrl || "chrome://favicon/" + t.url} thumb={ "chrome://thumb2/" + t.url } />)
        return <ul>{list}</ul>
    }
}

ReactDOM.render(
    <TabTailList />,
  document.getElementById("tablist")
);