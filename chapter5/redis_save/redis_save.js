var redis = require('redis');
const client = redis.createClient();

client.on("connect", function () {
  console.log("You are now connected");
});

// client.on('error', function (error) {
//   console.log('Error: ' + error);
// });

// client.set('color', 'red', redis.print);
// client.get('color', function (err, value) {
//   if (err) throw err;
//   console.log('Got: ' + value);
// });

// client.hSet('camping', {
//   'shelter': '2-person tent',
//   'cooking': 'compstove',
// }, redis.print);

// client.hmGet('camping', 'cooking', function (err, value) {
//   if (err) throw err;
//   console.log('Will be cooking with: ' + value);
// });

// client.keys('camping', function (err, keys) {
//   if (err) throw err;
//   keys.forEach(function (key, i) {
//     console.log('  ' + key);
//   });
// });

// client.lPush('tasks', 'Paint the bikeshed red.', redis.print);
// client.lPush('tasks', 'Paint the bikeshed green.', redis.print);
// client.lRange('tasks', 0, -1, function (err, items) {
//   if (err) throw err;
//   items.forEach(function (item, i) {
//     console.log('  ' + item);
//   });
// });

// client.sAdd('ip_addresses', '204.10.37.96', redis.print);
// client.sAdd('ip_addresses', '204.10.37.96', redis.print);
// client.sAdd('ip_addresses', '72.32.231.8', redis.print);
// client.sMembers('ip_addresses', function (err, members) {
//   if (err) throw err;
//   console.log(members);
// });