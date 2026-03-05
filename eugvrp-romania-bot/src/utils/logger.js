// filepath: /workspaces/EUGVRP-Romania-v2/src/utils/logger.js
import chalk from 'chalk';

const log = (message) => {
    console.log(chalk.blue(`[LOG] ${message}`));
};

const error = (message) => {
    console.error(chalk.red(`[ERROR] ${message}`));
};

const warn = (message) => {
    console.warn(chalk.yellow(`[WARN] ${message}`));
};

const info = (message) => {
    console.info(chalk.green(`[INFO] ${message}`));
};

export default {
    log,
    error,
    warn,
    info,
};