import Viewer360 from '@/components/Viewer360/Viewer360';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-12 text-center">
          360° Shader Viewer
        </h1>
        <Viewer360 
          imageSrc="/images/sample-360.jpg"
          autoRotate={true}
        />
      </div>
    </main>
  );
}
