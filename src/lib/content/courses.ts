/** Albero dei corsi: fonte unica per titoli di corsi e moduli (sezione 3 della spec + C11). */

export type CourseDef = {
  id: "F" | "C";
  folder: string;
  title: string;
  modules: { n: number; title: string; summary: string }[];
};

export const COURSES: CourseDef[] = [
  {
    id: "F",
    folder: "fondamenta",
    title: "Fondamenta IT, Linux e Reti",
    modules: [
      { n: 1, title: "Come funziona un computer", summary: "Hardware, binario, sistema operativo, macchine virtuali, laboratorio, installare Kali" },
      { n: 2, title: "Linux 1", summary: "Terminale, filesystem, file, editor" },
      { n: 3, title: "Linux 2", summary: "Utenti, permessi, processi, servizi, pacchetti" },
      { n: 4, title: "Linux 3", summary: "Pipe, grep, bash scripting, cron" },
      { n: 5, title: "Reti 1", summary: "IP, binario e ottetti, modello OSI, incapsulamento, MAC e ARP" },
      { n: 6, title: "Reti 2", summary: "Subnet mask, CIDR, sottoreti, routing" },
      { n: 7, title: "Reti 3", summary: "TCP/UDP, porte, DNS, HTTP/HTTPS, DHCP, NAT" },
      { n: 8, title: "Reti 4", summary: "Wireshark, Packet Tracer, VLAN, ACL, VPN, IPv6" },
      { n: 9, title: "Python per l'IT", summary: "Basi, file, socket, automazione" },
      { n: 10, title: "Progetto e cintura", summary: "Rete aziendale completa ed esame di cintura" },
    ],
  },
  {
    id: "C",
    folder: "cybersecurity",
    title: "Cybersecurity",
    modules: [
      { n: 1, title: "Principi", summary: "Triade CIA, rischio, modello di minaccia, etica e legge" },
      { n: 2, title: "Crittografia", summary: "Hash, cifratura simmetrica e asimmetrica, firme, TLS" },
      { n: 3, title: "Identità e autenticazione", summary: "Password, salt, 2FA, sessioni, gestione accessi" },
      { n: 4, title: "Sicurezza di rete", summary: "Firewall, IDS/IPS, segmentazione, VPN" },
      { n: 5, title: "Web security", summary: "OWASP Top 10, difese, applicazioni vulnerabili in locale" },
      { n: 6, title: "Database e dati", summary: "SQL, SQL injection e query sicure, backup" },
      { n: 7, title: "Blue team", summary: "Log, SIEM, hardening, monitoraggio, fail2ban" },
      { n: 8, title: "Attacco etico in lab", summary: "Laboratorio isolato, ricognizione, scansioni, report" },
      { n: 9, title: "Forensics e incident response", summary: "Raccolta prove, analisi, risposta, ripristino" },
      { n: 10, title: "Privacy, anonimato e progetto", summary: "Privacy, anonimato e sicurezza, VPN, Tor, fingerprinting, progetto finale" },
      { n: 11, title: "Prossimi passi", summary: "Risorse verificate, certificazioni, CTF italiane e costruzione del tuo home lab" },
    ],
  },
];

export function getCourseById(id: string) {
  return COURSES.find((c) => c.id === id);
}

export function getCourseByFolder(folder: string) {
  return COURSES.find((c) => c.folder === folder);
}
