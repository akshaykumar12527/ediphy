import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';

export default class VisorNavSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggled: true
        };
    }

    render() {
        let children = this.props.navItemsById[this.props.pageName].children;
        let marginUl = (this.props.navItemsById[this.props.pageName].level*10 ) + "px";
        let name = this.props.navItemsById[this.props.pageName].name;
        let classes = this.props.display ? "visorNavListEl": "visorNavListEl hiddenNavVisor";
        return ( 
            /* jshint ignore:start */
                <ul  className={classes}>
                    <li className="visorNavListEl visorNavListBorder" onClick={(e)=>{this.setState({toggled: !this.state.toggled})}}>
                        <a style={{paddingLeft: marginUl}} href="#"> 
                            {this.state.toggled ? (<i className="material-icons">keyboard_arrow_down</i>):(<i className="material-icons">keyboard_arrow_right</i>)} 
                            <span> {name} </span>
                        </a>                       
                    </li>

                    { children.map(page => {
                            let margin = this.props.navItemsById[page].level*10 + 20 + "px";
                            if (page.indexOf("se") != -1){
                                return (<VisorNavSection display={this.state.toggled} key={page} pageName={page} navItemsById={this.props.navItemsById} changePage={(page)=> {this.props.changePage(page)}} />);
                            } else {
                                return (<li key={page} onClick={(e)=>{this.props.changePage(page)}} className={this.state.toggled ? "visorNavListEl": "visorNavListEl hiddenNavVisor"}>
                                        <a style={{paddingLeft: margin}} href="#">{this.props.navItemsById[page].name}</a>
                                        </li>);
                            }
                        })
                    }
                     
                </ul>
             /* jshint ignore:end */
        );
    }
}
