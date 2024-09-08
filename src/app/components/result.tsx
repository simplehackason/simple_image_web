'use client'

import { CheckIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Separator } from '~/components/ui/separator'
import type { ApiResponse } from '~/lib/types'

export default function UploadImageResult({ data }: { data?: ApiResponse }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }, [data])

  if (!data) return null

  return (
    <div className="mt-4">
      <Separator className="my-10" />
      <h2 className="text-center text-2xl font-bold">結果</h2>
      <div className="mt-2 space-y-4">
        <div>
          <h3 className="mb-3 text-sm font-semibold">検出結果</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/jpeg;base64,${data.data.image}`}
            alt="生成された画像"
            className="mt-2 h-auto max-w-full"
          />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">検出された物体</h3>
          <ul className="list-inside list-none space-y-3">
            {data.data.object_names.map((name, index) => (
              <li key={index} className="flex items-center gap-2 border">
                <div className="grid h-10 place-content-center border-r bg-white/20 p-2">
                  <CheckIcon className="size-5 text-green-300" />
                </div>
                <span className="text-lg">{name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div ref={scrollRef}>
          <h3 className="mb-3 text-sm font-semibold">説明</h3>
          <p className="text-lg">{data.data.description}</p>
        </div>
      </div>
    </div>
  )
}
