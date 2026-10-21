/** Tipi di base del simulatore Linux: filesystem virtuale e identità degli utenti. */

export type Perm = "r" | "w" | "x";

export interface Identity {
  name: string;
  uid: number;
  /** Gruppo primario. */
  group: string;
  /** Tutti i gruppi (primario incluso). */
  groups: string[];
}

interface BaseNode {
  owner: string;
  group: string;
  /** Solo i 9 bit di permesso (0o000-0o777). */
  mode: number;
  mtime: number;
}

export interface FileNode extends BaseNode {
  kind: "file";
  content: string;
}

export interface DirNode extends BaseNode {
  kind: "dir";
  children: Record<string, FsNode>;
}

export type FsNode = FileNode | DirNode;

export type FsError = "ENOENT" | "EACCES" | "ENOTDIR" | "EEXIST" | "EISDIR" | "ENOTEMPTY" | "EINVAL" | "EFBIG";

export const ERR_TEXT: Record<FsError, string> = {
  ENOENT: "No such file or directory",
  EACCES: "Permission denied",
  ENOTDIR: "Not a directory",
  EEXIST: "File exists",
  EISDIR: "Is a directory",
  ENOTEMPTY: "Directory not empty",
  EINVAL: "Invalid argument",
  EFBIG: "File too large",
};
