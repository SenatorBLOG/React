import React from 'react';

const ClickableContactCard = ({ name, email, phone }) => {
  const handleShowName = () => console.log(`Clicked on ${name} card`);

  return (
    <div style={{ border: '1px solid #007bff', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
      <h2>{name}</h2>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      <button onClick={handleShowName}>Click Me</button>
    </div>
  );
};

export default ClickableContactCard;
