const Constants = require('../utility/Constants.js');

module.exports = async client => {
  client.setInterval(async () => {
    const guilds = await client.db.guildRepo.findMany();

    for (let i = 0; i < guilds.length; i++) {
      if (guilds[i].polls.length <= 0) {
        continue;
      }

      const polls = guilds[i].polls;

      for (let j = 0; j < polls.length; j++) {
        const pollLength = polls[i].length;
        const pollCreatedAt = polls[i].createdAt;
        let choices = '';
  
        if (Date.now() - pollCreatedAt - pollLength <= 0) {
          continue;
        }

        const guild = client.guilds.get(guilds[i].guildId);
  
        if (!guild) {
          continue;
        }

        await client.db.guildRepo.updateGuild(guild.id, { $pull: { 'polls': polls[i] }});
  
        const creator = guild.member(polls[i].creatorId);
  
        if (!creator) {
          continue;
        }
  
        for (const key in polls[i].choices) {
          choices += '`' + key + '` Votes: ' + polls[i].choices[key].voters.length + ',\n';
        }
  
        await creator.user.tryDM(choices + 'Final Poll Results Of ' + polls[i].name + ' Poll In Server ' + guild.name + '.');
      }
    }
  }, Constants.config.intervals.autoRemovePoll);
};
