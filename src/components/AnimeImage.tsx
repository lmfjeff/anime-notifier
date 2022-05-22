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

  // todo change includes to 'cdn.example.com'
  // const regex = new RegExp(/^[A-Z0-9]*\.(jpg|png|gif|jpeg)$/, 'g')
  const regex = new RegExp(/^img\/[A-Za-z0-9_-]*\.(jpg|jpeg|png|webp|avif)/, 'g')
  const cdnHost = process.env.NEXT_PUBLIC_CDN_HOST
  const picture = src?.includes('http') ? src : regex.test(src || '') ? `https://${cdnHost}/${src}` : ''

  // todo add loading image (along with fallback image)

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
