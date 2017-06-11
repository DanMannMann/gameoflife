import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as bs from 'bootstrap-css';
import { Container, Col, Row, Button } from 'reactstrap';
import { Board } from './board';

ReactDOM.render(
    <Board />,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept();
}