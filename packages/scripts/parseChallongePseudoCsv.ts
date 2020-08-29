const fs = require("fs");
const readline = require("readline");

// https://stackoverflow.com/a/1293163
function CSVToArray(strData: string) {
  const strDelimiter = ",";

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    // Delimiters.
    "(\\" +
      strDelimiter +
      "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      strDelimiter +
      "\\r\\n]*))",
    "gi"
  );

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData: any = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while ((arrMatches = objPattern.exec(strData))) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);
    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
    } else {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[3];
    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }

  // Return the parsed data.
  return arrData;
}

interface Team {
  seed: number;
  name: string;
  players: [string, string, string, string];
  subs: [string | null, string | null];
  stageBans: string;
  wantsToPlayUnderground: boolean;
}

async function parseChallongePseudoCsv() {
  const fileStream = fs.createReadStream("input/itz.csv");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  const teams: Team[] = [];

  for await (const line of rl) {
    if (line.includes("Custom Form Responses")) continue;

    const lineParts = CSVToArray(line)[0];

    const team: Partial<Team> = {};

    team.seed = parseInt(lineParts[0]);
    team.name = lineParts[1];

    const players: any = [];
    const subs: any = [];
    for (const answer of lineParts) {
      if (answer.includes("Player")) {
        const player = answer.split(": ")[1];
        if (!player)
          throw new Error("Invalid player for team: " + lineParts[1]);
        players.push(player);
      }

      if (answer.includes("Sub")) {
        const sub = answer.split(": ")[1];
        if (!sub) continue;
        subs.push(sub);
      }

      if (answer.includes("Map Bans")) {
        const bans = answer.split(": ")[1];
        if (!bans) continue;
        team.stageBans = bans;
      }

      if (answer.includes("Underground Bracket")) {
        const yesNo = answer.split(": ")[1];
        if (!yesNo) throw new Error("Invalid UG answer from: " + lineParts[1]);
        team.wantsToPlayUnderground = yesNo === "Yes";
      }
    }

    team.players = players;

    while (subs.length < 2) {
      subs.push(null);
    }
    team.subs = subs;

    teams.push(team as Team);
  }

  const github = [
    "Seed,Name,Map Bans,Player 1,Player 2,Player 3,Player 4,Sub 1,Sub 2,Underground Bracket",
  ];
  const seeds = ["Name,Player 1,Player 2,Player 3,Player 4,Sub 1,Sub 2"];

  for (const team of teams) {
    github.push(
      `${team.seed},"${team.name.replace(/\"/g, "'")}","${
        team.stageBans ?? ""
      }","${team.players[0]}","${team.players[1]}","${team.players[2]}","${
        team.players[3]
      }","${team.subs[0] ?? ""}","${team.subs[1] ?? ""}","${
        team.wantsToPlayUnderground ? "✅" : "❌"
      }"`
    );

    seeds.push(
      `"${team.name.replace(/\"/g, "'")}","${team.players[0]}","${
        team.players[1]
      }","${team.players[2]}","${team.players[3]}","${team.subs[0] ?? ""}","${
        team.subs[1] ?? ""
      }"`
    );
  }

  fs.writeFile("output/itzpublic.csv", github.join("\n"), function (err: any) {
    if (err) return console.log(err);
    console.log("Recorded to itzpublic.csv");
  });

  fs.writeFile("output/itzseeding.csv", seeds.join("\n"), function (err: any) {
    if (err) return console.log(err);
    console.log("Recorded to itzseeding.csv");
  });
}

parseChallongePseudoCsv();
