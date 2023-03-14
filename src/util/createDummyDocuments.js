const { faker } = require('@faker-js/faker/locale/en');
const Note = require('../apiServices/notes/DAL/model/Note');
const logger = require('./logger');

const createDummyDocuments = async () => {
  const createNote = () => {
    // const content = faker.random.words(4)
    const content = faker.lorem.words(4)
    return { content };
  }

  const createNoteList = (quantity) => {
    return new Array(quantity)
      .fill()
      .map(createNote);
  }

  const saveNotes = async (data) => {
    await Note.create(data);
  }

  await saveNotes(createNoteList(15));
  return logger.info('Local DB populated with dummy documents');
}

module.exports = createDummyDocuments;