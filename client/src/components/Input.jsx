import React from 'react';
import './Input.css';

const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="input-wrapper">
      {Icon && (
        <div className="input-icon">
          <Icon size={18} color="var(--color-primary)" />
        </div>
      )}
      <input className="input-field" {...props} />
    </div>
  );
};

export default Input;
