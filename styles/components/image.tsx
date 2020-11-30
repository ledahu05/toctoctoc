import React from 'react'
import styled from 'styled-components'
import { NameProps } from './types'

export const Image: React.FC<{
  className?: string
  src: string
  alt?: string
  onClick?: () => void
  mr?: string
}> = ({ className, src, alt, ...props }) => {
  const name = src.split('/').pop()?.split('.').shift() || 'image'
  return (
    <BaseImage
      className={className}
      {...props}
      src={src}
      alt={alt || ''}
      name={name}
    />
  )
}

interface BaseImageProps extends NameProps {
  mr?: string
}
const BaseImage = styled.img.attrs<BaseImageProps>(props => ({
  name: props.name
})) <BaseImageProps>`
  margin-right: ${props => (props.mr ? props.mr : 0)};
`
