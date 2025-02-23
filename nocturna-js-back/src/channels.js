// // For websockets
// module.exports = function(app) {
//     if (typeof app.channel === 'function') {
//         app.on('connection', connection => {
//             app.channel('everyone').join(connection);
//         });

//         app.publish((data, hook) => {
//             return app.channel('everyone');
//         });
//     }
// }