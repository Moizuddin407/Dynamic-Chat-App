import React, {useState,useEffect} from 'react';
import queryString from 'query-string'
import io from 'socket.io-client';

export default function Chat() {
  console.log("Chat component rendered");
  return (
    <div>
      <h1>Chat</h1>
    </div>
  );
}
