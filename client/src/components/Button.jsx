import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', className = '', disabled = false, ...props }) => (
  <button
    className={`btn btn-${variant} ${className} ${disabled ? 'btn-disabled' : ''}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export default Button;
