'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWRMutation from 'swr/mutation'

import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { API_ENDPOINT, tmp } from '~/lib/configs'
import { getImageData } from '~/lib/get-image-data'

import ImagePreview from './image-preview'

// APIレスポンスの型定義
interface ApiResponse {
  data: {
    image: string
    text: string
  }
}

// リクエストの引数の型定義
interface RequestArgs {
  image: string
}

// API呼び出し関数
async function sendRequest(
  url: string,
  { arg }: { arg: RequestArgs },
): Promise<ApiResponse> {
  console.log('APIリクエスト:', arg)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  })

  if (!response.ok) {
    throw new Error('APIリクエストに失敗しました')
  }

  return response.json()
}

export default function ImageUploadForm() {
  const [preview, setPreview] = useState('')
  const [base64Image, setBase64Image] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const form = useForm()

  const { trigger, isMutating, error, data } = useSWRMutation<
    ApiResponse,
    Error,
    string,
    RequestArgs
  >(API_ENDPOINT, sendRequest)

  const onSubmit = async (formData: any) => {
    if (!base64Image) {
      console.error('画像が選択されていません')
      return
    }

    try {
      await trigger({
        image: base64Image.split(',')[1], // Base64データ部分のみを抽出
      })
    } catch (error) {
      console.error('アップロードエラー:', error)
    }
  }

  const handleImageCapture = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log('画像読み込み:', event.target.files)
    try {
      const { base64, displayUrl } = await getImageData(event)
      console.log('画像データ:', base64)
      setPreview(displayUrl)
      setBase64Image(base64)
    } catch (error) {
      console.error('画像の読み込みエラー:', error)
    }
  }

  const triggerFileSelection = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="picture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>画像アップロード</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      {...field}
                      onChange={handleImageCapture}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button type="button" onClick={triggerFileSelection}>
                      画像を選択
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  カメラで撮影するか、画像ファイルを選択してください
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isMutating || !base64Image}>
            {isMutating ? '送信中...' : '送信'}
          </Button>
        </form>
      </Form>
      <ImagePreview preview={preview} />
      {error && (
        <div className="mt-4 text-red-500">エラー: {error.message}</div>
      )}
      {data && (
        <div className="mt-4">
          <div className="mt-2 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">生成された画像：</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/jpeg;base64,${data.data.image}`}
                alt="生成された画像"
                className="mt-2 h-auto max-w-full rounded-lg shadow-md"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">画像の説明：</h3>
              <p className="mt-2 p-4">{data.data.text}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
