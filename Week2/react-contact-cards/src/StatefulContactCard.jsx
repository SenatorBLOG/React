import React, { useState } from 'react';

const StatefulContactCard = ({ name, email, phone }) => {
  // 1. Initialize a state variable `detailsVisible`
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    // 2. Update the `detailsVisible` state
    setDetailsVisible(!detailsVisible);
  };

  return (
    <div style={{ border: '1px solid #28a745', borderRadius: '8px', padding: '16px', margin: '16px 0',  }}>
      <h2>{name}</h2>
      {/* 3. Create a button that calls toggleDetails */}
      <button 
        onClick={toggleDetails}
        style={{padding: '8px 12px', borderRadius: '4px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer', marginBottom: '10px'}}
      >
        {detailsVisible ? 'Hide Details' : 'Show Details'}
      </button>
      
      {/* 4. Conditionally render the details */}
      {detailsVisible && (
        <div>
          <p>Email: {email}</p>
          <p>Phone: {phone}</p>
        </div>
      )}
    </div>
  );
};


export default StatefulContactCard;
