export default function ImagePreview({ preview }: { preview: string }) {
  return (
    <div className="mt-4 aspect-video max-w-[560px]">
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="プレビュー画像"
          className="h-full w-full object-contain object-center"
        />
      )}
    </div>
  )
}
