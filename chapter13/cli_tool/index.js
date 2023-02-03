var args = process.argv.slice(2);
console.log(args);

args.forEach(function(arg) { // 遍历参数，查找 -h 和 --help
  switch(arg) {
    case '-h':
    case '--help':
      printHelp();
      break;
  }
});

function printHelp() { // 输出辅助信息
  console.log(' usage:');
  console.log(' $ AwesomeProgram <options> <file-to-awesomeify>');
  console.log(' example:');
  console.log(' $ AwesomeProgram --make-awesome not-yet.awesome');
  process.exit(0);
}
