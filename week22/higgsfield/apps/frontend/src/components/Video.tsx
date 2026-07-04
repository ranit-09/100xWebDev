import React from 'react'

export function Video({url , title}:{url:string, title:string}) {
  return (
    <div>
        <video src={url} style={{width:"50%"}}></video>
        <div>
            {title}
        </div>
    </div>
  )
}
