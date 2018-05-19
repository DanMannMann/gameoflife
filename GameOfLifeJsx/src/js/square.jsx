import * as React from 'react';
import * as ReactDOM from 'react-dom';
import update from 'immutability-helper';
import { Layer, Rect, Stage, Group } from 'react-konva';

export const SIZE = 15;

export class Square extends React.Component {
    constructor() {
        super();
    }
    render() {
        if (this.props.alive) {
            return <Rect onClick={(e) => { this.props.onClick(e, this.props.model); }} x={this.props.model.x * SIZE} y={this.props.model.y * SIZE} width={SIZE} height={SIZE} fill='green' cornerRadius={SIZE / 2} />;
        } else {
            return <Rect onClick={(e) => { this.props.onClick(e, this.props.model); }} x={this.props.model.x * SIZE} y={this.props.model.y * SIZE} width={SIZE} height={SIZE} fill='lightgrey' cornerRadius={SIZE / 2} />;
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.nextProps.alive != this.props.alive;
    }
}