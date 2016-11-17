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
        <div className="thumbarea">
            <img src={ this.props.thumb } className="thumb" />
        </div>
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

    render() {
        console.log(this.state);
        const list = this.state.tabs.map( (t) => <TabTail key={t.id} title={t.id+t.title} url={t.url} favicon={t.favIconUrl || "chrome://favicon/" + t.url} thumb={ this.state.captures[t.id] } />)
        return <ul>{list}</ul>
    }
}

ReactDOM.render(
    <TabTailList />,
  document.getElementById("tablist")
);