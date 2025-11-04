import { Camera, Upload, User, MapPin, X, Heart, MessageCircle, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { ensureModelsLoaded, getDescriptorFromDataUrl, euclideanDistance } from "@/lib/face";
import { getGpsFromDataUrl } from "@/lib/exif";
import VisualCard from "@/components/VisualCard";

type ImageItem = { id: string; src: string; caption?: string; createdAt: string; photoDate?: string; name?: string; relation?: string; note?: string; faceDescriptor?: number[]; gps?: { lat: number; lon: number }; place?: string };
type Person = { id: string; name: string; relationship?: string; lastSeen?: string; meetingCount?: number; timeline?: any[]; avatarSrc?: string; faceDescriptor?: number[] };

const VisualGallery = () => {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  // people is now dynamic and persisted to localStorage. Start empty and load.
  const [people, setPeople] = useState<Person[]>([]);
  const [metaAddPerson, setMetaAddPerson] = useState(false);

  // Memories (persisted) - user can add memories with optional photo
  const [memories, setMemories] = useState<any[]>([]);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [memoryTitle, setMemoryTitle] = useState("");
  const [memoryPersonId, setMemoryPersonId] = useState<string | null>(null);
  const [memoryType, setMemoryType] = useState<"person"|"place">("person");
  const [memoryEmotion, setMemoryEmotion] = useState<string>("");
  const [memoryDate, setMemoryDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [memoryDescription, setMemoryDescription] = useState("");
  const [memoryPhoto, setMemoryPhoto] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("visual_memories");
      if (raw) setMemories(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load memories", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("visual_memories", JSON.stringify(memories));
    } catch (e) {
      console.error("Failed to save memories", e);
    }
  }, [memories]);

  const handleMemoryPhotoFile = (file?: File | null) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      const res = ev.target?.result;
      if (typeof res === 'string') setMemoryPhoto(res);
    };
    r.readAsDataURL(file);
  };

  const saveMemory = () => {
    if (!memoryTitle) return;
    // create memory object
    const mem: any = {
      id: Date.now().toString(),
      type: memoryType,
      name: memoryTitle,
      date: memoryDate,
      emotion: memoryEmotion,
      description: memoryDescription,
      imageSrc: memoryPhoto || undefined,
    };

    // Prefer explicit selected person; fallback to title matching
    const matched = memoryPersonId ? people.find(p => p.id === memoryPersonId) : people.find(p => (p.name || '').toLowerCase().trim() === memoryTitle.toLowerCase().trim());
    if (matched) {
      mem.personId = matched.id;
      // append to person's timeline
      const event = { date: memoryDate, activity: memoryTitle, emotion: memoryEmotion || '', note: memoryDescription || '', imageSrc: memoryPhoto || undefined };
      setPeople((ps) => ps.map(p => p.id === matched.id ? { ...p, timeline: [ ...(p.timeline||[]), event ], lastSeen: memoryDate, meetingCount: (p.meetingCount||0) + 1 } : p));
    }

    setMemories((m) => [mem, ...m]);
    // if photo included, also add to gallery and assign to matched person when available
    if (memoryPhoto) {
      const nameToUse = matched ? matched.name : undefined;
      const relationToUse = matched ? matched.relationship : undefined;
      addDataUrlImage(memoryPhoto, memoryTitle, nameToUse, relationToUse, memoryDescription);
      // set its photoDate to memoryDate for the newly added image (it will be at index 0)
      setImages((imgs) => imgs.map((it, idx) => idx === 0 && it.src === memoryPhoto ? { ...it, photoDate: memoryDate, name: nameToUse || it.name, relation: relationToUse || it.relation } : it));
    }
    // reset form
  setMemoryOpen(false);
  setMemoryTitle("");
  setMemoryDate(new Date().toISOString().slice(0,10));
    setMemoryDescription("");
    setMemoryPhoto(null);
    setMemoryEmotion("");
  };

  // Gallery state stored in localStorage
  const [images, setImages] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [metaOpen, setMetaOpen] = useState(false);
  const [pendingDataUrl, setPendingDataUrl] = useState<string | null>(null);
  const [metaName, setMetaName] = useState("");
  const [metaRelation, setMetaRelation] = useState("");
  const [metaDate, setMetaDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [metaNote, setMetaNote] = useState("");
  const [metaAvatar, setMetaAvatar] = useState<string | null>(null);
  const [pendingQueue, setPendingQueue] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  // person timeline event states (used in person dialog)
  const [eventDate, setEventDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [eventNote, setEventNote] = useState<string>("");
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [previewPersonId, setPreviewPersonId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
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

  // after images load, compute face descriptors for any images missing them
  useEffect(() => {
    if (images.length === 0) return;
    (async () => {
      const ok = await ensureModelsLoaded();
      if (!ok) return;
      // process images that lack faceDescriptor
      for (const img of images) {
        if (!img.faceDescriptor) {
          try {
            const desc = await getDescriptorFromDataUrl(img.src);
            if (desc) {
              setImages((imgs) => imgs.map((it) => it.id === img.id ? { ...it, faceDescriptor: desc } : it));
              // attempt to match to an existing person
              if (people.length > 0) {
                let bestId: string | null = null;
                let bestDist = Infinity;
                people.forEach((p) => {
                  if (p.faceDescriptor) {
                    const d = euclideanDistance(p.faceDescriptor, desc);
                    if (d < bestDist) { bestDist = d; bestId = p.id; }
                  }
                });
                if (bestId && bestDist < 0.6) {
                  const person = people.find(p => p.id === bestId);
                  if (person) {
                    setImages((imgs) => imgs.map((it) => it.id === img.id ? { ...it, name: person.name, relation: person.relationship } : it));
                  }
                }
              }
            }
          } catch (e) {
            console.warn('descriptor compute failed', e);
          }
        }
      }
    })();
  }, [images]);

  // load important people from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("visual_gallery_people");
      if (raw) setPeople(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load people", e);
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

  // persist people
  useEffect(() => {
    try {
      localStorage.setItem("visual_gallery_people", JSON.stringify(people));
    } catch (e) {
      console.error("Failed to save people", e);
    }
  }, [people]);

  const addDataUrlImage = (dataUrl: string, caption?: string, name?: string, relation?: string, note?: string) => {
    const item: ImageItem = {
      id: Date.now().toString(),
      src: dataUrl,
      caption,
      createdAt: new Date().toISOString(),
      photoDate: undefined,
      name,
      relation,
      note,
    };
    setImages((s) => [item, ...s]);

    // start async face descriptor compute and assignment
    (async () => {
      const ok = await ensureModelsLoaded();
      if (!ok) return;
      const desc = await getDescriptorFromDataUrl(dataUrl);
      if (!desc) return;
      // update the image with faceDescriptor
      setImages((imgs) => imgs.map((it) => it.id === item.id ? { ...it, faceDescriptor: desc } : it));
      // try to extract GPS/place
      try {
        const gps = await getGpsFromDataUrl(dataUrl);
        if (gps) setImages((imgs) => imgs.map((it) => it.id === item.id ? { ...it, gps, place: `GPS ${gps.lat.toFixed(4)}, ${gps.lon.toFixed(4)}` } : it));
      } catch (e) {
        // ignore
      }
      // try to assign to a known person
      if (desc && people.length > 0) {
        let bestId: string | null = null;
        let bestDist = Infinity;
        people.forEach((p) => {
          if (p.faceDescriptor) {
            const d = euclideanDistance(p.faceDescriptor, desc);
            if (d < bestDist) { bestDist = d; bestId = p.id; }
          }
        });
        // threshold for face match (tweakable)
        if (bestId && bestDist < 0.6) {
          // assign image.name to person's name
          const person = people.find(p => p.id === bestId);
          if (person) {
            setImages((imgs) => imgs.map((it) => it.id === item.id ? { ...it, name: person.name, relation: person.relationship } : it));
          }
        }
      }
    })();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          // enqueue the dataUrl to prompt for metadata before saving
          setPendingQueue((q) => [...q, result]);
        }
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
    // close camera and open metadata dialog to collect name/relation/note
    setCameraOpen(false);
    setPendingDataUrl(dataUrl);
    setEditingId(null);
    setMetaName("");
    setMetaRelation("");
    setMetaNote("");
    setMetaDate(new Date().toISOString().slice(0, 10));
    setMetaOpen(true);
  };

  const savePendingWithMeta = () => {
    // allow saving when adding a person without an image (metaAddPerson flow), otherwise require a pending image
    if (!pendingDataUrl && !(metaAddPerson && !editingId)) return;
    // use metaNote as caption if present, otherwise fallback to name+relation
    const caption = metaNote || (metaName ? `${metaName} • ${metaRelation || ""}` : "");
    if (editingId) {
      // update existing image metadata
      setImages((imgs) => imgs.map((it) => it.id === editingId ? { ...it, caption, name: metaName || undefined, relation: metaRelation || undefined, note: metaNote || undefined } : it));
      setEditingId(null);
    } else {
      if (pendingDataUrl) {
        addDataUrlImage(pendingDataUrl, caption, metaName || undefined, metaRelation || undefined, metaNote || undefined);
      }
    }
    // If user marked this as an important person, add to people list
    if (metaAddPerson && metaName) {
      const avatar = metaAvatar || pendingDataUrl || undefined;
      const newPerson = {
        id: Date.now().toString(),
        name: metaName,
        relationship: metaRelation || undefined,
        lastSeen: new Date().toLocaleDateString(),
        meetingCount: 1,
        timeline: [{ date: new Date().toLocaleDateString(), activity: "Added from photo", emotion: "", note: metaNote || "" }],
        avatarSrc: avatar,
      } as Person;

      // if avatar exists, compute face descriptor and attach to person before saving
      if (avatar) {
        (async () => {
          const ok = await ensureModelsLoaded();
          if (!ok) {
            setPeople((p) => [newPerson, ...p]);
            return;
          }
          const desc = await getDescriptorFromDataUrl(avatar);
          if (desc) newPerson.faceDescriptor = desc;
          setPeople((p) => [newPerson, ...p]);

          // assign any existing images that match this new person's descriptor
          if (desc) {
            setImages((imgs) => imgs.map((it) => {
              if (it.faceDescriptor && !it.name) {
                const d = euclideanDistance(it.faceDescriptor, desc);
                if (d < 0.6) return { ...it, name: newPerson.name, relation: newPerson.relationship };
              }
              return it;
            }));
          }
        })();
      } else {
        setPeople((p) => [newPerson, ...p]);
      }

      // If user uploaded an avatar (metaAvatar), optionally add it to the images gallery too
      if (metaAvatar) {
        const avatarCaption = `Avatar: ${metaName}`;
        addDataUrlImage(metaAvatar, avatarCaption, metaName, metaRelation || undefined, metaNote || undefined);
        // set its photoDate to the selected metaDate
        setImages((imgs) => imgs.map((it, idx) => idx === 0 && it.src === metaAvatar ? { ...it, photoDate: metaDate || undefined } : it));
      }

      // reset flag
      setMetaAddPerson(false);
      setMetaAvatar(null);
    }
    // Update the photoDate on the last added image (if any) or on the edited image
    if (pendingDataUrl) {
      if (!editingId) {
        setImages((imgs) => imgs.map((it, idx) => idx === 0 && it.src === pendingDataUrl ? { ...it, photoDate: metaDate || undefined } : it));
      } else {
        setImages((imgs) => imgs.map((it) => it.id === editingId ? { ...it, photoDate: metaDate || undefined } : it));
      }
    }

    setPendingDataUrl(null);
    setMetaOpen(false);

    // if there is a pending upload queue, move to next
    setPendingQueue((q) => {
      const [, ...rest] = q;
      if (rest.length > 0) {
        // start next
        setPendingDataUrl(rest[0]);
        setMetaName("");
        setMetaRelation("");
        setMetaNote("");
        setMetaOpen(true);
      }
      return rest;
    });
  };

  const cancelPendingMeta = () => {
    setPendingDataUrl(null);
    setMetaOpen(false);
    setEditingId(null);
    setMetaAvatar(null);
    setMetaAddPerson(false);
    // remove current queued item if any
    setPendingQueue((q) => {
      const [, ...rest] = q;
      if (rest.length > 0) {
        setPendingDataUrl(rest[0]);
        setMetaOpen(true);
      }
      return rest;
    });
  };

  // process queue: when pendingQueue receives items and no meta dialog is open, start the first
  useEffect(() => {
    if (!metaOpen && pendingQueue.length > 0 && !pendingDataUrl) {
      setPendingDataUrl(pendingQueue[0]);
      setMetaName("");
      setMetaRelation("");
      setMetaNote("");
      setMetaAvatar(null);
      setMetaOpen(true);
    }
  }, [pendingQueue, metaOpen, pendingDataUrl]);

  const openEdit = (id: string) => {
    const img = images.find((it) => it.id === id);
    if (!img) return;
    setEditingId(id);
    setPendingDataUrl(img.src);
    setMetaName(img.name || "");
    setMetaRelation(img.relation || "");
    setMetaNote(img.note || "");
    setMetaDate(img.photoDate || img.createdAt?.slice(0,10) || new Date().toISOString().slice(0,10));
    setMetaOpen(true);
  };

  // handle upload for person timeline event image
  const handleEventImageFile = (file?: File | null) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      const res = ev.target?.result;
      if (typeof res === 'string') setEventImage(res);
    };
    r.readAsDataURL(file);
  };

  const addTimelineEvent = (personId: string) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;

    const event = {
      date: eventDate,
      activity: eventNote || 'Event',
      emotion: '',
      note: eventNote || '',
      imageSrc: eventImage || undefined,
    };

    // append to person's timeline
    setPeople((ps) => ps.map(p => p.id === personId ? { ...p, timeline: [ ...(p.timeline||[]), event ], lastSeen: eventDate, meetingCount: (p.meetingCount||0) + 1 } : p));

    // if there's an event image, add it to images and set its photoDate
    if (eventImage) {
      const caption = eventNote || `${person.name} • ${person.relationship || ''}`;
      addDataUrlImage(eventImage, caption, person.name, person.relationship, eventNote);
      // set photoDate for the newly added image (it will be at index 0)
      setImages((imgs) => imgs.map((it, idx) => idx === 0 && it.src === eventImage ? { ...it, photoDate: eventDate } : it));
    }

    // clear event input fields
    setEventDate(new Date().toISOString().slice(0,10));
    setEventNote("");
    setEventImage(null);
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-primary">Important People</h2>
            <Button variant="outline" onClick={() => {
              // open a small add-person modal by reusing metadata dialog fields
              setSelectedPerson(null);
              setMetaName("");
              setMetaRelation("");
              setMetaNote("");
              setMetaAddPerson(true);
              setMetaAvatar(null);
              setMetaDate(new Date().toISOString().slice(0,10));
              setMetaOpen(true);
            }}>Add Person</Button>
          </div>

          {people.length === 0 ? (
            <div className="text-sm text-muted-foreground">No important people yet. Mark someone as important when you upload or take a photo, or use the Add Person button.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {people.map((person) => (
                <Card
                  key={person.id}
                  className="memory-card cursor-pointer group overflow-hidden"
                  onClick={() => setSelectedPerson(person.id)}
                >
                  <div className="relative rounded-xl overflow-hidden mb-4">
                    <div className="aspect-square bg-gradient-to-br from-warm/20 to-calm/20 flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
                      {person.avatarSrc ? (
                        <img src={person.avatarSrc} alt={person.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-20 h-20 text-primary/60" />
                      )}
                    </div>
                    <div className="absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold">{person.name}</div>
                          <div className="text-xs text-white/80">{person.relationship}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-white/80 text-right mr-3">
                            <div>{person.meetingCount || 1} meetings</div>
                            <div>{person.lastSeen}</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation();
                              // delete person
                              setPeople((ps) => ps.filter(p => p.id !== person.id));
                            }}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Photos and People side-by-side */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Your Photos Grid (grouped by date) */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">Your Photos</h2>
            {images.length === 0 ? (
              <div className="text-sm text-muted-foreground">No photos yet — upload or take one with your camera.</div>
            ) : (
              <div className="space-y-8">
                {
                  // group images by photoDate (fall back to createdAt date portion)
                  (() => {
                    const byDate: Record<string, ImageItem[]> = {};
                    images.slice().forEach((img) => {
                      const key = img.photoDate || (img.createdAt ? img.createdAt.slice(0,10) : new Date().toISOString().slice(0,10));
                      if (!byDate[key]) byDate[key] = [];
                      byDate[key].push(img);
                    });
                    const dates = Object.keys(byDate).sort((a,b) => b.localeCompare(a));
                    return dates.map((d) => (
                      <div key={d}>
                        <h3 className="text-lg font-semibold text-primary mb-3">{new Date(d).toLocaleDateString()}</h3>
                        <div className="border-l-2 border-primary/10 pl-4">
                          {byDate[d].map((img) => (
                            <div key={img.id} className="flex items-start gap-3 mb-3">
                              <div className="w-6 flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-primary mt-1" />
                              </div>
                              <img src={img.src} alt={img.caption} className="w-20 h-12 object-cover rounded-md flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{img.caption || (img.name ? `${img.name} • ${img.relation || ''}` : 'Photo')}</div>
                                <div className="text-xs text-muted-foreground">{new Date(img.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{img.photoDate ? ` • ${new Date(img.photoDate).toLocaleDateString()}` : ''}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="p-1 bg-white/80 rounded-md text-xs" onClick={() => openEdit(img.id)}>Edit</button>
                                <button className="p-1 bg-white/80 rounded-md text-xs" onClick={() => downloadImage(img.src, `mem-${img.id}.jpg`)}>Download</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()
                }
              </div>
            )}
          </div>

          {/* Right: Photos grouped by person (avatars only) */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">Photos by Person</h2>
            {images.length === 0 ? (
              <div className="text-sm text-muted-foreground">No photos yet — upload or take one with your camera.</div>
            ) : (
              <div className="space-y-6">
                {
                  // Group by person (match image.name to person.name case-insensitive)
                  (() => {
                    const byPerson: Record<string, ImageItem[]> = {};
                    const nameToPersonId: Record<string, string> = {};
                    people.forEach((p) => { nameToPersonId[p.name?.toLowerCase().trim() || ''] = p.id; });

                    images.forEach((img) => {
                      const key = img.name ? (nameToPersonId[img.name.toLowerCase().trim()] || img.name.toLowerCase().trim()) : 'Unrecognized';
                      if (!byPerson[key]) byPerson[key] = [];
                      byPerson[key].push(img);
                    });

                    // order: people first (by their id order), then Unrecognized
                    const orderedKeys: string[] = [];
                    people.forEach((p) => {
                      if (byPerson[p.id]) orderedKeys.push(p.id);
                      else if (byPerson[p.name?.toLowerCase().trim() || '']) orderedKeys.push(p.name.toLowerCase().trim());
                    });
                    // add other keys
                    Object.keys(byPerson).forEach((k) => { if (!orderedKeys.includes(k)) orderedKeys.push(k); });

                    return orderedKeys.map((k) => {
                      // find person by id or by lowercased name
                      const person = people.find(p => p.id === k) || people.find(p => (p.name || '').toLowerCase().trim() === k);
                      const label = person ? person.name : (k === 'Unrecognized' ? 'Unrecognized' : k);
                      return (
                        <div key={k}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <button onClick={() => { setPreviewPersonId(person?.id || (typeof label === 'string' ? label : null)); setPreviewOpen(true); }} className="rounded-full w-12 h-12 overflow-hidden border-2 border-primary/20 flex items-center justify-center">
                                {person?.avatarSrc ? (
                                  <img src={person.avatarSrc} alt={label} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-6 h-6 text-primary/60" />
                                )}
                              </button>
                              <div>
                                <div className="font-semibold text-primary">{label}</div>
                                <div className="text-xs text-muted-foreground">{byPerson[k].length} photos</div>
                              </div>
                            </div>

                            {/* Optionally add controls per-person here (edit person, delete) */}
                            <div />
                          </div>

                          {/* photos are shown in the preview modal; main list only shows avatars */}
                        </div>
                      );
                    });
                  })()
                }
              </div>
            )}
          </div>
        </div>

        {/* Memory Grid (fallback content) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-primary">Recent Memories</h2>
            <Button onClick={() => setMemoryOpen(true)} className="bg-gradient-primary text-white">Add Memory</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memories.length === 0 ? (
              <div className="text-sm text-muted-foreground">No memories yet — add one with a photo, title and short description.</div>
            ) : (
              memories.map((memory) => (
                <Card key={memory.id} className="memory-card cursor-pointer group overflow-hidden">
                  <div className="relative rounded-xl overflow-hidden mb-4">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center transition-transform group-hover:scale-105">
                      {memory.imageSrc ? (
                        <img src={memory.imageSrc} alt={memory.name} className="w-full h-full object-cover" />
                      ) : memory.type === "person" ? (
                        <User className="w-16 h-16 text-primary/40" />
                      ) : (
                        <MapPin className="w-16 h-16 text-secondary/40" />
                      )}
                    </div>
                    <div className="absolute top-3 left-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs bg-white/80 text-foreground`}>{memory.type}</span>
                    </div>
                    <div className="absolute right-3 top-3 flex items-center gap-2">
                      <span className={`emotion-badge emotion-${memory.emotion}`}>{memory.emotion === "happy" ? "😊" : memory.emotion === "calm" ? "😌" : "🕊️"}</span>
                      <Button variant="ghost" size="sm" onClick={() => {
                        // delete memory
                        setMemories((ms) => ms.filter((x) => x.id !== memory.id));
                      }}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-primary mb-1 truncate">{memory.name}{memory.personId ? ` • ${ (people.find(p=>p.id===memory.personId)?.name) || ''}` : ''}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{new Date(memory.date).toLocaleDateString()}</p>
                  <p className="text-sm text-foreground/90 line-clamp-2">{memory.description}</p>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Add Memory Dialog */}
        <Dialog open={memoryOpen} onOpenChange={setMemoryOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Memory</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              <label className="flex flex-col">
                <span className="text-sm">Link to person (optional)</span>
                <select value={memoryPersonId ?? ""} onChange={(e) => { setMemoryPersonId(e.target.value || null); if (e.target.value) setMemoryTitle((people.find(p=>p.id===e.target.value)?.name)||"") }} className="w-full border rounded px-2 py-2">
                  <option value="">— None —</option>
                  {people.map(p => (
                    <option key={p.id} value={p.id}>{p.name}{p.relationship ? ` • ${p.relationship}` : ''}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm">Title</span>
                <input value={memoryTitle} onChange={(e) => { setMemoryTitle(e.target.value); if (e.target.value === '' ) setMemoryPersonId(null); }} placeholder="Short title" className="w-full border rounded px-3 py-2" />
              </label>

              <label className="flex items-center gap-2">
                <span className="text-sm">Type</span>
                <select value={memoryType} onChange={(e) => setMemoryType(e.target.value as any)} className="border rounded px-2 py-1">
                  <option value="person">Person</option>
                  <option value="place">Place</option>
                </select>
                <span className="ml-4 text-sm">Emotion</span>
                <select value={memoryEmotion} onChange={(e) => setMemoryEmotion(e.target.value)} className="border rounded px-2 py-1">
                  <option value="">—</option>
                  <option value="happy">Happy</option>
                  <option value="calm">Calm</option>
                  <option value="peaceful">Peaceful</option>
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-sm">Date</span>
                <input type="date" value={memoryDate} onChange={(e) => setMemoryDate(e.target.value)} className="w-full border rounded px-3 py-2" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm">Description</span>
                <textarea value={memoryDescription} onChange={(e) => setMemoryDescription(e.target.value)} placeholder="Short description" className="w-full border rounded px-3 py-2" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm">Photo (optional)</span>
                <input type="file" accept="image/*" onChange={(e) => handleMemoryPhotoFile(e.target.files?.[0] ?? null)} />
                {memoryPhoto && (
                  <div className="mt-2 w-36 h-28 rounded overflow-hidden">
                    <img src={memoryPhoto} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </label>

              <div className="flex items-center justify-end gap-2 mt-3">
                <Button variant="outline" onClick={() => { setMemoryOpen(false); }}>Cancel</Button>
                <Button onClick={saveMemory} className="bg-gradient-primary text-white" disabled={!memoryTitle}>Save Memory</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Person Timeline Dialog */}
        <Dialog open={selectedPerson !== null} onOpenChange={() => setSelectedPerson(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedPerson && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl gradient-warm flex items-center justify-center overflow-hidden">
                      {people.find(p => p.id === selectedPerson)?.avatarSrc ? (
                        <img src={people.find(p => p.id === selectedPerson)?.avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-white" />
                      )}
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
                    {people.find(p => p.id === selectedPerson)?.timeline?.map((event, index) => (
                      <Card key={index} className="memory-card">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 emotion-${event.emotion}`}>
                            {event.imageSrc ? (
                              <img src={event.imageSrc} alt={event.activity} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <MessageCircle className="w-6 h-6" />
                            )}
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

                    {/* Add new event form */}
                    <Card className="p-4">
                      <h4 className="font-semibold text-primary mb-2">Add event</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <label className="flex flex-col">
                          <span className="text-sm">Date</span>
                          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full border rounded px-3 py-2" />
                        </label>

                        <label className="flex flex-col">
                          <span className="text-sm">Description</span>
                          <input value={eventNote} onChange={(e) => setEventNote(e.target.value)} placeholder="Short description" className="w-full border rounded px-3 py-2" />
                        </label>

                        <label className="flex flex-col">
                          <span className="text-sm">Photo (optional)</span>
                          <input type="file" accept="image/*" onChange={(e) => handleEventImageFile(e.target.files?.[0] ?? null)} />
                          {eventImage && (
                            <div className="mt-2 w-36 h-28 rounded overflow-hidden">
                              <img src={eventImage} alt="event preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </label>

                        <div className="flex items-center justify-end gap-2 mt-2">
                          <Button variant="outline" onClick={() => { setEventDate(new Date().toISOString().slice(0,10)); setEventNote(""); setEventImage(null); }}>Reset</Button>
                          <Button onClick={() => { if (selectedPerson) addTimelineEvent(selectedPerson); }} className="bg-gradient-primary text-white">Add Event</Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Small preview modal for person (relation + top events) */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Person preview</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              {previewPersonId && (
                (() => {
                  // previewPersonId may be a person.id or a string label like 'Unrecognized'
                  const person = people.find(p => p.id === previewPersonId);
                  let label: string | null = null;
                  let imagesFor: ImageItem[] = [];
                  if (person) {
                    label = person.name;
                    imagesFor = images.filter(img => img.name && img.name.toLowerCase().trim() === person.name.toLowerCase().trim());
                  } else if (typeof previewPersonId === 'string') {
                    label = previewPersonId;
                    if (previewPersonId === 'Unrecognized') {
                      imagesFor = images.filter(img => !img.name);
                    } else {
                      imagesFor = images.filter(img => img.name && img.name.toLowerCase().trim() === previewPersonId.toLowerCase().trim());
                    }
                  }

                  if (!label) return <div className="text-sm text-muted-foreground">Person not found</div>;

                  const events = person ? ((person.timeline || []).slice().sort((a,b) => (new Date(b.date).getTime() - new Date(a.date).getTime())).slice(0,5)) : [];

                  return (
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-16 h-16 rounded-full overflow-hidden border">
                          {person?.avatarSrc ? <img src={person!.avatarSrc} alt={person!.name} className="w-full h-full object-cover" /> : <User className="w-8 h-8 m-3" />}
                        </div>
                        <div>
                          <div className="text-lg font-semibold">{label}</div>
                          <div className="text-sm text-muted-foreground">{person?.relationship}</div>
                        </div>
                      </div>

                      {/* Events (if any) */}
                      {events.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {events.map((ev:any, idx:number) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                                {ev.imageSrc ? <img src={ev.imageSrc} className="w-full h-full object-cover" alt={ev.activity} /> : <MessageCircle className="w-6 h-6 m-3" />}
                              </div>
                              <div>
                                <div className="text-sm font-medium">{ev.activity || ev.note || 'Event'}</div>
                                <div className="text-xs text-muted-foreground">{new Date(ev.date).toLocaleDateString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Photos for this person/label */}
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Photos</h4>
                        {imagesFor.length === 0 ? (
                          <div className="text-sm text-muted-foreground">No photos for {label}</div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {imagesFor.map((img) => (
                              <VisualCard
                                key={img.id}
                                src={img.src}
                                caption={img.caption}
                                name={img.name}
                                relation={img.relation}
                                onDelete={() => deleteImage(img.id)}
                                onDownload={() => downloadImage(img.src, `mem-${img.id}.jpg`)}
                                onEdit={() => { setPreviewOpen(false); openEdit(img.id); }}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 mt-4">
                        {person && <Button variant="outline" onClick={() => { setPreviewOpen(false); setSelectedPerson(person.id); }}>View full timeline</Button>}
                        <Button onClick={() => setPreviewOpen(false)} className="bg-gradient-primary text-white">Close</Button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
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

        {/* Metadata Dialog shown after taking a photo */}
        <Dialog open={metaOpen} onOpenChange={setMetaOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Photo details</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">Tell us who is in the photo and a short note to remember why it's special.</p>
              <input value={metaName} onChange={(e) => setMetaName(e.target.value)} placeholder="Name (e.g. Mom, Yogita)" className="w-full border rounded px-3 py-2" />
              <input value={metaRelation} onChange={(e) => setMetaRelation(e.target.value)} placeholder="Relation (e.g. Mother, Friend)" className="w-full border rounded px-3 py-2" />
              <input value={metaNote} onChange={(e) => setMetaNote(e.target.value)} placeholder="One-line description" className="w-full border rounded px-3 py-2" />

              <label className="flex flex-col gap-1 mt-2">
                <span className="text-sm">Upload person photo (optional)</span>
                <input type="file" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = (ev) => {
                    const res = ev.target?.result;
                    if (typeof res === 'string') setMetaAvatar(res);
                  };
                  r.readAsDataURL(f);
                }} className="w-full" />
                {metaAvatar && (
                  <div className="mt-2 w-28 h-28 rounded overflow-hidden">
                    <img src={metaAvatar} alt="avatar preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </label>

              <label className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={metaAddPerson} onChange={(e) => setMetaAddPerson(e.target.checked)} />
                <span className="text-sm">Add this person to Important People</span>
              </label>

              <label className="flex flex-col gap-1 mt-2">
                <span className="text-sm">Photo date</span>
                <input type="date" value={metaDate} onChange={(e) => setMetaDate(e.target.value)} className="w-full border rounded px-3 py-2" />
              </label>

              <div className="flex items-center justify-end gap-2 mt-3">
                <Button variant="outline" onClick={cancelPendingMeta}>Cancel</Button>
                <Button onClick={savePendingWithMeta} className="bg-gradient-primary text-white" disabled={metaAddPerson && !metaName}>Save Photo</Button>
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
