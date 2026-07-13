import { useState, useRef, useEffect, useCallback } from 'react';
import { FiX, FiCrop, FiUpload } from 'react-icons/fi';

/**
 * CropModal - Lightweight canvas-based image cropping modal
 *
 * Props:
 *   open: boolean - show/hide modal
 *   file: File | null - the image file to crop
 *   aspectRatio: number - optional crop aspect ratio (e.g. 16/9, 4/3). null = free crop
 *   onCrop: (croppedFile: File) => void - called with the cropped file
 *   onSkip: () => void - user chose to skip cropping
 *   onCancel: () => void - user cancelled
 */
export default function CropModal({ open, file, aspectRatio = null, onCrop, onSkip, onCancel }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(1);
  const drawRef = useRef(null);

  // Load the image when a file is provided
  useEffect(() => {
    if (!open || !file) return;
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
      setImgLoaded(true);
    };
    img.src = URL.createObjectURL(file);
    return () => {
      if (img.src) URL.revokeObjectURL(img.src);
      imageRef.current = null;
      setImgLoaded(false);
      setCrop({ x: 0, y: 0, w: 0, h: 0 });
    };
  }, [open, file]);

  // Calculate display size and initial crop when image loads or container resizes
  const calculateLayout = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const maxW = Math.min(container.width - 32, 600);
    const maxH = Math.min(container.height - 32, 500);
    const img = imageRef.current;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let dispW, dispH;
    if (imgRatio > maxW / maxH) {
      dispW = maxW;
      dispH = maxW / imgRatio;
    } else {
      dispH = maxH;
      dispW = maxH * imgRatio;
    }
    setDisplaySize({ w: dispW, h: dispH });
    setScale(img.naturalWidth / dispW);
    // Default crop: center 80% of the image (or full if no aspect ratio)
    const cropRatio = aspectRatio || 1;
    let cw = dispW;
    let ch = dispH;
    if (!aspectRatio) {
      cw = dispW;
      ch = dispH;
    } else if (dispW / dispH > cropRatio) {
      ch = dispH;
      cw = dispH * cropRatio;
    } else {
      cw = dispW;
      ch = cw / cropRatio;
    }
    setCrop({
      x: (dispW - cw) / 2,
      y: (dispH - ch) / 2,
      w: Math.max(cw, 20),
      h: Math.max(ch, 20),
    });
  }, [aspectRatio]);

  useEffect(() => {
    if (imgLoaded) calculateLayout();
  }, [imgLoaded, calculateLayout]);

  // Draw overlay on canvas
  useEffect(() => {
    if (!open || !canvasRef.current || !displaySize.w) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = displaySize.w * dpr;
    canvas.height = displaySize.h * dpr;
    ctx.scale(dpr, dpr);

    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0, displaySize.w, displaySize.h);
    }

    // Dark overlay outside crop area
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    // Top
    ctx.fillRect(0, 0, displaySize.w, crop.y);
    // Left
    ctx.fillRect(0, crop.y, crop.x, crop.h);
    // Right
    ctx.fillRect(crop.x + crop.w, crop.y, displaySize.w - crop.x - crop.w, crop.h);
    // Bottom
    ctx.fillRect(0, crop.y + crop.h, displaySize.w, displaySize.h - crop.y - crop.h);

    // Crop area border
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);

    // Corner handles
    const handleSize = 10;
    ctx.fillStyle = '#facc15';
    // top-left
    ctx.fillRect(crop.x - handleSize / 2, crop.y - handleSize / 2, handleSize, handleSize);
    // top-right
    ctx.fillRect(crop.x + crop.w - handleSize / 2, crop.y - handleSize / 2, handleSize, handleSize);
    // bottom-left
    ctx.fillRect(crop.x - handleSize / 2, crop.y + crop.h - handleSize / 2, handleSize, handleSize);
    // bottom-right
    ctx.fillRect(crop.x + crop.w - handleSize / 2, crop.y + crop.h - handleSize / 2, handleSize, handleSize);

    // Info text
    ctx.fillStyle = '#fff';
    ctx.font = '12px sans-serif';
    ctx.fillText(`${Math.round(crop.w * scale)} × ${Math.round(crop.h * scale)}px`, 8, 18);
  }, [open, displaySize, crop, scale]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setIsDragging(true);
    setDragStart({ x: mx - crop.x, y: my - crop.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let nx = mx - dragStart.x;
    let ny = my - dragStart.y;

    // Clamp to image bounds
    nx = Math.max(0, Math.min(nx, displaySize.w - crop.w));
    ny = Math.max(0, Math.min(ny, displaySize.h - crop.h));

    setCrop(prev => ({ ...prev, x: nx, y: ny }));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch support
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;
    setIsDragging(true);
    setDragStart({ x: mx - crop.x, y: my - crop.y });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !canvasRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;
    let nx = mx - dragStart.x;
    let ny = my - dragStart.y;
    nx = Math.max(0, Math.min(nx, displaySize.w - crop.w));
    ny = Math.max(0, Math.min(ny, displaySize.h - crop.h));
    setCrop(prev => ({ ...prev, x: nx, y: ny }));
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Perform the actual crop and return a File
  const doCrop = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const sx = crop.x * scale;
    const sy = crop.y * scale;
    const sw = crop.w * scale;
    const sh = crop.h * scale;

    const outCanvas = document.createElement('canvas');
    outCanvas.width = sw;
    outCanvas.height = sh;
    const ctx = outCanvas.getContext('2d');
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    outCanvas.toBlob((blob) => {
      if (!blob) return;
      const croppedFile = new File([blob], file.name, { type: file.type });
      onCrop(croppedFile);
    }, file.type, 0.92);
  };

  if (!open || !file) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FiCrop className="w-5 h-5 text-blue-950 dark:text-yellow-400" />
            <h3 className="text-lg font-bold dark:text-white">Crop Image</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Crop area */}
        <div ref={containerRef} className="flex items-center justify-center bg-gray-900/10 dark:bg-gray-900/50" style={{ minHeight: 300, maxHeight: 520 }}>
          {!imgLoaded ? (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-5 h-5 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
              <span>Loading image...</span>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              style={{ width: displaySize.w, height: displaySize.h, cursor: isDragging ? 'grabbing' : 'grab', maxWidth: '100%', maxHeight: 500 }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          )}
        </div>

        {/* Size info + aspect ratio indicator */}
        {imgLoaded && (
          <div className="px-5 py-2 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-100 dark:border-gray-700">
            Drag to position the crop area · Output:{' '}
            <span className="font-semibold">{Math.round(crop.w * scale)} × {Math.round(crop.h * scale)}px</span>
            {aspectRatio && <span> · Aspect: {aspectRatio}</span>}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center px-5 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <FiUpload className="w-4 h-4 inline mr-1.5" />
            Skip Crop - Upload Original
          </button>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={doCrop}
              disabled={!imgLoaded}
              className="px-5 py-2 bg-blue-950 dark:bg-yellow-400 text-white dark:text-blue-950 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
            >
              <FiCrop className="w-4 h-4" />
              Crop & Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
