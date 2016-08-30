var request = require('request');
var fs = require('fs');
var path = require('path');
var beautify_html = require('js-beautify').html;

exports.name = 'genhtml';
exports.desc = 'generate html for react-guide used.';

exports.register = function (commander, settings) {
  commander.option('-p, --path <path>', 'waiting upload dir')
    .option('-f, --file <file>', 'project.json file')
    .action(function (template) {
      var args = [].slice.call(arguments);
      var options = args.pop();

      var project = require(path.resolve(process.cwd(), options.file));
      var dist = path.resolve(process.cwd(), './dist');

      project.entrys.map((entry) => {
        var url = 'http://127.0.0.1:3000/' + entry.filename.substring(0, entry.filename.lastIndexOf('.'));
        fis.log.info("start request ", url);
        request(url, function (err, response, body) {
          if (err) {
            return fis.log.error('request failed, error: ', err);
          }
          // fis.log.info("download html success! now beautify html ...");
          body = beautify_html(body, {
            "indent_size": 2,
            "indent_char": " ",
            "eol": "\n",
            "indent_level": 0,
            "indent_with_tabs": false,
            "preserve_newlines": true,
            "max_preserve_newlines": 10,
            "jslint_happy": false,
            "space_after_anon_function": false,
            "brace_style": "collapse",
            "keep_array_indentation": false,
            "keep_function_indentation": false,
            "space_before_conditional": true,
            "break_chained_methods": false,
            "eval_code": false,
            "unescape_strings": false,
            "wrap_line_length": 0,
            "wrap_attributes": "auto",
            "wrap_attributes_indent_size": 4,
            "end_with_newline": false
          });
          var htmlPath = path.resolve(dist, entry.filename);
          fs.writeFileSync(htmlPath, body, {
            encoding: 'utf-8'
          });
          fis.log.info("success generate html to ", htmlPath);
        });
      });
    })
}