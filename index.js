const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const generateCsv = require('./src/csv.js');
const { getShiftsByUser } = require('./src/pagerduty.js');
const tally = require('./src/tally.js');

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option("from", {
      alias: "f",
      describe: "The start date of the export (inclusive)"
    })
    .option("until", {
      alias: "u",
      describe: "The end date of the export (exclusive)"
    })
    .option("token", {
      alias: "t",
      describe: "The PagerDuty API token"
    })
    .option("schedules", {
      alias: "s",
      describe: "ID(s) of the PagerDuty schedules to count shifts from",
      default: ["PQHJLHS"]
    })
    .option("list-shifts", {
      alias: "l",
      type: "boolean",
      describe: "Output a JSON listing of the shifts for each user. Helpful for debugging",
      default: false,
    })
    .option("max-shift-length", {
      describe: "The maximum length of a single shift, in hours",
      default: 24
    })
    .demandOption(["from", "until"], "Please specify the time period for the export")
    .demandOption("token", "Please specify a PagerDuty API token")
    .example([
      [
        "$0 --token abcdeFGhIJklMn123456 --from 2022-01-01 --until 2022-02-01",
        "Generate a CSV breakdown of all shifts for the default schedules in January 2022"
      ],
      [
        "$0 -t abcdeFGhIJklMn123456 -f 2022-01-01 -u 2022-02-01 -s PABCD12 -l",
        "Generate a JSON listing of all shifts for a custom schedule in January 2022"
      ],
    ])
    .parse();

  const shifts = await getShiftsByUser(argv);

  if (argv.listShifts) {
    console.log(shifts);
  } else {
    const totals = tally(shifts);
    const csv = generateCsv(totals);
    console.log(csv);
  }
}

main();
