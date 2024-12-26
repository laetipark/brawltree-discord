const Jsoup = org.jsoup.Jsoup;
const serverURL = 'https://server.brawltree.me/';
const cdnURL = 'https://cdn.brawltree.me/';

const getResponse = (url) => {
  const response = Jsoup.connect(url)
    .ignoreContentType(true)
    .get()
    .body()
    .text();
  return JSON.parse(response);
};

const getENDataFromCdn = (item, file, key) => {
  return getResponse(cdnURL + 'database/locales/en/' + file + '.json')[key][item];
};

const getDataFromCdn = (item, file, key) => {
  return getResponse(cdnURL + 'database/locales/ko/' + file + '.json')[key][item];
};

const getKeyByValue = (item, file, key) => {
  const result = getResponse(cdnURL + 'database/locales/ko/' + file + '.json')[key];
  return Object.keys(result).find((key) => result[key].indexOf(item) > -1) || null;
};

const getImageUrl = (name, param) => {
  return cdnURL + param + name + '.webp';
};

const getServerURL = (url) => {
  return serverURL + (url || '');
};

const getCurrTimeDiff = (time) => {
  return {
    day: Math.floor((time - new Date()) / (1000 * 60 * 60 * 24)),
    hour: Math.floor((time - new Date()) / (1000 * 60 * 60)) % 24,
    minute: Math.floor((time - new Date()) / (1000 * 60)) % 60
  };
};

const getNextTimeDiff = (time) => {
  return {
    day: Math.max(Math.floor((time - new Date()) / (1000 * 60 * 60 * 24)), 0),
    hour: Math.abs(Math.floor((time - new Date()) / (1000 * 60 * 60)) % 24),
    minute: Math.abs(Math.floor((time - new Date()) / (1000 * 60)) % 60)
  };
};

exports.getResponse = getResponse;
exports.getDataFromCdn = getDataFromCdn;
exports.getENDataFromCdn = getENDataFromCdn;
exports.getImageUrl = getImageUrl;
exports.getKeyByValue = getKeyByValue;
exports.getServerURL = getServerURL;
exports.getCurrTimeDiff = getCurrTimeDiff;
exports.getNextTimeDiff = getNextTimeDiff;