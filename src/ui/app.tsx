import React, { useState } from 'react';
import { appScreenId, packageName } from "../consts";
import { IPeersUI, zodAnyObjectOrArray } from 'peers-sdk';

export function AppScreen() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Hello {packageName}!</h1>
      <p>You can use this as your main application screen or throw it away.</p>
      <p>Button clicked {count} times.</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export const AppScreenUI: IPeersUI = {
  peersUIId: appScreenId,
  content: AppScreen,
  propsSchema: zodAnyObjectOrArray,
}