const { Service } = require('feathers-mongodb');

class FileUploadService extends Service {
    async create(data, params) {
        console.log("Received file upload request", data);
        return super.create(data, params);
    }
}

module.exports = function (db) {
    return new FileUploadService({
        Model: db.collection('files')
    });
}