import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

function Spinner({ text }: { text?: string }) {
  return (
    <div className="flex justify-center items-center w-full">
      <FontAwesomeIcon icon={faRotate} size="lg" className="animate-spin h-7 w-7 m-1.5 mr-3" />
      {text}
    </div>
  );
}

Spinner.defaultProps = {
  text: "載入中...",
};

export default Spinner;
