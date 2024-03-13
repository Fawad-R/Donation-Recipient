import React, { useState } from 'react';
import '../PagesStyling/LanguageSwitch.css'

const LanguageSwitch = () => {
  const [isEnglish, setIsEnglish] = useState(true); // Initial language state

  const handleLanguageToggle = () => {
    // Toggle the language state (English or Arabic)
    setIsEnglish(!isEnglish);

    // You can add logic to switch languages here using i18n or other localization libraries
    // For simplicity, we're just toggling a state in this example.
  };

  return (
    <label className="language-switch">
      <input type="checkbox" onChange={handleLanguageToggle} checked={!isEnglish} />
      <span className="language-switch-slider"></span>
    </label>
  );
};

export default LanguageSwitch;
