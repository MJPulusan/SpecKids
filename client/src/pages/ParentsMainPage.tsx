import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readUser } from '../lib/auth';
import { readKidEntries } from '../lib/data';

export function ParentsMain() {
  const navigate = useNavigate();
  const parentName = readUser()?.fullName || 'Parent';
  const [selectedChild, setSelectedChild] = useState<number | ''>('');
  const [children, setChildren] = useState<
    { userId: number; fullName: string }[]
  >([]);

  useEffect(() => {
    async function fetchChildren() {
      try {
        const kids = await readKidEntries();
        const validKids = kids
          .filter((kid) => kid.userId !== undefined)
          .map((kid) => ({
            userId: kid.userId as number,
            fullName: kid.fullName,
          }));
        setChildren(validKids);
      } catch (err) {
        console.error(err);
        setChildren([]);
      }
    }
    fetchChildren();
  }, []);
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
              navigate('/kids-register');
            } else {
              setSelectedChild(Number(value));
              localStorage.setItem('selectedChildId', value);
            }
          }}
          className="childSelect">
          <option value="" disabled hidden>
            Select Child
          </option>
          {children.map((child) => (
            <option key={child.userId} value={child.userId}>
              {child.fullName}
            </option>
          ))}
          <option value="add">+ Add New Child</option>
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
