import React from 'react';
import { Header, ContactCard } from './ContactCardLab.jsx';
import ClickableContactCard from './ClickableContactCard.jsx';
import StatefulContactCard from './StatefulContactCard.jsx';

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <Header />
      <ContactCard name="Alice" email="alice@example.com" phone="123-456-7890" />
      <ClickableContactCard name="Mike" email="mike@example.com" phone="14-88" />
      <StatefulContactCard name="Roma" email="roma@example.com" phone="987-654-321" />
    </div>
  );
}
