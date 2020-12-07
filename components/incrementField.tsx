/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';

const Image = styled.img``;
const Plus = styled(Image)``;
const Minus = styled(Image)``;

const PLUS_URL = '/images/add.svg';
const MINUS_URL = '/images/minus.svg';

const IncrementFieldWrapper = styled.div``;

const IncrementField: React.FC<{
  label: string;
  className?: string;
  counter: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
}> = ({ label, className, counter, setCounter }) => {
  // const [counter, setCounter] = useState(0);
  return (
    <IncrementFieldWrapper
      className={`self-end mt-3 flex flex-row items-center justify-between ${className}`}
    >
      <span className="mr-2">{label}:</span>
      <span className="text-center py-2 px-4 bg-green-500  text-white rounded-lg shadow-md focus:outline-none">
        {counter}
      </span>
      <Plus
        src={PLUS_URL}
        onClick={() => {
          setCounter((counter) => counter + 1);
        }}
        className="w-12 mx-2"
      />
      <Minus
        src={MINUS_URL}
        onClick={() => {
          setCounter((counter) => counter - 1);
        }}
        className="w-12"
      />
    </IncrementFieldWrapper>
  );
};

export default IncrementField;
