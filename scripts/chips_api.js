async function getPack(pack) {
  const response = await (
    await fetch("https://api.bitbusters.club/packs/" + pack + "/levels")
  ).json();
  return await response;
}

async function getPlayer(pack, playerId) {
  const response = await (
    await fetch("https://api.bitbusters.club/players/" + playerId + "/" + pack)
  ).json();
  return await response;
}
