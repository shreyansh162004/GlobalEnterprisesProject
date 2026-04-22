import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { X, Check, RotateCcw } from "lucide-react";

interface Props {
  image: string;
  aspect?: number; // width / height; undefined = free
  onCancel: () => void;
  onCropComplete: (dataUrl: string) => void;
  title?: string;
}

async function getCroppedDataUrl(
  imageSrc: string,
  cropPx: Area,
  maxDim = 1600,
  quality = 0.85,
): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = imageSrc;
  });

  let outW = cropPx.width;
  let outH = cropPx.height;
  if (outW > maxDim || outH > maxDim) {
    const r = Math.min(maxDim / outW, maxDim / outH);
    outW = Math.round(outW * r);
    outH = Math.round(outH * r);
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    cropPx.x,
    cropPx.y,
    cropPx.width,
    cropPx.height,
    0,
    0,
    outW,
    outH,
  );

  let q = quality;
  let out = canvas.toDataURL("image/jpeg", q);
  while (out.length > 700 * 1370 && q > 0.2) {
    q -= 0.1;
    out = canvas.toDataURL("image/jpeg", q);
  }
  return out;
}

const ImageCropper = ({ image, aspect, onCancel, onCropComplete, title = "Crop Image" }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentAspect, setCurrentAspect] = useState<number | undefined>(aspect);

  const onCropDone = useCallback((_: Area, areaPx: Area) => {
    setCroppedAreaPixels(areaPx);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const dataUrl = await getCroppedDataUrl(image, croppedAreaPixels);
      onCropComplete(dataUrl);
    } finally {
      setProcessing(false);
    }
  };

  const aspectOptions: { label: string; value: number | undefined }[] = [
    { label: "Free", value: undefined },
    { label: "16:9", value: 16 / 9 },
    { label: "4:3", value: 4 / 3 },
    { label: "1:1", value: 1 },
    { label: "3:4", value: 3 / 4 },
    { label: "9:16", value: 9 / 16 },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="glass-card w-full max-w-3xl flex flex-col max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-heading font-bold">{title}</h3>
          <button onClick={onCancel} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative w-full h-[55vh] md:h-[60vh] bg-black/40">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={currentAspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropDone}
            restrictPosition={false}
          />
        </div>

        <div className="p-4 space-y-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {aspectOptions.map((o) => (
              <button
                key={o.label}
                onClick={() => setCurrentAspect(o.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentAspect === o.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-12">Zoom</span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <button
              onClick={() => { setZoom(1); setCrop({ x: 0, y: 0 }); }}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={processing || !croppedAreaPixels}
              className="btn-premium inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {processing ? "Processing..." : "Apply Crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;