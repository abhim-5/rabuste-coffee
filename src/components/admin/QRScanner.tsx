'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X, Loader2, Upload } from 'lucide-react';
import jsQR from 'jsqr';

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'camera' | 'upload'>('camera');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationRef = useRef<number>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (mode === 'camera') {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [mode]);

    const startCamera = async () => {
        try {
            setScanning(true);
            setError(null);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Wait for video to be ready before playing
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play().then(() => {
                        scanQRCode();
                    }).catch(err => {
                        console.error('Video play error:', err);
                    });
                };
            }
        } catch (err: any) {
            console.error('Camera error:', err);
            setError('Unable to access camera. Try uploading an image instead.');
            setScanning(false);
        }
    };

    const scanQRCode = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || !scanning) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                console.log('QR Code detected:', code.data);
                stopCamera();
                onScan(code.data);
                return;
            }
        }

        animationRef.current = requestAnimationFrame(scanQRCode);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const context = canvas.getContext('2d');
                if (!context) return;

                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    onScan(code.data);
                    onClose();
                } else {
                    setError('No QR code found in image. Please try another image.');
                }
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        setScanning(false);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-[#8B6F47] p-4 flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg">Scan QR Code</h3>
                    <button
                        onClick={() => {
                            stopCamera();
                            onClose();
                        }}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mode Toggle */}
                <div className="flex border-b">
                    <button
                        onClick={() => {
                            stopCamera();
                            setMode('camera');
                            setError(null);
                        }}
                        className={`flex-1 py-3 font-semibold flex items-center justify-center gap-2 ${mode === 'camera'
                                ? 'bg-[#8B6F47] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Camera className="w-4 h-4" />
                        Camera
                    </button>
                    <button
                        onClick={() => {
                            stopCamera();
                            setMode('upload');
                            setError(null);
                        }}
                        className={`flex-1 py-3 font-semibold flex items-center justify-center gap-2 ${mode === 'upload'
                                ? 'bg-[#8B6F47] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Upload className="w-4 h-4" />
                        Upload Image
                    </button>
                </div>

                {/* Scanner/Upload Area */}
                <div className="relative bg-gray-900 aspect-square">
                    {mode === 'camera' ? (
                        <>
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                playsInline
                                muted
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            {scanning && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-64 h-64 border-4 border-white rounded-lg relative">
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400"></div>
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400"></div>
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400"></div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400"></div>
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-green-400 animate-pulse"></div>
                                    </div>
                                </div>
                            )}

                            {!scanning && !error && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center gap-4 p-8 hover:bg-gray-800 transition-colors rounded-lg"
                            >
                                <Upload className="w-16 h-16 text-white" />
                                <p className="text-white font-semibold">Click to upload QR image</p>
                                <p className="text-gray-400 text-sm">JPG, PNG, or any image format</p>
                            </button>
                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                    )}
                </div>

                {/* Instructions/Error */}
                <div className="p-4">
                    {error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                            <p className="text-red-800 text-sm">{error}</p>
                            {mode === 'camera' && (
                                <button
                                    onClick={() => setMode('upload')}
                                    className="mt-2 text-red-600 hover:text-red-800 font-semibold text-sm underline"
                                >
                                    Try uploading instead
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-600 text-sm">
                            {mode === 'camera' ? (
                                <>
                                    <Camera className="w-8 h-8 mx-auto mb-2 text-[#8B6F47]" />
                                    <p>Position the QR code within the frame</p>
                                    <p className="text-xs text-gray-500 mt-1">Scanning happens automatically</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-[#8B6F47]" />
                                    <p>Upload a screenshot or photo of the QR code</p>
                                    <p className="text-xs text-gray-500 mt-1">We'll extract the code automatically</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
