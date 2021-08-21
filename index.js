var fs = require("fs");
var path = require('path');
var Handlebars = require("handlebars");

function render(resume) {
	var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
	var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
	var partialsDir = path.join(__dirname, 'partials');
	var filenames = fs.readdirSync(partialsDir);

	Handlebars.registerHelper('date', require('helper-date'));

	Handlebars.registerHelper('rating', (ratingStr) => {
		var [rating, max] = ratingStr.split('/');
		let result = '';
		for (let i = 1; i <= max; i++) {
		  let char = rating >= i ? '★' : '☆';
		  result += `<span>${char}</span>`;
		}
		return new Handlebars.SafeString(result);
	  });

	filenames.forEach(function (filename) {
	  var matches = /^([^.]+).hbs$/.exec(filename);
	  if (!matches) {
	    return;
	  }
	  var name = matches[1];
	  var filepath = path.join(partialsDir, filename)
	  var template = fs.readFileSync(filepath, 'utf8');

	  Handlebars.registerPartial(name, template);
	});

	// Soft resume.awards descending by date


	// Combine awards and certificates to make them briefer
	var awards = resume.awards
		.concat(resume.certificates)
		.sort((a,b) => new Date(a.date) > new Date(b.date));

	return Handlebars.compile(tpl)({
		css: css,
		resume: {
			...resume,
			awards
		}
	});
}

module.exports = {
	render: render
};