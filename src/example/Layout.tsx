import { Link, Outlet } from 'react-router-dom';
import Canvas from './Canvas';
import React from 'react';

const Layout = () => {
    return (
        <>
            <div className='layout'>
                <a target='_blank' href='https://github.com/AZAM-Fabien/fluid-effect-maskeffect-lazyloading'>
                </a>

                <nav className='nav' style={{ display: 'flex', gap: '1rem', justifyContent: 'center', color: 'white', background: 'black'}}>
                    <Link to='/'>example 1</Link>
                    <Link to='/example2NoMask'>example 2</Link>
                </nav>
            </div>

            <Canvas />
            <Outlet />
        </>
    );
};

export default Layout;
