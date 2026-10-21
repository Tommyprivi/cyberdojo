import type { Identity } from "./types";

export const LAB_PASSWORD = "lab123";

type UserInfo = { uid: number; group: string; groups: string[]; home: string; gecos: string };

export const USERS: Record<string, UserInfo> = {
  root: { uid: 0, group: "root", groups: ["root"], home: "/root", gecos: "root" },
  "www-data": { uid: 33, group: "www-data", groups: ["www-data"], home: "/var/www", gecos: "www-data" },
  studente: { uid: 1000, group: "studente", groups: ["studente", "sudo", "users"], home: "/home/studente", gecos: "Studente CyberDojo" },
  ospite: { uid: 1001, group: "ospite", groups: ["ospite", "users"], home: "/home/ospite", gecos: "Utente ospite" },
  alice: { uid: 1002, group: "alice", groups: ["alice", "lab", "users"], home: "/home/alice", gecos: "Alice" },
  bob: { uid: 1003, group: "bob", groups: ["bob", "lab", "users"], home: "/home/bob", gecos: "Bob" },
};

export const GROUPS: Record<string, number> = {
  root: 0,
  adm: 4,
  "www-data": 33,
  sudo: 27,
  users: 100,
  studente: 1000,
  ospite: 1001,
  alice: 1002,
  bob: 1003,
  lab: 2000,
};

export function identityOf(name: string): Identity | null {
  const u = Object.hasOwn(USERS, name) ? USERS[name] : undefined;
  return u ? { name, uid: u.uid, group: u.group, groups: u.groups } : null;
}

export const userExists = (name: string) => Object.hasOwn(USERS, name);
export const groupExists = (name: string) => Object.hasOwn(GROUPS, name);

/** Contenuto coerente di /etc/passwd e /etc/group, generato dalle tabelle sopra. */
export function passwdText(): string {
  return (
    Object.entries(USERS)
      .map(([n, u]) => `${n}:x:${u.uid}:${GROUPS[u.group]}:${u.gecos}:${u.home}:${u.uid >= 1000 ? "/bin/bash" : u.uid === 0 ? "/bin/bash" : "/usr/sbin/nologin"}`)
      .join("\n") + "\n"
  );
}

export function groupText(): string {
  return (
    Object.entries(GROUPS)
      .map(([g, gid]) => {
        const members = Object.entries(USERS)
          .filter(([, u]) => u.groups.includes(g) && u.group !== g)
          .map(([n]) => n);
        return `${g}:x:${gid}:${members.join(",")}`;
      })
      .join("\n") + "\n"
  );
}
