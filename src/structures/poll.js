class Poll {
  constructor(index, name, creatorId, choices, length, elderOnly, modOnly) {
    this.index = index;
    this.name = name;
    this.creatorId = creatorId;
    this.choices = choices;
    this.length = length;
    this.elderOnly = elderOnly;
    this.modOnly = modOnly;
    this.createdAt = Date.now();
  }
}

module.exports = Poll;
