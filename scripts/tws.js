// I took this from eevee :clapping:
// https://github.com/eevee/lexys-labyrinth/blob/master/js/format-tws.js
async function processTWSFile(bytes) {
  let buf;
  if (bytes.buffer) {
    buf = bytes.buffer;
  } else {
    buf = bytes;
    bytes = new Uint8Array(buf);
  }
  let view = new DataView(buf);
  let magic = view.getUint32(0, true);
  if (magic !== 0x999b3335) return;

  let ruleset = bytes[4];
  let extra_bytes = bytes[7];

  let ret = {
    ruleset: ruleset == 1 ? "lynx" : "ms",
    scores: [],
  };

  let p = 8 + extra_bytes;
  while (p < buf.byteLength) {
    let len = view.getUint32(p, true);
    p += 4;
    if (len === 0xffffffff) break;

    if (
      len <= 6 ||
      (bytes[p] === 0 &&
        bytes[p + 1] === 0 &&
        bytes[p + 2] === 0 &&
        bytes[p + 3] === 0 &&
        bytes[p + 5] === 0 &&
        bytes[p + 6] === 0)
    ) {
    } else {
      // Long record
      let number = view.getUint16(p, true);
      let total_duration = view.getUint32(p + 12, true);

      ret.scores.push({
        level: number,
        time: Math.floor(total_duration / 20),
      });
    }

    p += len;
  }
  return ret;
}
