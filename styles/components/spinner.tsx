import styled, { keyframes } from 'styled-components'
const rotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`
export const Spinner = styled.div`
  height: 24px;
  width: 24px;

  position: absolute;
  margin: -12px 0 0 - 12px;

  animation: ${rotation} 1s infinite linear;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 100%;

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 0px;
    top: -2px;
    height: 100%;
    width: 100%;
    border-top: 2px solid #fff;
    border-left: 2px solid transparent;
    border-bottom: 2px solid transparent;
    border-right: 2px solid transparent;
    border-radius: 100%;
  }
`
