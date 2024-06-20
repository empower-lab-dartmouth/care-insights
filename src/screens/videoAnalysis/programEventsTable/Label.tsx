import React from 'react';

const Label = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className='text-primary bg-blue-50 px-2 py-1 rounded-xl font-semibold'
      style={{ fontSize: 11 }}
    >
      {children}
    </div>
  );
};

export default Label;
