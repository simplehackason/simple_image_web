import type { ChangeEvent } from 'react'

// 画像データを取得し、Base64に変換する関数
export function getImageData(
  event: ChangeEvent<HTMLInputElement>,
): Promise<{ base64: string; displayUrl: string }> {
  return new Promise((resolve, reject) => {
    const file = event.target.files?.[0]
    if (!file) {
      reject(new Error('ファイルが選択されていません'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      const displayUrl = URL.createObjectURL(file)
      resolve({ base64, displayUrl })
    }
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}
