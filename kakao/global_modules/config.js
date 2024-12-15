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

const getMapMode = (mode) => {
  return getResponse(cdnURL + 'database/locales/ko/battle.json')['mode'][mode];
};

const getMapName = (id) => {
  return getResponse(cdnURL + 'database/locales/ko/map.json')['map'][id];
};

const getServerURL = (url) => {
  return serverURL + url;
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
exports.getMapMode = getMapMode;
exports.getMapName = getMapName;
exports.getServerURL = getServerURL;
exports.getCurrTimeDiff = getCurrTimeDiff;
exports.getNextTimeDiff = getNextTimeDiff;
