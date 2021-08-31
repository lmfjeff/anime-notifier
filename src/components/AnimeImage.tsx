import React from 'react'
import { Image as ChakraImage, ImageProps } from '@chakra-ui/react'
import fallbackImage from '../../public/image/hellomoto.png'

export const AnimeImage: React.FC<ImageProps> = ({ onLoad, src, onError, ...props }) => {
  const handleImageLoad: ImageProps['onLoad'] = event => {
    onLoad && onLoad(event)
  }

  const handleError: ImageProps['onError'] = event => {
    onError && onError(event)
  }

  return (
    <ChakraImage {...props} src={src} onLoad={handleImageLoad} onError={handleError} fallbackSrc={fallbackImage.src} />
  )
}
