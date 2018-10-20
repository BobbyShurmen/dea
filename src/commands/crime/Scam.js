const patron = require('patron.js');
const Random = require('../../utility/Random.js');
const Constants = require('../../utility/Constants.js');

class Scam extends patron.Command {
  constructor() {
    super({
      names: ['scam', 'whore'],
      groupName: 'crime',
      description: 'Scam some noobs on the streets.',
      postconditions: ['reducedcooldown'],
      cooldown: Constants.config.scam.cooldown
    });
  }

  async run(msg) {
    if (Random.roll() < Constants.config.scam.odds) {
      const prize = Random.nextFloat(Constants.config.scam.min, Constants.config.scam.max);

      await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, prize);

      return msg.createReply(Random.arrayElement(Constants.data.messages.scam).format(prize.USD()));
    }

    return msg.createErrorReply('you waited in line for some new Adidas Yeezys, bought 10 just to realise they were fake!.');
  }
}

module.exports = new Scam();
