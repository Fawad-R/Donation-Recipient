import React, { useState } from 'react';
// import './ToggleSwitch.css'; // Import your CSS file for styling

const ToggleSwitch = () => {
  const options = ['Off', 'Low', 'High'];
  const [activeIndex, setActiveIndex] = useState(0);

  const handleToggle = () => {
    setActiveIndex((activeIndex + 1) % options.length);
  };

  return (
    <div className="toggle-switch">
      <div className={`toggle-switch-knob position-${activeIndex}`} />
      <div className="toggle-switch-labels">
        {options.map((option, index) => (
          <span key={index} className={index === activeIndex ? 'active' : ''}>
            {option}
          </span>
        ))}
      </div>
      <button className="toggle-button" onClick={handleToggle}>
        Toggle
      </button>
    </div>
  );
};

export default ToggleSwitch;
