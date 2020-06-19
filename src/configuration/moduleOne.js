const moment = require('moment');
const log = require('loglevel').getLogger('module-one');

log.setLevel('TRACE');

function debug() {
  const args = [...arguments];
  console.log('args', args);
  const dt = moment().format('YYYY-MM-DD HH:mm:ss');
  args.unshift(`[${dt}]`);

  const RED = '\033[0;31m';
  const NC = '\033[0m';
  log.debug(`${RED}`,...args,`${NC}`);
}

module.exports = { debug };
