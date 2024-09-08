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
import { API_ENDPOINT } from '~/lib/configs'
import { getImageData } from '~/lib/get-image-data'

import ImagePreview from './image-preview'

// API呼び出し関数
async function sendRequest(url: string, { arg }: { arg: { image: string } }) {
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
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const form = useForm()

  const { trigger, isMutating, error, data } = useSWRMutation(
    API_ENDPOINT,
    sendRequest,
  )

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

  const triggerCameraCapture = () => {
    cameraInputRef.current?.click()
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
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      {...field}
                      onChange={handleImageCapture}
                      className="hidden"
                      ref={cameraInputRef}
                    />
                    <Button type="button" onClick={triggerCameraCapture}>
                      カメラで撮影
                    </Button>
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
          <h2 className="text-xl font-bold">アップロード成功！</h2>
          <pre className="mt-2 rounded-lg bg-gray-100 p-4">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </>
  )
}
