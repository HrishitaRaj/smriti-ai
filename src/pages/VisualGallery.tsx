import { Camera, Upload, User, MapPin, X, Heart, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import VisualCard from "@/components/VisualCard";

type ImageItem = { id: string; src: string; caption?: string; createdAt: string };

const VisualGallery = () => {
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);

  const people = [
    {
      id: 1,
      name: "Yogita",
      relationship: "Friend",
      lastSeen: "March 15, 2024",
      meetingCount: 12,
      timeline: [
        { date: "March 15, 2024", activity: "Coffee at cafe", emotion: "happy", note: "Talked about traveling" },
        { date: "March 8, 2024", activity: "Lunch together", emotion: "happy", note: "Shared stories" },
        { date: "Feb 28, 2024", activity: "Movie night", emotion: "happy", note: "Watched comedy" },
        { date: "Feb 15, 2024", activity: "Birthday celebration", emotion: "happy", note: "Had cake" },
      ]
    },
    {
      id: 2,
      name: "Mother",
      relationship: "Family",
      lastSeen: "March 12, 2024",
      meetingCount: 45,
      timeline: [
        { date: "March 12, 2024", activity: "Family dinner", emotion: "happy", note: "Wonderful evening" },
        { date: "March 10, 2024", activity: "Phone call", emotion: "calm", note: "Daily check-in" },
        { date: "March 5, 2024", activity: "Visited home", emotion: "happy", note: "Cooked together" },
      ]
    },
    {
      id: 3,
      name: "Dr. Sharma",
      relationship: "Doctor",
      lastSeen: "March 10, 2024",
      meetingCount: 8,
      timeline: [
        { date: "March 10, 2024", activity: "Medical checkup", emotion: "calm", note: "Regular appointment" },
        { date: "Feb 10, 2024", activity: "Follow-up visit", emotion: "calm", note: "Discussed medication" },
      ]
    },
    {
      id: 4,
      name: "Ravi",
      relationship: "Neighbor",
      lastSeen: "March 18, 2024",
      meetingCount: 20,
      timeline: [
        { date: "March 18, 2024", activity: "Morning walk", emotion: "peaceful", note: "Walk in park" },
        { date: "March 16, 2024", activity: "Evening chat", emotion: "calm", note: "Garden conversation" },
      ]
    }
  ];

  const memories = [
    {
      id: 1,
      type: "person",
      name: "Coffee with Yogita",
      date: "March 15, 2024",
      emotion: "happy",
      description: "Great conversation about traveling",
    },
    {
      id: 2,
      type: "place",
      name: "Morning Walk",
      date: "March 18, 2024",
      emotion: "peaceful",
      description: "Beautiful sunrise at the park",
    },
    {
      id: 3,
      type: "person",
      name: "Family Dinner",
      date: "March 12, 2024",
      emotion: "happy",
      description: "Wonderful evening with loved ones",
    },
    {
      id: 4,
      type: "place",
      name: "Beach Visit",
      date: "March 10, 2024",
      emotion: "calm",
      description: "Relaxing afternoon by the ocean",
    },
  ];

  // Gallery state stored in localStorage
  const [images, setImages] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // load images from localStorage
    try {
      const raw = localStorage.getItem("visual_gallery_images");
      if (raw) setImages(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load images", e);
    }
  }, []);

  useEffect(() => {
    // persist images
    try {
      localStorage.setItem("visual_gallery_images", JSON.stringify(images));
    } catch (e) {
      console.error("Failed to save images", e);
    }
  }, [images]);

  const addDataUrlImage = (dataUrl: string, caption?: string) => {
    const item: ImageItem = { id: Date.now().toString(), src: dataUrl, caption, createdAt: new Date().toISOString() };
    setImages((s) => [item, ...s]);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") addDataUrlImage(result, file.name);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const uploadBtn = document.getElementById("upload-btn");
    const openCamBtn = document.getElementById("open-camera");
    const fileInput = document.getElementById("file-input") as HTMLInputElement | null;

    const onUploadClick = () => fileInput?.click();
    const onFilesChange = () => handleFiles(fileInput?.files ?? null);
    const onOpenCam = () => setCameraOpen(true);

    uploadBtn?.addEventListener("click", onUploadClick);
    fileInput?.addEventListener("change", onFilesChange);
    openCamBtn?.addEventListener("click", onOpenCam);

    return () => {
      uploadBtn?.removeEventListener("click", onUploadClick);
      fileInput?.removeEventListener("change", onFilesChange);
      openCamBtn?.removeEventListener("click", onOpenCam);
    };
  }, []);

  // Camera lifecycle
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        console.error("Camera error", e);
        setCameraOpen(false);
      }
    }

    if (cameraOpen) startCamera();
    else {
      // stop stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [cameraOpen]);

  const captureFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    addDataUrlImage(dataUrl, "camera.jpg");
    setCameraOpen(false);
  };

  const deleteImage = (id: string) => setImages((s) => s.filter((i) => i.id !== id));

  const downloadImage = (src: string, filename = "image.jpg") => {
    const a = document.createElement("a");
    a.href = src;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl gradient-warm flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-hover)]">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-primary">Visual Gallery</h1>
          <p className="text-muted-foreground">Faces, places, and cherished moments</p>
        </div>

        {/* Upload Section */}
        <Card className="memory-card mb-8 gradient-warm p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-warm flex items-center justify-center shadow-[var(--shadow-hover)]">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-1">Add New Memory</h3>
                <p className="text-muted-foreground max-w-xl">Upload photos or take pictures to build your visual memory gallery. Images are stored locally in your browser for now.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input id="file-input" type="file" accept="image/*" multiple className="hidden" />
              <Button id="upload-btn" className="gradient-primary hover:opacity-90">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
              <Button id="open-camera" variant="outline">
                <Camera className="w-4 h-4 mr-2" />
                Use Camera
              </Button>
            </div>
          </div>
        </Card>

        {/* People Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-6">Important People</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {people.map((person) => (
              <Card
                key={person.id}
                className="memory-card cursor-pointer group overflow-hidden"
                onClick={() => setSelectedPerson(person.id)}
              >
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <div className="aspect-square bg-gradient-to-br from-warm/20 to-calm/20 flex items-center justify-center transition-transform group-hover:scale-105">
                    <User className="w-20 h-20 text-primary/60" />
                  </div>
                  <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">{person.name}</div>
                        <div className="text-xs text-white/80">{person.relationship}</div>
                      </div>
                      <div className="text-xs text-white/80 text-right">
                        <div>{person.meetingCount} meetings</div>
                        <div>{person.lastSeen}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* User Photos Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Your Photos</h2>
          {images.length === 0 ? (
            <div className="text-sm text-muted-foreground">No photos yet — upload or take one with your camera.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img) => (
                <VisualCard key={img.id} src={img.src} caption={img.caption} onDelete={() => deleteImage(img.id)} onDownload={() => downloadImage(img.src, `mem-${img.id}.jpg`)} />
              ))}
            </div>
          )}
        </div>

        {/* Memory Grid (fallback content) */}
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-6">Recent Memories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memories.map((memory) => (
              <Card key={memory.id} className="memory-card cursor-pointer group overflow-hidden">
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center transition-transform group-hover:scale-105">
                    {memory.type === "person" ? (
                      <User className="w-16 h-16 text-primary/40" />
                    ) : (
                      <MapPin className="w-16 h-16 text-secondary/40" />
                    )}
                  </div>
                  <div className="absolute top-3 left-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs bg-white/80 text-foreground`}>{memory.type}</span>
                  </div>
                  <div className="absolute right-3 top-3">
                    <span className={`emotion-badge emotion-${memory.emotion}`}>{memory.emotion === "happy" ? "😊" : memory.emotion === "calm" ? "😌" : "🕊️"}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-primary mb-1 truncate">{memory.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{memory.date}</p>
                <p className="text-sm text-foreground/90 line-clamp-2">{memory.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Person Timeline Dialog */}
        <Dialog open={selectedPerson !== null} onOpenChange={() => setSelectedPerson(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedPerson && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl gradient-warm flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl text-primary">
                        {people.find(p => p.id === selectedPerson)?.name}
                      </DialogTitle>
                      <p className="text-muted-foreground">
                        {people.find(p => p.id === selectedPerson)?.relationship}
                      </p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Your Timeline Together
                  </h3>
                  
                  <div className="space-y-4">
                    {people.find(p => p.id === selectedPerson)?.timeline.map((event, index) => (
                      <Card key={index} className="memory-card">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 emotion-${event.emotion}`}>
                            <MessageCircle className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-semibold text-primary">{event.activity}</h4>
                              <span className={`emotion-badge emotion-${event.emotion} text-xs`}>
                                {event.emotion === "happy" && "😊"}
                                {event.emotion === "calm" && "😌"}
                                {event.emotion === "peaceful" && "🕊️"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{event.date}</p>
                            <p className="text-foreground/90">{event.note}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Camera Dialog */}
        <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Take Photo</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="bg-black rounded-md overflow-hidden">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-80 object-cover" />
              </div>

              <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" onClick={() => setCameraOpen(false)}>Close</Button>
                <Button onClick={captureFromCamera} className="bg-gradient-primary text-white">Capture</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Recognition Info */}
        <Card className="memory-card mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">AI Visual Recognition</h3>
              <p className="text-muted-foreground">
                Our AI automatically identifies familiar faces and places in your photos, 
                helping you build a rich visual timeline of your memories and relationships.
              </p>
            </div>
          </div>
        </Card>
      </main>

      {/* FloatingAddButton removed per request */}
    </div>
  );
};

export default VisualGallery;
