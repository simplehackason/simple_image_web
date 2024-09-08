'use client'

import { useEffect, useRef } from 'react'

export default function ImagePreview({ preview }: { preview: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [preview])

  return (
    <>
      {preview && (
        <div ref={scrollRef} className="mt-4 aspect-video w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="プレビュー画像"
            className="h-full w-full object-contain object-center"
          />
        </div>
      )}
    </>
  )
}
