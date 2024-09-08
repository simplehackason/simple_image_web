'use client'

import { FileDownIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWRMutation from 'swr/mutation'

import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { API_ENDPOINT } from '~/lib/configs'
import { getImageData } from '~/lib/get-image-data'
import type { ApiResponse } from '~/lib/types'

import ImagePreview from './image-preview'
import UploadImageResult from './result'

// リクエストの引数の型定義
interface RequestArgs {
  image: string
}

const tmp = {
  data: {
    image: 'image',
    object_names: ['object1', 'object2'],
    description: 'description',
  },
}

// API呼び出し関数
async function sendRequest(
  url: string,
  { arg }: { arg: RequestArgs },
): Promise<ApiResponse> {
  console.log('APIリクエスト:', arg)

  // const response = await fetch(url, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(arg),
  // })

  // if (!response.ok) {
  //   throw new Error('APIリクエストに失敗しました')
  // }

  const tmp_data = {
    data: {
      image: arg.image,
      object_names: ['object1', 'object2'],
      description: 'description',
    },
  }

  return tmp_data

  // return response.json()
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
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="w-full py-9 text-lg font-semibold"
                      onClick={triggerFileSelection}
                    >
                      画像をアップロード <FileDownIcon className="ml-2" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full py-6 text-lg font-semibold"
            disabled={isMutating || !base64Image}
          >
            {isMutating ? '送信中...' : '送信'}
          </Button>
        </form>
      </Form>
      <ImagePreview preview={preview} />
      {error && (
        <div className="mt-4 text-red-500">エラー: {error.message}</div>
      )}
      <UploadImageResult data={data} />
    </>
  )
}
