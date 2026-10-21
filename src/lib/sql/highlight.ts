export type SqlToken = { type: "keyword" | "string" | "number" | "comment" | "text"; text: string };

const KEYWORDS = new Set(
  (
    "select from where group by having order limit offset distinct as and or not in is null like ilike between exists case when then else end " +
    "join inner left right full outer cross on using union all intersect except insert into values update set delete create table drop alter add column " +
    "primary key foreign references unique check default constraint index view with asc desc true false over partition rollup cube returning begin commit rollback"
  ).split(" "),
);

/** Spezza una query in pezzi colorabili (parole chiave, testi, numeri, commenti). Nessuna perdita: la somma dei pezzi è il testo originale. */
export function tokenizeSql(sql: string): SqlToken[] {
  const out: SqlToken[] = [];
  const push = (type: SqlToken["type"], text: string) => {
    if (!text) return;
    const last = out[out.length - 1];
    if (last && last.type === type && type === "text") last.text += text;
    else out.push({ type, text });
  };
  let i = 0;
  while (i < sql.length) {
    const c = sql[i];
    if (c === "-" && sql[i + 1] === "-") {
      let j = i;
      while (j < sql.length && sql[j] !== "\n") j++;
      push("comment", sql.slice(i, j));
      i = j;
    } else if (c === "/" && sql[i + 1] === "*") {
      const end = sql.indexOf("*/", i + 2);
      const j = end === -1 ? sql.length : end + 2;
      push("comment", sql.slice(i, j));
      i = j;
    } else if (c === "'") {
      let j = i + 1;
      while (j < sql.length) {
        if (sql[j] === "'") {
          if (sql[j + 1] === "'") j += 2;
          else {
            j++;
            break;
          }
        } else j++;
      }
      push("string", sql.slice(i, j));
      i = j;
    } else if (/[0-9]/.test(c)) {
      let j = i;
      while (j < sql.length && /[0-9.]/.test(sql[j])) j++;
      push("number", sql.slice(i, j));
      i = j;
    } else if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < sql.length && /[A-Za-z0-9_]/.test(sql[j])) j++;
      const word = sql.slice(i, j);
      push(KEYWORDS.has(word.toLowerCase()) ? "keyword" : "text", word);
      i = j;
    } else {
      push("text", c);
      i++;
    }
  }
  return out;
}
