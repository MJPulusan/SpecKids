import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readKidEntries, readUser } from '../lib/data';

export function ParentsMain() {
  const navigate = useNavigate();
  const [parentName, setParentName] = useState('Parent');
  const [selectedChild, setSelectedChild] = useState<number | ''>('');
  const [children, setChildren] = useState<
    { userId: number; fullName: string }[]
  >([]);

  useEffect(() => {
    const user = readUser();
    if (user && user.role === 'parent') {
      setParentName(user.fullName);
    }

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
    <>
      <h2>Welcome, {parentName}!</h2>
      <div className="form-container">
        <div className="header">
          <div className="button-to-right">
            <button className="exitButton" onClick={() => navigate('/')}>
              <img src="/images/close.png" alt="Close" className="closeIcon" />
            </button>
          </div>
        </div>

        <div className="card">
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
    </>
  );
}
