const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const moment = require("moment");
const sass = require("sass");

require("handlebars-helpers")({
  handlebars: Handlebars,
});

var svg = new Map();
function registerSVG() {
  const svgDir = path.join(__dirname, "/ressources/svg");
  const filenames = fs.readdirSync(svgDir);

  for (const filename of filenames) {
    const matches = /^([^.]+).svg$/.exec(filename);

    if (!matches) {
      continue;
    }

    const name = matches[1];
    const filepath = path.join(svgDir, filename);
    const file = fs.readFileSync(filepath, "utf8");

    svg.set(name, file);
  }
}

Handlebars.registerHelper("breaklines", (value) => {
  try {
    value = Handlebars.Utils.escapeExpression(value);
    value = value.replace(/(\r\n|\n|\r)/gm, "<br>");
    return new Handlebars.SafeString(value);
  } catch (error) {
    console.error("ERROR HELPER Breaklines : ", error);
  }
});

Handlebars.registerHelper("moment", (value) => {
  try {
    moment.locale("fr");
    return moment(value).format("MMMM YYYY");
  } catch (error) {
    console.error("ERROR HELPER MOMENT : ", error);
  }
});

Handlebars.registerHelper("indexOf", (value, index) => {
  try {
    if (!value || !value[index]) {
      return null;
    }

    return value[index];
  } catch (error) {
    console.error("ERROR HELPER indexOf : ", error);
  }
});

Handlebars.registerHelper("slice", (value, start, end) => {
  try {
    return value.slice(start, end);
  } catch (error) {
    console.error("ERROR HELPER slice : ", error);
  }
});

Handlebars.registerHelper("skillToTitle", (value) => {
  try {
    if (value >= 9) {
      return "9 ans et +";
    }
    return value > 1 ? `${value} ans` : `${value} an`;
  } catch (error) {
    console.error("ERROR HELPER skillToTitle : ", error);
  }
});

Handlebars.registerHelper("svg", (value) => {
  try {
    return svg.get(value.toLowerCase());
  } catch (error) {
    console.error("ERROR HELPER svg : ", error);
  }
});

function render(resume) {
  registerSVG();

  const style = sass
    .compile(path.join(__dirname, "/ressources/sass/style.scss"), {
      style: "compressed",
    })
    .css.toString("utf8");

  const javascript = fs.readFileSync(
    __dirname + "/ressources/js/javascript.js",
    "utf-8"
  );

  const template = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
  const partialsDir = path.join(__dirname, "/partials");
  const filenames = fs.readdirSync(partialsDir);

  for (let filename of filenames) {
    const matches = /^([^.]+).hbs$/.exec(filename);

    if (!matches) {
      continue;
    }

    const name = matches[1];
    const filepath = path.join(partialsDir, filename);
    const template = fs.readFileSync(filepath, "utf8");

    Handlebars.registerPartial(name, template);
  }

  return Handlebars.compile(template)({
    javascript,
    style,
    resume,
  });
}

module.exports = {
  render,
};
