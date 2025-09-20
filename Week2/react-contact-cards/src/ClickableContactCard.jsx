import React from 'react';

const ClickableContactCard = ({ name, email, phone }) => {
  const handleShowName = () => {
    console.log(`Clicked on ${name}'s card`);
  };

  return (
    <div style={{ border: '1px solid #007bff', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
      <h2>{name}</h2>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      <button 
        onClick={handleShowName} 
        style={{padding: '8px 12px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer'}}
      >
        Click Me
      </button>
    </div>
  );
};

export default ClickableContactCard;
