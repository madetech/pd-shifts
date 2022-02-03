const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { getShiftsByUser } = require('./pagerduty.js');

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
      default: ["PQHJLHS", "P0SNTI2"]
    })
    .demandOption(["from", "until"], "Please specify the time period for the export")
    .demandOption("token", "Please specify a PagerDuty API token")
    .parse();

  const shifts = await getShiftsByUser(argv);
  console.log(shifts);
}

main();