/**
 * Encode password in MongoDB URI and avoid mongodb+srv when Node DNS SRV lookup fails.
 */
export function normalizeMongoUri(uri) {
  if (!uri || typeof uri !== "string") return uri;

  let normalized = uri.trim();

  // mongodb+srv://user:pass@host/db -> encode password if it contains reserved chars
  const credMatch = normalized.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@(.+)$/);
  if (credMatch) {
    const [, protocol, user, password, rest] = credMatch;
    try {
      const encodedPassword = encodeURIComponent(decodeURIComponent(password));
      normalized = `${protocol}${user}:${encodedPassword}@${rest}`;
    } catch {
      normalized = uri;
    }
  }

  // Node on Windows can fail querySrv for mongodb+srv; use direct shard hosts for this cluster.
  if (normalized.startsWith("mongodb+srv://") && normalized.includes("cluster0.ktucynl.mongodb.net")) {
    const withoutProtocol = normalized.replace(/^mongodb\+srv:\/\//, "");
    const atIndex = withoutProtocol.indexOf("@");
    if (atIndex === -1) return normalized;

    const credentials = withoutProtocol.slice(0, atIndex + 1);
    const pathAndQuery = withoutProtocol.slice(atIndex + 1);
    const slashIndex = pathAndQuery.indexOf("/");
    const pathPart = slashIndex >= 0 ? pathAndQuery.slice(pathAndQuery.indexOf("/")) : "/restaurant_management";
    const queryPart = pathPart.includes("?") ? pathPart.slice(pathPart.indexOf("?")) : "";

    const dbPath = pathPart.split("?")[0] || "/restaurant_management";
    const hosts =
      "ac-ztltqlj-shard-00-00.ktucynl.mongodb.net:27017," +
      "ac-ztltqlj-shard-00-01.ktucynl.mongodb.net:27017," +
      "ac-ztltqlj-shard-00-02.ktucynl.mongodb.net:27017";

    const baseQuery = "ssl=true&authSource=admin&retryWrites=true&w=majority";
    const extraQuery = queryPart.replace(/^\?/, "").replace(/appName=[^&]*&?/, "").replace(/&$/, "");
    const query = extraQuery ? `${baseQuery}&${extraQuery}` : baseQuery;

    return `mongodb://${credentials}${hosts}${dbPath}?${query}`;
  }

  return normalized;
}
