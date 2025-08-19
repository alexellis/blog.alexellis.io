'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function MenuComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Event handlers and DOM manipulation for static exports
  useEffect(() => {
    console.log('MenuComponent hydrated on client');
    
    const handleMenuClick = (e: Event) => {
      e.preventDefault();
      console.log('Menu button clicked via event listener');
      setIsMenuOpen(prev => {
        const newState = !prev;
        console.log('Setting menu state to:', newState);
        return newState;
      });
    };

    const menuButton = document.querySelector('.menu-button');
    const closeButton = document.querySelector('.nav-close-button');
    const backdrop = document.querySelector('.nav-backdrop');

    if (menuButton) {
      menuButton.addEventListener('click', handleMenuClick);
    }
    
    if (closeButton) {
      closeButton.addEventListener('click', handleMenuClick);
    }
    
    if (backdrop) {
      backdrop.addEventListener('click', handleMenuClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener('click', handleMenuClick);
      }
      if (closeButton) {
        closeButton.removeEventListener('click', handleMenuClick);
      }
      if (backdrop) {
        backdrop.removeEventListener('click', handleMenuClick);
      }
    };
  }, []);

  // Direct DOM manipulation for static exports - CLASS TOGGLE ONLY
  useEffect(() => {
    console.log('Menu state changed to:', isMenuOpen);
    
    const navElement = document.querySelector('.nav') as HTMLElement;
    
    if (navElement) {
      if (isMenuOpen) {
        console.log('Showing menu - adding nav-visible class');
        navElement.classList.add('nav-visible');
        // Also force z-index to be sure it's on top
        navElement.style.zIndex = '99999';
      } else {
        console.log('Hiding menu - removing nav-visible class');
        navElement.classList.remove('nav-visible');
      }
    } else {
      console.log('Could not find .nav element');
    }
  }, [isMenuOpen]);

  return (
    <>
      {/* Navigation backdrop - Always present for static exports */}
      <div 
        className="nav-backdrop"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 99998,
          opacity: isMenuOpen ? 1 : 0,
          visibility: isMenuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease'
        }}
      />

      {/* Navigation overlay */}
      <div className="nav">
        <button 
          className="nav-close-button"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '2rem',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          ×
        </button>
        <h3 className="nav-title" style={{
          position: 'absolute',
          top: '45px',
          left: '30px',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '1.6rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#fff',
          margin: 0
        }}>Menu</h3>
        <ul style={{ 
          padding: '90px 9% 5%', 
          listStyle: 'none',
          margin: 0
        }}>
          <li style={{ marginBottom: '2rem' }}>
            <Link href="/" className="nav-link">Home</Link>
          </li>
          <li style={{ marginBottom: '2rem' }}>
            <a href="https://alexellis.io" target="_blank" rel="noopener noreferrer" className="nav-link">About me</a>
          </li>
          <li style={{ marginBottom: '2rem' }}>
            <a href="https://github.com/alexellis/" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          </li>
          <li style={{ marginBottom: '2rem' }}>
            <a href="https://twitter.com/alexellisuk" target="_blank" rel="noopener noreferrer" className="nav-link">Twitter</a>
          </li>
          <li style={{ marginBottom: '2rem' }}>
            <a href="https://www.linkedin.com/in/alexellisuk/" target="_blank" rel="noopener noreferrer" className="nav-link">LinkedIn</a>
          </li>
          <li style={{ marginBottom: '3rem' }}>
            <h4 style={{
              color: '#fff',
              fontFamily: '"Open Sans", sans-serif',
              fontSize: '1.2rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: '0 0 1rem 0'
            }}>eBooks</h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="http://store.openfaas.com/l/everyday-golang" target="_blank" rel="noopener noreferrer" className="nav-ebook-link">• Everyday Go</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="http://store.openfaas.com/l/serverless-for-everyone-else" target="_blank" rel="noopener noreferrer" className="nav-ebook-link">• Serverless for Everyone Else</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="http://store.openfaas.com/l/netbooting-raspberrypi?layout=profile" target="_blank" rel="noopener noreferrer" className="nav-ebook-link">• Netboot the Raspberry Pi with K3s</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
}