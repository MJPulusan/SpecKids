import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ParentsMain() {
  const navigate = useNavigate();
  const parentName = ` `; // Replace with real data from context or props
  const [selectedChild, setSelectedChild] = useState('');

  const children = ['MattP']; // default entry only in (data.sql)

  return (
    <div className="parentsMainPage">
      <div className="header">
        <h2>Welcome, {parentName}!</h2>
        <button className="exitButton" onClick={() => navigate('/')}>
          <img src="/images/close.png" alt="Close" className="closeIcon" />
        </button>
      </div>

      <div className="contentBox">
        <select
          value={selectedChild}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'add') {
              navigate('/kids-register'); // Navigate to KidsRegistration
            } else {
              setSelectedChild(value);
            }
          }}
          className="childSelect">
          <option value="" disabled hidden>
            Select Child
          </option>
          {children.map((child) => (
            <option key={child} value={child}>
              {child}
            </option>
          ))}
          <option value="add">+ Add New Child</option>{' '}
          {/* This adds the option */}
        </select>

        <button
          className="mainButton"
          onClick={() => navigate('/set-screentime')}
          disabled={!selectedChild}>
          Set a Screentime
        </button>

        <button
          className="mainButton"
          onClick={() => navigate('/set-therapy')}
          disabled={!selectedChild}>
          Set Therapy schedule
        </button>
      </div>
    </div>
  );
}
