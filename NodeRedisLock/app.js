var log = require("./log4");
var qstring = require("querystring");
var config = require("./config");
var http = require("http");
var redisnode = require("./redisnode/index");
var fs = require("fs");
var common = require("./lab/common");
var server = http.createServer(async function (req, res) {
    if (req.url.indexOf("/redisnode/") == 0) {
        var s = common.time.timestart();
        try {
            var result = await redisnode.handler(req.url.split("?")[0].replace("/redisnode/", ""), qstring.parse(req.url.split("?")[1]));
            res.end(result);
            log.logger.visit(`${common.getreqip(req).padEnd(15, " ")} | ${common.time.timestop(s).padStart(5, " ")}ms | ${req.url}`);
        } catch (e) {
            log.logger.error(e);
            e = (typeof e) == "string" ? e : e.Error;
            res.writeHead(500, { "Content-Type": "text/html;charset=utf-8" });
            res.end(e);
        }
        return;
    }
    fs.readFile(__dirname + "/README.md", "utf-8", function (err, d) {
        if (err) {
            res.end(err);
        } else {
            res.end(d.toString());
        }
    })
});
server.listen(config.config.port, '0.0.0.0', function () {
    console.log('Listening on port %d', server.address().port);
});