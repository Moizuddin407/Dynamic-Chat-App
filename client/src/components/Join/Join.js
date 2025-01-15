import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Join.css';

export default function Join() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleRoomChange = (event) => {
    setRoom(event.target.value);
  };

  return (
    <div className='joinOuterContainer'>
      <div className='joinInnerContainer'>
        <h1 className='heading'>Join</h1>

        <div>
          <input
            placeholder='Name'
            className='joinInput'
            type='text'
            value={name}
            onChange={handleNameChange}
          />
        </div>

        <div>
          <input
            placeholder='Room'
            className='joinInput mt-20'
            type='text'
            value={room}
            onChange={handleRoomChange}
          />
        </div>

        {/* Do it later using props */}
        {/* Passing data using query string */}
        <Link
          onClick={event => (!name || !room) ? event.preventDefault() : null}
          to={`/chat?name=${name}&room=${room}`}
        >
          <button className='button mt-20' type='submit'>Sign In</button>
        </Link>

      </div>
    </div>
  );
}
