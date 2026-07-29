import React from 'react';

type Props = {
  message?: string;
};

const TestComponent: React.FC<Props> = ({ message = 'Olá do test.tsx' }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 12 }}>
      <h2>Test Component</h2>
      <p>{message}</p>
    </div>
  );
};

export default TestComponent;
