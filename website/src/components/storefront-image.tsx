'use client';
import Image,{type ImageProps} from 'next/image';
import {useState} from 'react';
type Props=Omit<ImageProps,'src'|'alt'> & {src:string;alt:string;fallback?:string};
export function StorefrontImage({src,alt,fallback='/assets/brand/image-placeholder.svg',...props}:Props){
 const [failedSrc,setFailedSrc]=useState<string|null>(null);
 const [loadedSrc,setLoadedSrc]=useState<string|null>(null);
 const current=!src||failedSrc===src?fallback:src;
 return <Image {...props} src={current} alt={alt} quality={85}
  style={{...props.style,backgroundColor:loadedSrc===current?props.style?.backgroundColor:'#eee7df'}}
  onLoad={event=>{setLoadedSrc(current);props.onLoad?.(event);}}
  onError={event=>{setFailedSrc(src);props.onError?.(event);}}/>;
}
