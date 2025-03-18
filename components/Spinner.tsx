/* eslint-disable react/require-default-props */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

function Spinner({ text = "載入中..." }: { text?: string }) {
  return (
    <div className="flex justify-center items-center w-full">
      <FontAwesomeIcon icon={faRotate} size="lg" className="animate-spin h-6 w-6 m-1.5 mr-3" />
      {text}
    </div>
  );
}

export default Spinner;
