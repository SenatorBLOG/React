import React, { useState } from 'react';

// Lab Instructions:
// Welcome to the React Contact Card Lab!
// Your goal is to build a simple application that displays contact cards.
// This lab is divided into 5 parts. Follow the instructions for each part.
// You will uncomment and work on one component at a time.

// Part 1: Your First React Component
// Objective: Create a simple, static component.
// Task: Create a functional component named `Header` that returns an h1 element
// with the text "Contact Cards".
const Header = () => {
  // YOUR CODE HERE
};

// Part 2: Components with Props
// Objective: Create a component that accepts and displays data passed via props.
// Task: Create a `ContactCard` component. It should accept a `name`, `email`,
// and `phone` prop. It should then display this information within a div.
// The div should have a border, padding, and some margin for styling.
const ContactCard = (props) => {
  // Destructure the props for easier access
  const { name, email, phone } = props;

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
      {/* YOUR CODE HERE: Display the name, email, and phone number */}
      
  );
};

// Part 3: Adding Functions and Events
// Objective: Make a component interactive by adding a button with an event handler.
// Task: Create a `ClickableContactCard` component. It should be similar to `ContactCard`
// but also include a button. When the button is clicked, it should call a function
// that logs the contact's name to the console.
const ClickableContactCard = ({ name, email, phone }) => {
  const handleShowName = () => {
    // YOUR CODE HERE: Log a message to the console, e.g., "Clicked on [name]'s card"
  };

  return (
    <div style={{ border: '1px solid #007bff', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
      <h2>{name}</h2>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      {/* YOUR CODE HERE: Add a button with an onClick event that calls handleShowName */}
      
  );
};

// Part 4: Managing State
// Objective: Use the `useState` hook to manage a component's internal state.
// Task: Create a `StatefulContactCard` component. This component will have a "details"
// section (email and phone) that can be shown or hidden by clicking a button.
// You will need to use the `useState` hook to keep track of whether the details are visible.
const StatefulContactCard = ({ name, email, phone }) => {
  // YOUR CODE HERE: Initialize a state variable `detailsVisible` with a default value of `false`.
  

    // YOUR CODE HERE: Update the `detailsVisible` state to be the opposite of its current value.

  return (
    <div style={{ border: '1px solid #28a745', borderRadius: '8px', padding: '16px', margin: '16px 0', backgroundColor: '#f8f9fa' }}>
      <h2>{name}</h2>
      
      {/* YOUR CODE HERE: Use a conditional (ternary operator) to render the button text
          - If `detailsVisible` is true, the button text should be "Hide Details".
          - If `detailsVisible` is false, it should be "Show Details".
      */}

      {/* YOUR CODE HERE: Conditionally render the details (email and phone)
          - If `detailsVisible` is true, display the div with the email and phone paragraph elements.
          - Otherwise, display nothing (null).
      */}
      
  );
};

// Part 5: Putting It All Together
// Objective: Assemble all the created components into a single application.
// Task: In the `App` component, render the `Header`, and then render one of each
// type of contact card you've created. This will show how different components
// compose to form an application.
export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      {/* Render Part 1 Component */}
      {/* Render Part 2 Component with sample data */}
      {/* Render Part 3 Component with sample data */}
      {/* Render Part 4 Component with sample data */}
  );
}