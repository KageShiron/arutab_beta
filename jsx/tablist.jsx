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
        <span className="title">{ this.props.title }</span>
    </div>
    <img src={ this.props.thumb } className="thumb" />
    </li>
    );
  }
} 

ReactDOM.render(
  <TabTail title="aaa" favicon="" thumb="" />,
  document.body
);