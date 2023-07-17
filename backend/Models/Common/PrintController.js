const htmlPdf = require("html-pdf");
const fs = require("fs");
const Handlebars = require("handlebars");
const path = require("path");

const ApiResult = require("./ApiResult");

const getByteArray = (filePath) => {
  const fileData = fs.readFileSync(filePath).toString("hex");
  const result = [];
  for (var i = 0; i < fileData.length; i += 2)
    result.push("0x" + fileData[i] + "" + fileData[i + 1]);
  return result;
};

const fnPrint = async (strFilePath, objData, arrFnList) => {
  try {
    const source = fs.readFileSync(
      path.join(__dirname, "../../reports/" + strFilePath),
      "utf8"
    );
    const bitmap = getByteArray(
      path.join(__dirname, "../../reports/Images/Letterhead.png")
    );
    const logoBase64 =
      "data:image/png;base64," + new Buffer.from(bitmap).toString("base64");

    if (!source) {
      return new ApiResult(false, "Report file not found!");
    }

    Handlebars.registerHelper("fnDecPoints", function (val) {
      return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });

    arrFnList.map((ele) => {
      Handlebars.registerHelper(ele.strName, ele.strFunc);
    });

    const objReportCommonData = {
      compName: "",
      compCity: "Malabe",
      compInfo: "Contact No : 077712456 Email: testemail.gmail.com",
      strAddress: "No 111 Nugegoda Road, Nugegoda",
    };

    let template = Handlebars.compile(source);
    let data = { ...objData, logoBase64: logoBase64, ...objReportCommonData };

    let htmlContent = template(data);
    const htmlToPdfOptions = {
      type: "pdf",
      quality: "75",
      height: "29.7cm",
      width: "21cm",
      renderDelay: 100,
    };

    return await new Promise(function (myResolve, myReject) {
      htmlPdf
        .create(htmlContent, htmlToPdfOptions)
        .toBuffer(function (err, result) {
          if (err) return myReject(new ApiResult(false, err));
          else return myResolve(new ApiResult(true, result.toString("base64")));
        });
    });
  } catch (error) {
    return new new ApiResult(false, error)();
  }
};

module.exports = fnPrint;
