'use client';
import { useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { FaPlay, FaStop } from 'react-icons/fa';

export default function LiveStream() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startStreaming = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      const recorder = new MediaRecorder(mediaStream);
      setMediaRecorder(recorder);

      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('file', blob, 'recording.webm');

        try {
          const uploadResponse = await fetch('/api/get-upload-url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          });

          if (!uploadResponse.ok) {
            throw new Error(`Erro ao obter URL de upload: ${uploadResponse.statusText}`);
          }

          const uploadData = await uploadResponse.json();
          const uploadURL = uploadData.uploadURL;

          const response = await fetch(uploadURL, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Erro ao enviar vídeo: ${response.statusText}`);
          }
        } catch (error) {
          console.error('Erro ao enviar vídeo:', error);
        }
      };

      recorder.start();
      setIsStreaming(true);

      const p = new SimplePeer({ initiator: true, stream: mediaStream });

      p.on('signal', async (data) => {
        if (data.type === 'offer' || data.type === 'answer') {
          try {
            const response = await fetch('/api/signal', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ sdp: data }),
            });

            if (!response.ok) {
              throw new Error(`Erro ao publicar sinal: ${response.statusText}`);
            }
          } catch (error) {
            console.error('Erro ao publicar sinal:', error);
          }
        }
      });

      p.on('connect', () => {
        console.log('Connected');
      });

      setPeer(p);
    } catch (error) {
      console.error('Erro ao iniciar streaming:', error);
    }
  };

  const stopStreaming = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsStreaming(false);
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4 p-4 bg-white shadow-md rounded-md">
        <video ref={videoRef} className="w-full max-w-2xl bg-black rounded-md" controls />
        <div className="flex space-x-4">
          <button
            onClick={startStreaming}
            disabled={isStreaming}
            className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center space-x-2 hover:bg-green-700 disabled:bg-gray-400"
          >
            <FaPlay />
            <span>Start Streaming</span>
          </button>
          <button
            onClick={stopStreaming}
            disabled={!isStreaming}
            className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center space-x-2 hover:bg-red-700 disabled:bg-gray-400"
          >
            <FaStop />
            <span>Stop Streaming</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4 p-4 bg-white shadow-md rounded-md mt-8 w-full max-w-2xl">
        <div className="relative w-full pt-[56.25%]">
          <iframe
            src="https://customer-e0ksx71mz4nqibcu.cloudflarestream.com/f3517e33688be73544771ea9ea026a55/iframe"
            className="absolute top-0 left-0 w-full h-full border-none rounded-md"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}
