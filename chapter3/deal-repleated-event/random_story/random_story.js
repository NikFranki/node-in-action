// 实现串行控制程序

var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser');
const path = require('path');
var configFilename = './rss_feeds.txt';

// 确保包含 RSS 预定源 URL 列表的文件存在
function checkForRSSFile() {
  if (!fs.existsSync(path.resolve(__dirname, configFilename))) {
    return next(new Error('Missing RSS file: ' + configFilename));
  }

  next(null, configFilename);
};

// 读取并解析包含预定源 URL 的文件
function readRSSFile(configFilename) {
  fs.readFile(path.resolve(__dirname, configFilename), function (err, feedList) {
    if (err) return next(err);

    feedList = feedList.toString().replace(/^\s|\s+$/g, '').split('\n'); // 将预定源 URL 列表转换成字符串，然后分割成一个数组
    var random = Math.floor(Math.random() * feedList.length);
    next(null, feedList[random]);
  });
}

// 向选定的预定源发送 HTTP 请求以获取数据
function downloadRSSFeed(feedUrl) {
  request({ uri: feedUrl }, function (err, res, body) {
    if (err) return next(err);

    if (res.statusCode !== 200) {
      return next(new Error('Abnormal response status code'));
    }

    next(null, body);
  });
}

// 将预定源数据解析到一个条目数组中
function parseRSSFeed(rss) {
  var handler = new htmlparser.RssHandler();
  var parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  if (!handler.dom.items.length) {
    return next(new Error('No RSS items found'));
  }
  var item = handler.dom.items.shift();
  console.log(item.description); // 如果有数据，显示第一条预定源的描述和 URL
  console.log(item.link);
}

// 将所有要执行的任务按数组添加到一个数组中
var tasks = [
  checkForRSSFile,
  readRSSFile,
  downloadRSSFeed,
  parseRSSFeed
];

function next(err, result) {
  if (err) throw err;

  // 每次取出一个任务
  var currentTask = tasks.shift();

  // 如果存在就继续执行任务
  if (currentTask) {
    currentTask(result);
  }
}

// 开始执行串行任务
next();