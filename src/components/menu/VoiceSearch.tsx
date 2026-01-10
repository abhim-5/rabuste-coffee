'use client';

import React, { useState, useEffect } from 'react';

interface VoiceSearchProps {
  onTranscript: (transcript: string, isFinal: boolean) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({ 
  onTranscript, 
  isListening, 
  setIsListening 
}) => {
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore - SpeechRecognition is not standard yet
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false; // Stop after one sentence
        reco.interimResults = true; // Enable real-time results
        reco.lang = 'en-US';

        reco.onstart = () => setIsListening(true);
        reco.onend = () => setIsListening(false);
        
        reco.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const currentTranscript = finalTranscript || interimTranscript;
          // params: transcript, isFinal
          onTranscript(currentTranscript, !!finalTranscript);
        };

        reco.onerror = (event: any) => {
          setIsListening(false);

          // User-friendly error handling
          switch (event.error) {
            case 'not-allowed':
              console.warn('Voice Search: Microphone access denied.');
              alert('Please allow microphone access to use Voice Search.');
              break;
            case 'audio-capture':
              console.warn('Voice Search: No microphone found.');
              alert('No microphone found. Please check your system settings.');
              break;
            case 'network':
              console.warn('Voice Search: Network error.');
              break;
            default:
              // Ignore minor errors
              break;
          }
        };

        setRecognition(reco);
      }
    }
  }, [onTranscript, setIsListening]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Voice search is not supported in this browser. Try Chrome.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (!recognition) return null;

  return (
    <button
      onClick={toggleListening}
      className={`p-2 transition-colors duration-200 ${
        isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-[#8B6F47]'
      }`}
      title="Voice Search"
      type="button"
    >
      {isListening ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
          <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      )}
    </button>
  );
};
