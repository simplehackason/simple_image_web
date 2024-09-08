import ImageUploadForm from './components/image-upload-form'
import Scroll from './components/scroll'

export default function Home() {
  return (
    <article className="min-h-dvh bg-gradient-to-b from-white to-zinc-600">
      <div className="relative aspect-video w-full bg-hero-background bg-cover bg-center bg-no-repeat">
        <div className="absolute right-12 top-1/3 w-1/3 space-y-2 text-black">
          <h2 className="text-lg">App Description</h2>
          <h1 className="text-2xl font-bold">黒白解析機</h1>
          <p className="text-sm">
            それは真実を暴く白と黒のコントラスト。闇の中に隠された物体を、鋭い目で見抜き、鮮やかな精度で解析する。
          </p>
        </div>
        <div className="absolute bottom-0 right-1/2 translate-x-1/2">
          <Scroll />
        </div>
      </div>
      <main className="mx-auto mt-52 max-w-lg px-4 pb-10 md:mt-32">
        <ImageUploadForm />
      </main>
    </article>
  )
}
