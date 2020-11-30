import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import cn from 'classnames'


const ButtonWrapper = styled.div`
`
const ButtonLabel = styled.div`

`

const colorsStyles = {
  primary: 'text-white bg-indigo-600 hover:bg-indigo-700',
  secondary: 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200'
}
type ButtonVariant = 'primary' | 'secondary'
export const ButtonCTA: React.FC<{ imageRelativeURL: string, variant: ButtonVariant, onClick: () => void }> = ({ children, imageRelativeURL, onClick, variant }) => {

  const colors = cn({
    [colorsStyles.primary]: variant === 'primary',
    [colorsStyles.secondary]: variant === 'secondary'
  })

  const classes = cn("w-full flex-col flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md  md:py-4 md:text-lg md:px-10", colors)


  return (
    <ButtonWrapper className="rounded-md shadow" onClick={onClick}>
      <ButtonLabel className={classes} >

        <div style={{ position: 'relative', width: '180px', height: '180px' }}>

          <Image src={imageRelativeURL} layout="fill" objectFit="cover" />
        </div>

        {children}
      </ButtonLabel>
    </ButtonWrapper>
  )
}
