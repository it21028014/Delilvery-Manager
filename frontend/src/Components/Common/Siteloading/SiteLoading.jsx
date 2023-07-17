import React, { Component } from 'react';
import './SiteLoading.css';



class SiteLoading extends Component {
    render() {
        return (
            <div className="overlay" align="center">
                <img className="logo" id="loading" src={require('./Loading.gif')} alt="inner" />
                <h1 className="txt-main">Loading...</h1>
            </div>
        );
    }
}

export default SiteLoading;