import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Input,Button} from 'react-bootstrap';
import interact from 'interact.js';
import PluginPlaceholder from '../components/PluginPlaceholder';
import {BOX_TYPES, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER} from '../constants';

export default class DaliBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pluginContainers: []
        };
    }

    render() {
        let borderSize = 2;
        let cornerSize = 15;

        let box = this.props.boxes[this.props.id];
        let toolbar = this.props.toolbars[this.props.id];
        let vis = ((this.props.boxSelected === this.props.id) && box.type !== BOX_TYPES.SORTABLE)
        let style = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            wordWrap: 'break-word',
            visibility: (toolbar.showTextEditor ? 'hidden' : 'visible')};

        let textareaStyle = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            resize: 'none',
            visibility: (toolbar.showTextEditor ? 'visible' : 'hidden')}
        let attrs = {};

        if(toolbar.buttons) {
            toolbar.buttons.map((item, index) => {
                if (item.autoManaged) {
                    if (!item.isAttribute) {
                        if(item.name !== 'width') {
                            style[item.name] = item.value;
                            if (item.units)
                                style[item.name] += item.units;
                        }
                    } else {
                        attrs['data-' + item.name] = item.value;
                    }
                }
                if(item.name === 'fontSize'){
                    textareaStyle['fontSize'] = item.value;
                    if (item.units)
                        textareaStyle['fontSize'] += item.units;
                }else if(item.name === 'color'){
                    textareaStyle['color'] = item.value;
                }
            });
        }
        let content = (
            <div  style={style} {...attrs} dangerouslySetInnerHTML={{__html: box.content}}>
            </div>
        );
       
        let border = (
            <div style={{visibility: (vis ? 'visible' : 'hidden')}}>
                <div style={{
                    position: 'absolute',
                    top: -(borderSize),
                    left: -(borderSize),
                    width: '100%',
                    height: '100%',
                    border: (borderSize + "px dashed black"),
                    boxSizing: 'content-box'
                }}>
                     <Button className="trashbutton" 
                             onClick={e => {
                                this.props.onBoxDeleted(this.props.id, box.parent);
                                e.stopPropagation();
                             }}>
                        <i className="fa fa-trash-o"></i>
                      </Button>

                    </div>
                <div style={{position: 'absolute', left:  -cornerSize/2, top: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray', cursor: 'nw-resize'}}></div>
                <div style={{position: 'absolute', right: -cornerSize/2, top: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray', cursor: 'ne-resize'}}></div>
                <div style={{position: 'absolute', left:  -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray', cursor: 'sw-resize'}}></div>
                <div style={{position: 'absolute', right: -cornerSize/2, bottom: -cornerSize/2, width: cornerSize, height: cornerSize, backgroundColor: 'lightgray', cursor: 'se-resize'}}></div>
            </div>);

        return (<div className="wholebox"
                     onDoubleClick={(e)=>{
                        if(toolbar.config && toolbar.config.needsTextEdition){
                            this.props.onTextEditorToggled(this.props.id, true);
                            this.refs.textarea.focus();
                        }}
                    }
                     style={{position: 'absolute',
                            left: box.position.x,
                            top: box.position.y,
                            width: box.width,
                            height: box.height,
                            touchAction: 'none',
                            msTouchAction: 'none',
                            cursor: vis? 'inherit':'default' //esto evita que aparezcan los cursores de move y resize cuando la caja no está seleccionada
                        }}>
            {border}
            {content}
            <div contentEditable={true} ref={"textarea"} style={textareaStyle} />
        </div>);
    }

    blurTextarea(){
        this.props.onTextEditorToggled(this.props.id, false);
        Dali.Plugins.get(this.props.toolbars[this.props.id].config.name).updateTextChanges(this.refs.textarea.innerHTML, this.props.id);
    }

    shouldComponentUpdate(nextProps, nextState){
        console.log({actualId: this.props.id, actualSelected: this.props.boxSelected, nextId: nextProps.id, nextSelected: nextProps.boxSelected})
        if(nextProps.boxes[nextProps.id] !== this.props.boxes[this.props.id] ||
            nextProps.toolbars[nextProps.id] !== this.props.toolbars[this.props.id] ||
            (this.props.boxSelected == this.props.id && nextProps.boxSelected !== this.props.id) ||
            (this.props.boxSelected !== this.props.id && nextProps.boxSelected === this.props.id)
        ){
            //if(this.props.boxes[this.props.id].sortableContainers !== nextProps.boxes[nextProps.id].sortableContainers) {
            let pluginsContained = ReactDOM.findDOMNode(this).getElementsByTagName("plugin");
            for (let i = 0; i < pluginsContained.length; i++) {
                //console.log(pluginsContained[i].attributes["plugin-data-id"].value);
                ReactDOM.render(<PluginPlaceholder key={i}
                                                   pluginContainer={pluginsContained[i].attributes["plugin-data-id"].value}
                                                   parentBox={nextProps.boxes[this.props.id]}
                                                   boxes={nextProps.boxes}
                                                   boxSelected={nextProps.boxSelected}
                                                   toolbars={nextProps.toolbars}
                                                   onBoxSelected={this.props.onBoxSelected}
                                                   onBoxMoved={this.props.onBoxMoved}
                                                   onBoxResized={this.props.onBoxResized}
                                                   onBoxDeleted={this.props.onBoxDeleted}
                                                   onBoxModalToggled={this.props.onBoxModalToggled}
                                                   onTextEditorToggled={this.props.onTextEditorToggled}
                />, pluginsContained[i]);
            }
            //}
            return true;
        }
        return false;
    }

    componentWillUpdate(nextProps, nextState){
        if((this.props.boxSelected === this.props.id) && (nextProps.boxSelected !== this.props.id) && this.props.toolbars[this.props.id].showTextEditor){
            CKEDITOR.currentInstance.focusManager.blur(true);
        }
    }

    componentDidUpdate(prevProps, prevState){
        let toolbar = this.props.toolbars[this.props.id];
        if(toolbar.showTextEditor){
            this.refs.textarea.focus();
        }
        if((toolbar.showTextEditor !== prevProps.toolbars[this.props.id].showTextEditor) && this.props.boxes[this.props.id].draggable){
            interact(ReactDOM.findDOMNode(this)).draggable(!toolbar.showTextEditor);
        }

        if(this.refs.textarea.innerHTML === "<p><br></p>"){
            this.refs.textarea.innerHTML = this.props.boxes[this.props.id].content;
        }
    }

    componentDidMount() {
        let toolbar = this.props.toolbars[this.props.id];
        let box = this.props.boxes[this.props.id];

        if(toolbar.config && toolbar.config.needsTextEdition) {
            CKEDITOR.disableAutoInline = true;
            let editor = CKEDITOR.inline(this.refs.textarea);
            editor.on("blur", function (e) {
                this.blurTextarea();
            }.bind(this));
        }

        let pluginsContained = ReactDOM.findDOMNode(this).getElementsByTagName("plugin");
        for(let i = 0; i < pluginsContained.length; i++){
            if(!pluginsContained[i].hasAttribute("plugin-data-id")) {
                let pluginContainerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
                pluginsContained[i].setAttribute("plugin-data-id", pluginContainerId);
                ReactDOM.render(<PluginPlaceholder key={i}
                                                   pluginContainer={pluginContainerId}
                                                   parentBox={box}
                                                   boxes={this.props.boxes}
                                                   boxSelected={this.props.boxSelected}
                                                   toolbars={this.props.toolbars}
                                                   onBoxSelected={this.props.onBoxSelected}
                                                   onBoxMoved={this.props.onBoxMoved}
                                                   onBoxResized={this.props.onBoxResized}
                                                   onBoxDeleted={this.props.onBoxDeleted}
                                                   onBoxModalToggled={this.props.onBoxModalToggled}
                                                   onTextEditorToggled={this.props.onTextEditorToggled}
                />, pluginsContained[i]);
            }
        }

        $(ReactDOM.findDOMNode(this)).click(function(e){
            this.props.onBoxSelected(this.props.id);
            e.stopPropagation();
        }.bind(this));

        if (box.type !== BOX_TYPES.SORTABLE) {
            interact(ReactDOM.findDOMNode(this))
                .draggable({
                    enabled: (box.draggable),
                    restrict: {
                        restriction: "parent",
                        endOnly: true,
                        elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                    },
                    autoScroll: true,
                    onmove: (event) => {
                        if (this.props.boxSelected !== this.props.id) {
                            return;
                        }
                        var target = event.target;

                        target.style.left = (parseInt(target.style.left) || 0) + event.dx + 'px';
                        target.style.top = (parseInt(target.style.top) || 0) + event.dy + 'px';
                        if(event.restrict && event.restrict.dy < 0) {
                            target.style.top = (parseInt(target.style.top) || 0) - event.restrict.dy + 'px';
                        }


                    },
                    onend: (event) => {
                        if (this.props.boxSelected !== this.props.id) {
                            return;
                        }
                        this.props.onBoxMoved(this.props.id, parseInt(event.target.style.left), parseInt(event.target.style.top));
                        event.stopPropagation();
                    }
                })
                .ignoreFrom('input, textarea, a')
                .resizable({
                    enabled: (box.resizable),
                    restrict: {
                        restriction: "parent",
                        endOnly: true,
                        elementRect: {top: 0, left: 0, bottom: 1, right: 1}
                    },
                    edges: {left: true, right: true, bottom: true, top: true},
                    onmove: (event) => {
                        if (this.props.boxSelected !== this.props.id) {
                            return;
                        }
                        /*BOX-RESIZE*/
                        var target = event.target;
                      
                            if(event.edges.bottom){
                                //Abajo
                                target.style.top = (parseInt(target.style.top) || 0);
                            }
                            if(event.edges.left){
                                //Izquierda
                                target.style.left = (parseInt(target.style.left) || 0) + event.dx + 'px';    
                            }
                            if(event.edges.right){
                                //Derecha
                                target.style.left = (parseInt(target.style.left) || 0);
                            }
                            if(event.edges.top){
                               //Arriba
                                target.style.top = (parseInt(target.style.top) || 0) + event.dy + 'px';
                              
                            }
                               
                        target.style.width = event.rect.width + 'px';
                        target.style.height = event.rect.height + 'px';
                        if(event.restrict){
                             if(event.edges.top){
                                target.style.height = parseInt(target.style.height) + event.restrict.dy + 'px';
                                }else{
                                    target.style.height = parseInt(target.style.height) - event.restrict.dy + 'px';
                                }
                              
                            if(event.restrict.dx ){
                                if(event.edges.left){
                                   target.style.width = parseInt(target.style.width) + event.restrict.dx + 'px';
                                }else{
                                    target.style.width = parseInt(target.style.width) - event.restrict.dx + 'px';
                                }
                            }
                        }
                    },
                    onend: (event) => {
                        if (this.props.boxSelected !== this.props.id) {
                            return;
                        }
                        let width = Math.floor(parseInt(event.target.style.width) / event.target.parentElement.offsetWidth * 100) + '%';
                        this.props.onBoxResized(
                            this.props.id,
                            (box.container !== 0 ? width : parseInt(event.target.style.width)),
                            parseInt(event.target.style.height));
                        this.props.onBoxMoved(this.props.id, parseInt(event.target.style.left), parseInt(event.target.style.top));
                        event.stopPropagation();
                    }
                });
        }
    }
}
