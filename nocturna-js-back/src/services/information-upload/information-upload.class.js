const { Service } = require('feathers-mongodb');

class InformationUploadService extends Service {

  constructor(options) {
    super(options);
  }

  // Get info by partId
  async get(partId, params) {
    console.log('Getting information upload for partId:', partId);
    const data = await this.Model.findOne({ partId });

    if (!data) {
      throw new Error(`No information upload found for partId '${partId}'`);
    }

    return data;
  }

  // Optionally override the create method if you want extra logic
  async create(data, params) {
    console.log('Creating new information upload:', data);
    // This will only be called if validation passed
    // Delete all data in the collection
    // await this.Model.deleteMany({});
    // Create
    return super.create(data, params);
  }

  // Delete all data in the collection
}

module.exports = function(db) {
  return new InformationUploadService({
    Model: db.collection('informationUploads')
  });
};
