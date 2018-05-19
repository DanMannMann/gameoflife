import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as bs from 'bootstrap-css';
import { Container, Col, Row, Button, Slider } from 'reactstrap';
import { Square, SIZE } from './square';
import { update } from 'immutability-helper';
import { ReactBootstrapSlider } from 'react-bootstrap-slider';
import * as jQuery from 'jquery';
import { Layer, Rect, Stage, Group } from 'react-konva';
import * as k from 'konva';

const DIMENSION = 70;
export var DELAY = 0;

export class Board extends React.Component {
    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
        this.clear = this.clear.bind(this);
        this.toggle = this.toggle.bind(this);
        this.tick = this.tick.bind(this);
        this.getNeighbours = this.getNeighbours.bind(this);
        this.livingRules = this.livingRules.bind(this);
        this.deadRules = this.deadRules.bind(this);
        this.speedChange = this.speedChange.bind(this);

        this.state = { rows: this.getDefaultRows(), running: false, DELAY: DELAY };
    }

    newMethod() {
        var rows = [];
        let d2 = (DIMENSION / 2);
        for (var x = 0; x < DIMENSION; x++) {
            var cells = [];
            rows[x] = cells;
            for (var y = 0; y < DIMENSION; y++) {
                cells[y] = { alive: (x > d2 - 3 && x < d2 + 3 && y == d2) || (y > d2 - 2 && y < d2 + 2 && (x == d2 - 3 || x == d2 + 3)), element: null, x: x, y: y };
            }
        }
        return rows;
    }

    toggle() {
        if (this.state.running) {
            clearInterval(this.state.intervalId);
        } else {
            setTimeout(this.tick, this.state.DELAY);
        }
        
        this.setState({ running: !this.state.running });
    }

    tick() {
        let newRows = [];
        for (var col in this.state.rows) {
            newRows[col] = [];
            for (var cell in this.state.rows[col]) {
                if (this.state.rows[col][cell].alive) {
                    this.livingRules(this.state.rows[col][cell], newRows);
                } else {
                    this.deadRules(this.state.rows[col][cell], newRows);
                }
            }
        }
        this.setState({ rows: newRows, intervalId: setTimeout(this.tick, this.state.DELAY) });
    }

    livingRules(model, newState) {
        let neighbours = this.getNeighbours(model);
        let ct = 0;
        for (var n in neighbours) {
            if (neighbours[n].alive) {
                ct++;
            }
        }
        var isAlive = ct == 2 || ct == 3;
        newState[model.x][model.y] = isAlive === model.alive ? model : { alive: isAlive, element: null, x: model.x, y: model.y };
    }

    deadRules(model, newState) {
        let neighbours = this.getNeighbours(model);
        let ct = 0;
        for (var n in neighbours) {
            if (neighbours[n].alive) {
                ct++;
            }
        }
        var isAlive = ct == 3;
        newState[model.x][model.y] = isAlive === model.alive ? model : { alive: isAlive, element: null, x: model.x, y: model.y };
    }

    getNeighbours(model) {
        let x = model.x;
        let y = model.y;
        let neighbours = [];
        let xLow = x > 0;
        let xHigh = x < DIMENSION - 1;
        let yLow = y > 0;
        let yHigh = y < DIMENSION - 1;

        if (xLow) {
            neighbours.push(this.state.rows[x - 1][y]);
        }
        if (xHigh) {
            neighbours.push(this.state.rows[x + 1][y]);
        }

        if (yLow) {
            neighbours.push(this.state.rows[x][y - 1]);
        }
        if (yHigh) {
            neighbours.push(this.state.rows[x][y + 1]);
        }

        if (xLow && yLow) {
            neighbours.push(this.state.rows[x - 1][y - 1]);
        }

        if (xHigh && yHigh) {
            neighbours.push(this.state.rows[x + 1][y + 1]);
        }

        if (xHigh && yLow) {
            neighbours.push(this.state.rows[x + 1][y - 1]);
        }

        if (xLow && yHigh) {
            neighbours.push(this.state.rows[x - 1][y + 1]);
        }

        return neighbours;
    }

    clear() {
        this.setState({ rows: this.getDefaultRows() });
    }

    speedChange(e) {
        this.setState({ DELAY: e.target.value });
    }

    render() {
        let clk = this.onClick;
        return (
            <Container fluid>
                <Row>
                    <Col sm={12} className='text-center'>
                        <div style={{ margin: 5, display:'inline' }}>
                            {this.state.running ? <Button color='primary' onClick={this.toggle}>Stop</Button> : <Button color='primary' onClick={this.toggle}>Start</Button>}
                        </div>
                        <div style={{ margin: 5, display: 'inline' }}>
                            <Button color='danger' onClick={this.clear}>Clear</Button>
                        </div>
                        <div style={{ margin: 5, display: 'inline' }}>
                            <input type='range' min={1} max={1000} onChange={this.speedChange} value={this.state.DELAY} />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Stage style={{ margin: '0 auto' }} width={SIZE * DIMENSION} height={SIZE * DIMENSION}>
                        <Layer>
                            {this.state.rows.map(function (row, i) {
                                return (row.map(function (col, j) {
                                            var el = <Square key={"cell" + i + "-" + j} alive={col.alive} onClick={clk} model={col} />;
                                            col.element = el;
                                            return col.element;
                                        })
                                )
                            })}
                        </Layer>
                    </Stage>
                </Row>
            </Container>
        );
    }

    onClick(e, model) {
        // This is kinda hacky, but it's much less verbose than trying to 
        // slot in a single new cell model at the right place using immutability helper.
        // Loss of efficiency in state comparisons is limited since this only happens
        // in response to occasional user input.
        model.alive = !model.alive;
        this.setState(this.state);
    }
}