const patron = require('patron.js');

class PollTypeReader extends patron.TypeReader {
  constructor() {
    super({ type: 'poll' });
  }

  async read(command, message, argument, args, input) {
    const poll = await message.dbGuild.polls.find(x => x.index === Number.parseInt(input));

    if (poll) {
      return patron.TypeReaderResult.fromSuccess(poll);
    }

    return patron.TypeReaderResult.fromError(command, 'This poll doesn\'t exist.');
  }
}

module.exports = new PollTypeReader();
