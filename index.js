const { api } = require('@pagerduty/pdjs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

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
  .demandOption(["from", "until"], "Please specify the time period for the export")
  .demandOption("token", "Please specify a PagerDuty API token")
  .parse();

console.log(argv.from, argv.until, argv.token);
