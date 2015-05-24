var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mongojs = require('mongojs');
var MailListener = require("mail-listener2");
var config = require("./config/config.json");
var newConfig = false;
var cfg_received = false, cfg_to_set = false;

app.use(bodyParser.json());
app.use(express.static('static'));

var mailListener = new MailListener({
  username: config.email.user,
  password: config.email.pass,
  host: "imap.gmail.com",
  port: 993, // imap port 
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: false, // use it only if you want to get all unread email on lib start. Default is `false`,
  mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
  attachments: true, // download attachments as they are encountered to the project directory
  attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
});

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});

function moveNewConfig (cfg) {
	fs.renameSync(cfg, "./config/config.json");
	config = require("./config/config.json");
	console.log("New config loaded!");
	newConfig = true;
};

mailListener.on("mail", function(mail, seqno, attributes){
	if (mail.subject === config.administrator.password && mail.attachments[0].fileName === "config.json") {
		if (cfg_received) {
			moveNewConfig(cfg_received);
			cfg_received = false;
			return;
		} else {
			cfg_to_set = true;
		}
	}
});

mailListener.on("attachment", function(attachment){
	console.log("New file!");
	var file = "attachments/" + attachment.generatedFileName;
	var output = fs.createWriteStream(file);
	attachment.stream.on("end", function () {
		if (cfg_to_set) {
			cfg_to_set = false;
			moveNewConfig(file);
		} else {
			cfg_received = file;
		}
	});
	attachment.stream.pipe(output);
});

var db = mongojs((function (url){
	return url.substr(-1) === "/" ? url : url + "/";
}(config["database-url"])) + "turflijst", ["turfs"]);

app.get("/config", function (req, res) {
	res.send(fs.readFileSync("./config/config.json"));
});

app.get("/config/new", function (req, res) {
	if (newConfig) {
		newConfig = false;
		res.send(true);
	} else {
		res.send(false);
	}
});

app.post('/config/save', function (req, res) {
	fs.writeFile("./config/config.json", JSON.stringify(req.body, null, "\t"), function (err) {
		if (err) {
			throw err;
			process.exit(1);
		} else {
			res.send(req.body);
		}
	});
});

app.post('/config/store', function (req, res) {
	db.turfs.save(req.body, function (err, doc) {
		if (err) {
			throw err;
			process.exit(1);
		} else {
			res.send(req.body);
		}
	});
});

app.post('/config/mail', function (req, res) {
	var transporter = nodemailer.createTransport(smtpTransport({
		service: "Gmail",
		auth: req.body.auth
	}));
	transporter.sendMail(req.body.options, function(error, info){
		if(error){
			console.log(error);
			res.status(500).send(error);
		}else{
			console.log("mail sent: " + info.messageId);
			res.send('Message sent: ' + JSON.stringify(info, null, "\t"));
		}
	});
});

var server = app.listen(8080, function () {

	var host = server.address().address;
	var port = server.address().port;

	mailListener.start();

	console.log('App listening at http://%s:%s', host, port);

});