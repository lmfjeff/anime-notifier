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

  // todo change includes to 'media.lmfjeff.com'
  const picture = src?.includes('myanimelist') ? src : ''

  return (
    <ChakraImage
      {...props}
      src={picture}
      onLoad={handleImageLoad}
      onError={handleError}
      fallbackSrc={fallbackImage.src}
      // loading="lazy"
    />
  )
}
