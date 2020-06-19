const moment = require('moment');
const log = require('loglevel').getLogger('systemLogger');

const { LOG_LEVEL } = process.env;

log.setLevel(LOG_LEVEL);

function debug() {
  const args = [...arguments];
  const dt = moment().format('YYYY-MM-DD HH:mm:ss');
  args.unshift(`[${dt}]`);

  const COLOUR = '\033[0;36m';
  const NC = '\033[0m';
  log.debug(`${COLOUR}`, ...args, `${NC}`);
}

function warn() {
  const args = [...arguments];
  const dt = moment().format('YYYY-MM-DD HH:mm:ss');
  args.unshift(`[${dt}]`);

  const COLOUR = '\033[0;33m';
  const NC = '\033[0m';
  log.warn(`${COLOUR}`, ...args, `${NC}`);
}

function error() {
  const args = [...arguments];
  const dt = moment().format('YYYY-MM-DD HH:mm:ss');
  args.unshift(`[${dt}]`);

  const COLOUR = '\033[0;31m';
  const NC = '\033[0m';
  log.warn(`${COLOUR}`, ...args, `${NC}`);
}

module.exports = { debug, warn, error };
