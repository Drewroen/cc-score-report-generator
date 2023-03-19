async function generateReport() {
  var saveFile = document.getElementById("save-file-input").files[0];
  var playerId = document.getElementById("player-id").value;
  var levelset = document.getElementById("levelset").value;

  if (!saveFile || !playerId || !levelset) return;

  var fr = new FileReader();
  fr.onload = async function () {
    var rawScores = await processTWSFile(fr.result);
    var packData = await getPack(levelset);
    var playerScores = (await getPlayer(levelset, playerId)).scores;
    var formattedScores = getFormattedScores(rawScores, packData, playerScores);

    console.log(playerScores);
    var improvedScores = getImprovedScores(formattedScores);
    document.getElementById("score-report").value = stringifyScores(
      improvedScores,
      playerScores.pack,
      rawScores.ruleset
    );
  };

  fr.readAsArrayBuffer(saveFile);
}

function getFormattedScores(rawScores, packData, playerScores) {
  const simplifiedPack = packData.map((level) => {
    return {
      level: level.level,
      timeLimit: level.time_limit == 0 ? 999 : level.time_limit,
      bold: level.level_attribs.filter(
        (bold) => bold.rule_type == rawScores.ruleset
      )[0].attribs.highest_reported,
    };
  });

  completeData = [];

  rawScores.scores.forEach((score) => {
    elapsedTime = score.time;
    var level = simplifiedPack.filter((level) => level.level == score.level)[0];
    var oldScore = playerScores.levels[score.level].filter(
      (score) => score.rule_type == rawScores.ruleset
    )[0].reported_value;

    actualTime = level.timeLimit - elapsedTime;
    completeData.push({
      level: score.level,
      newScore: Math.max(0, actualTime),
      oldScore: oldScore,
    });
  });

  return {
    ruleset: rawScores.ruleset,
    scores: completeData,
  };
}

function getImprovedScores(formattedScores) {
  return formattedScores.scores.filter(
    (score) => score.newScore > score.oldScore
  );
}

function stringifyScores(scores, levelset, ruleset) {
  var scoreStrings = scores.map(
    (score) => "Level " + score.level + " - " + score.newScore
  );
  return (
    "Score Report (" +
    levelset +
    " " +
    ruleset +
    ")\n" +
    scoreStrings.join("\n")
  );
}
