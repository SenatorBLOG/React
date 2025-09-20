import React, { useState } from 'react';

const Header = () => {
    return(
        <h1>Contacts Cards</h1>
    )
}

const ContactCard = (props) => {
const { name, email, phone } = props;
return (
<div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px',
margin: '16px 0' }}>
{
    <>
        <h2>{name}</h2>
        <p>{email}</p>
        <p>{phone}</p>
    </>
}
</div>
);
};
export { Header, ContactCard };
