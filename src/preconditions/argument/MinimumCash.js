const patron = require('patron.js');

class MinimumCash extends patron.ArgumentPrecondition {
  constructor() {
    super({
      name: 'minimumcash'
    });
  }

  async run(command, msg, argument, args, value, options) {
    if (value >= options.minimum) {
      return patron.PreconditionResult.fromSuccess();
    }

    return patron.PreconditionResult.fromError(command, 'the minimum ' + argument.name + ' is ' + options.minimum.USD() + '.');
  }
}

module.exports = new MinimumCash();
