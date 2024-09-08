export default function ImagePreview({ preview }: { preview: string }) {
  return (
    <>
      {preview && (
        <div className="mt-4 aspect-video w-full">
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
