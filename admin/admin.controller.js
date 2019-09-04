const os = require('os');
const ip = require('ip');
const logger = require('../config/winston');

const utils = require('../utils/utils');
const sdkModule = require('../sdk');
const sdk = sdkModule.factory;

/**
 * ping pings server
 * @param {*} req 
 * @param {*} res 
 */
const ping = (req, res) => {
  res.status(200).send('pong');
};

/**
 * healthcheck  checks if SDK and environtment is healthy or not.
 * 200 - Everything is OK. Ready to evaluate.
 * 500 - Something is wrong or not ready yet. Not able to perform evaluations.
 * @param {*} req 
 * @param {*} res 
 */
const healthcheck = (req, res) => {
  let status = 500;
  let msg = 'Split evaluator engine is not evaluating traffic properly.';

  if (sdkModule.isReady()) {
    status = 200;
    msg = 'Split Evaluator working as expected.';
  }

  logger.info(`Health check status: ${status} - ${msg}`);
  res.status(status).send(msg);
};

/**
 * version  returns the current version of Split Evaluator
 * @param {*} req 
 * @param {*} res 
 */
const version = (req, res) => {
  const version = utils.getVersion();
  const parts = sdk.settings.version.split('-');
  const sdkLanguage = parts[0];
  const sdkVersion = parts.slice(1).join('-');

  res.send({
    version,
    sdk: sdkLanguage,
    sdkVersion
  });
};

/**
 * machine  returns the machine instance name and machine ip
 * @param {*} req 
 * @param {*} res 
 */
const machine = (req, res) => {
  let address; let hostname;

  try {
    address = ip.address();
    hostname = os.hostname();
  } catch(e) {
    address = hostname = 'unavailable';
  }

  res.send({
    ip: address,
    name: hostname
  });
};

/**
 * uptime returns the uptime of the server
 * @param {*} req 
 * @param {*} res 
 */
const uptime = (req, res) => {
  const uptime = utils.uptime();
  res.send('' + uptime);
};

module.exports = {
  ping,
  healthcheck,
  version,
  machine,
  uptime,
};
