const patron = require('patron.js');
const Constants = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const ModerationService = require('../../services/ModerationService.js');

class Vote extends patron.Command {
  constructor() {
    super({
      names: ['vote'],
      groupName: 'polls',
      description: 'Vote on a poll.',
      args: [
        new patron.Argument({
          name: 'poll',
          key: 'poll',
          type: 'poll',
          example: '6'
        }),
        new patron.Argument({
          name: 'choice',
          key: 'choice',
          type: 'choice',
          example: '1',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const elderDays = NumberUtil.msToTime(Constants.config.polls.elderTimeRequired).days;

    if (args.poll.elderOnly && Date.now() - msg.member.joinedAt < Constants.config.polls.elderTimeRequired) {
      return msg.createErrorReply('you may not vote on this poll until you\'ve been in this server for ' + elderDays + ' days.');
    } else if (args.poll.modOnly && ModerationService.getPermLevel(msg.dbGuild, msg.member) < 1) {
      return msg.createErrorReply('you may only vote on this poll if you\'re a moderator.');
    } else if (args.poll.choices[args.choice].voters.includes(msg.author.id)) {
      return msg.createErrorReply('you may not vote on the same choice twice.');
    }

    let votedChoice;

    for (const key in args.poll.choices) {
      if (args.poll.choices[key].voters.includes(msg.author.id)) {
        votedChoice = 'polls.' + (args.poll.index - 1) + '.choices.' + key + '.voters';
        await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $pull: { [votedChoice]: msg.author.id }});
      }
    }

    votedChoice = 'polls.' + (args.poll.index - 1) + '.choices.' + args.choice + '.voters';

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $push: { [votedChoice]: msg.author.id } });

    return msg.createReply('you\'ve successfully voted `' + args.choice + '` on poll: ' + args.poll.name.boldify() + '.');
  }
}

module.exports = new Vote();
