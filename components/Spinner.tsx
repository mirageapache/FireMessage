import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

function Spinner() {
  return (
    <div className="flex justify-center items-center w-full">
      <FontAwesomeIcon icon={faRotate} size="lg" className="animate-spin h-7 w-7 m-1.5 mr-3" />
      載入中...
    </div>
  );
}

export default Spinner;
