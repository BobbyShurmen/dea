const patron = require('patron.js');

class RemovePoll extends patron.Command {
  constructor() {
    super({
      names: ['removepoll'],
      groupName: 'polls',
      description: 'Destroy your poll.',
      args: [
        new patron.Argument({
          name: 'poll',
          key: 'poll',
          type: 'poll',
          example: '4',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg.author.id !== args.poll.creatorId) {
      return msg.createErrorReply('you\'re not the creator of this poll.');
    }

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $pull: { 'polls': args.poll }});

    return msg.createReply('successfully destroyed your poll ' + args.poll.name.boldify() + '.');
  }
}

module.exports = new RemovePoll();
