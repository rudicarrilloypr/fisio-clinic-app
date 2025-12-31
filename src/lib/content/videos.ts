import type { BodyZone } from "./services";

export type VideoItem = {
  id: string;
  zone: BodyZone;
  title: string;
  url: string; // youtube/vimeo/etc
  level: "basic" | "intermediate";
  warning: string;
};

export const VIDEOS: VideoItem[] = [
  {
    id: "knee-basic-1",
    zone: "knee",
    title: "Movilidad básica de rodilla",
    url: "https://example.com/video",
    level: "basic",
    warning: "Si sientes dolor agudo, suspende y consulta a tu fisioterapeuta.",
  },
];
