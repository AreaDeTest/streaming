'use client';
import { useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { FaPlay, FaStop } from 'react-icons/fa';

export default function LiveStream() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream);
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

      const p = new SimplePeer({ initiator: true, stream });
      p.on('signal', (data) => {
        fetch('/api/signal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ signal: data }),
        });
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
      setIsStreaming(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <video ref={videoRef} className="w-full max-w-lg bg-black" controls />
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
    </section>
  );
}

