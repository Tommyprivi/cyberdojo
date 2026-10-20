import type { CourseId } from "./courses";

/** Illustrazioni dei corsi e dei moduli (public/img/corsi). I moduli senza copertina propria usano quella del corso. */

export const COURSE_COVER: Record<CourseId, string> = {
  F: "/img/corsi/fondamenta.jpg",
  C: "/img/corsi/cybersecurity.jpg",
  D: "/img/corsi/dati.jpg", // provvisoria: da sostituire con la copertina vera
};

const MODULE_COVER: Record<string, string> = {
  F1: "/img/corsi/computer.jpg",
  F2: "/img/corsi/linux-1.jpg",
  F7: "/img/corsi/reti-3.jpg",
  F8: "/img/corsi/reti-4.jpg",
  F9: "/img/corsi/python.jpg",
  F10: "/img/corsi/progetto-cintura.jpg",
  C9: "/img/corsi/forensics.jpg",
  C10: "/img/corsi/privacy.jpg",
  C11: "/img/corsi/prossimi-passi.jpg",
};

export function moduleCover(course: CourseId, n: number): { src: string; own: boolean } {
  const own = MODULE_COVER[`${course}${n}`];
  return own ? { src: own, own: true } : { src: COURSE_COVER[course], own: false };
}
