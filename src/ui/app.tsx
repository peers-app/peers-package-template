import React, { useState } from 'react';
import { registerPeersUI } from "peers-sdk";
import { appScreenId } from "../consts";

function AppScreen() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <h1>New Package Screen!</h1>
      <p>You can use this as your main application screen or throw it away.</p>
      <p>Button clicked {count} times.</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

registerPeersUI({
  component: AppScreen,
  peersUIId: appScreenId,
});