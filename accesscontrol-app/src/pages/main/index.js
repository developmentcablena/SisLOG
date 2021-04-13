import React from 'react';
import Header from '../../components/Header';

import background from '../../assets/sign-in-background-truck.png'
import './styles.css';

function Main() {
    return (
        <>
            <Header />
            <div className="main-page">
                <img src={background} alt="Controle Acesso" />
            </div>
        </>
    )
}

export default Main;