const scriptName = 'blossom-bot';
const config = require('config');
const apiKey = require('secret').apiKey;
const wwwUrl = require('secret').wwwUrl;
var { KakaoApiService, KakaoShareClient } = require('kakaolink');

const service = KakaoApiService.createService();
const client = KakaoShareClient.createClient();

/**
 * 카카오톡에 접속해 로그인 세션을 불러옴
 */
const cookies = service
  .login({
    signInWithKakaoTalk: true,
    context: App.getContext()
  })
  .awaitResult();
client.init(apiKey, wwwUrl, cookies);

/**
 * 메신저봇에 대한 BotManager 불러오기
 */
const bot = BotManager.getCurrentBot();

const commandList = new CommandList();
const seeAllViewText = '\u200b'.repeat(500);

/**
 * @constructor
 * @description 명령어 리스트
 */
function CommandList() {
  this.bot = {
    name: '봇',
    description: '봇에 대한 소개를 합니다.\n'
  };
  this.help = {
    name: '명령어',
    description: '봇에 대한 명령어 목록을 확인합니다.\n'
  };
  this.rotation = {
    name: '이벤트',
    description:
      '맵 로테이션에 대한 정보를 확인할 수 있습니다.\n' +
      ' * 기본: 현재 로테이션 정보\n' +
      ' * 다음: 다음 로테이션 정보\n',
    args: '(다음)'
  };
  this.map = {
    name: '맵',
    description: '맵 상세 정보를 확인할 수 있습니다.\n',
    args: '(맵 이름) ?[일반|경쟁] ![모드명]'
  };
  this.ranking = {
    name: '랭킹',
    description:
      '랭킹 정보를 확인할 수 있습니다.\n' +
      ' * 플레이어: 플레이어 랭킹 정보를 확인할 수 있습니다.\n' +
      ' * 브롤러 [브롤러명]: 브롤러 랭킹 정보를 확인할 수 있습니다.\n' +
      ' * 클럽: 클럽 랭킹 정보를 확인할 수 있습니다.\n',
    args: '(플레이어|브롤러|클럽) ?[브롤러명] ![시작 등수]:[끝 등수]'
  };
}

/**
 * get data from server api
 * @param url
 * @param query
 * @returns {*}
 */
function getBrawlStarsApi(url, query) {
  try {
    return config.getResponse(config.getServerURL(url + query));
  } catch (error) {
    Log.error(error);
    throw error;
  }
}

/**
 * (string) msg.content: 메시지의 내용
 * (string) msg.room: 메시지를 받은 방 이름
 * (User) msg.author: 메시지 전송자
 * (string) msg.author.name: 메시지 전송자 이름
 * (Image) msg.author.avatar: 메시지 전송자 프로필 사진
 * (string) msg.author.avatar.getBase64()
 * (string | null) msg.author.userHash: 사용자의 고유 id
 * (boolean) msg.isGroupChat: 단체/오픈채팅 여부
 * (boolean) msg.isDebugRoom: 디버그룸에서 받은 메시지일 시 true
 * (string) msg.packageName: 메시지를 받은 메신저의 패키지명
 * (void) msg.reply(string): 답장하기
 * (boolean) msg.isMention: 메세지 맨션 포함 여부
 * (bigint) msg.logId: 각 메세지의 고유 id
 * (bigint) msg.channelId: 각 방의 고유 id
 */
function onMessage(msg) {}

bot.addListener(Event.MESSAGE, onMessage);

/**
 * (string) msg.content: 메시지의 내용
 * (string) msg.room: 메시지를 받은 방 이름
 * (User) msg.author: 메시지 전송자
 * (string) msg.author.name: 메시지 전송자 이름
 * (Image) msg.author.avatar: 메시지 전송자 프로필 사진
 * (string) msg.author.avatar.getBase64()
 * (boolean) msg.isDebugRoom: 디버그룸에서 받은 메시지일 시 true
 * (boolean) msg.isGroupChat: 단체/오픈채팅 여부
 * (string) msg.packageName: 메시지를 받은 메신저의 패키지명
 * (void) msg.reply(string): 답장하기
 * (string) msg.command: 명령어 이름
 * (Array) msg.args: 명령어 인자 배열
 */
function onCommand(msg) {
  const room = msg.room,
    author = msg.author,
    content = msg.content,
    command = msg.command,
    args = msg.args,
    image = msg.image,
    isMention = msg.isMention,
    isGroupChat = msg.isGroupChat,
    packageName = msg.packageName;

  switch (command) {
    case commandList.bot.name:
      client
        .sendLink(
          room,
          {
            templateId: 114566, // your template id
            templateArgs: {}
          },
          'custom'
        )
        .awaitResult();
      break;
    case commandList.help.name:
      let cList = '';
      Object.entries(commandList).forEach(([propertyName]) => {
        const args = commandList[propertyName].args
          ? ' ' + commandList[propertyName].args
          : '';
        cList +=
          '- /' +
          commandList[propertyName].name +
          args +
          ': ' +
          commandList[propertyName].description +
          '\n';
      });
      const helpText = '🌸 명령어 목록\n\n' + cList;
      msg.reply(helpText);
      break;
    case commandList.rotation.name:
      let type;
      if (args.length === 0) {
        type = 'curr';
      } else if (args.length > 0) {
        switch (args[0]) {
          case '다음':
            type = 'tomm';
            break;
          default:
            type = 'curr';
            break;
        }
      }

      let timeType, timeText, typeName;

      if (type === 'curr') {
        timeType = 'endTime';
        timeText = '종료까지';
        typeName = '현재';
      } else if (type === 'tomm') {
        timeType = 'startTime';
        timeText = '시작까지';
        typeName = '다음';
      }
      const currRotation = getBrawlStarsApi('events/tl/' + type, '');
      const replyCR = currRotation.map((event) => {
        const mode = config.getKODataFromCdn(event.mode, 'battle', 'mode');
        const mapName = config.getKODataFromCdn(event.mapID, 'map', 'map');
        const url = 'https://brawltree.me/maps/' + event.mapID;
        const date = new Date(event[timeType].replace(' ', 'T'));
        const time = config.getCurrTimeDiff(date);
        return (
          '[' +
          mode +
          ']' +
          '\n' +
          mapName +
          '\n' +
          url +
          '\n' +
          timeText +
          ' ' +
          time.day +
          '일 ' +
          time.hour +
          '시간 ' +
          time.minute +
          '분'
        );
      });

      const rotationReplyText =
        '🌸 ' +
        typeName +
        '맵 로테이션 목록' +
        seeAllViewText +
        '\n\n' +
        replyCR.join('\n\n');
      msg.reply(rotationReplyText);

      break;
    case commandList.map.name:
      if (args.length === 0) {
        msg.reply('상세 맵 정보를 입력해주세요. (예시 : /맵 별내림 계곡)');
      } else if (args.length > 0) {
        let typeString, modeString;
        let modeKey;
        let mapKey, mapName;
        let type = '0',
          typeQuery = '',
          name = '',
          modeName = '';

        for (let i = 0; i < args.length; i++) {
          if (args[i].indexOf('?') !== -1 || args[i].indexOf('!') !== -1) {
            if (args[i].indexOf('?') !== -1) {
              typeString = args[i].replace('?', '');

              if (typeString === '경쟁') {
                type = '2';
                typeQuery = '&grade[]=5&grade[]=6';
              } else {
                type = '0';
                typeQuery =
                  '&grade[]=3&grade[]=4&grade[]=5&grade[]=6&grade[]=7';
              }
            } else if (args[i].indexOf('!') !== -1) {
              modeString = args[i].replace('!', '');

              if (
                type === '2' &&
                [
                  'gemGrab',
                  'brawlBall',
                  'bounty',
                  'heist',
                  'hotZone',
                  'knockout'
                ].indexOf(args[2]) < 0
              ) {
                msg.reply(
                  '찾으시는 모드는 경쟁전 모드가 아닙니다.\n' +
                    '- 사용법 : /맵 [맵 이름 또는 일부] ![일반|경쟁] ?[모드명]\n' +
                    ' * ![일반|경쟁]에 다른 내용을 입력하거나 띄어쓰기 할 경우 기본값은 \"일반\"'
                );
                break;
              }

              modeKey = config.getKeyByValue(modeString, 'battle', 'mode');
              modeName = modeKey ? modeKey : '';
            }
          } else {
            name += args[i];
          }
        }

        try {
          if (name) {
            mapKey = config.getKeyByValue(name, 'map', 'map');
            mapName = mapKey
              ? config.getENDataFromCdn(mapKey, 'map', 'map')
              : '';
          }

          if (mapName === '') {
            msg.reply('맵 이름과 비슷한 정보가 없습니다.');
            break;
          }

          const mapResult = getBrawlStarsApi(
            'maps/name/detail' + '?',
            'name=' +
              mapName +
              '&type=' +
              type +
              typeQuery +
              (modeName ? '&mode=' + modeName : '')
          );

          const brawler1 = mapResult['stats'][0];
          const brawler2 = mapResult['stats'][1];
          const brawler3 = mapResult['stats'][2];
          const brawler4 = mapResult['stats'][3];
          const brawler5 = mapResult['stats'][4];

          client
            .sendLink(
              room,
              {
                templateId: 115655, // your template id
                templateArgs: {
                  mapID: mapResult['map']['mapID'],
                  mapImg: config.getImageUrl(
                    mapResult['map']['mapID'],
                    'maps/'
                  ),
                  mapModeImg: config.getImageUrl(
                    mapResult['map']['mode'],
                    'modes/icon/'
                  ),
                  mapName: config.getKODataFromCdn(
                    mapResult['map']['mapID'],
                    'map',
                    'map'
                  ),
                  mapMode: config.getKODataFromCdn(
                    mapResult['map']['mode'],
                    'battle',
                    'mode'
                  ),
                  mapType: type === '2' ? '경쟁전' : '트로피',
                  brawlerName1: mapResult['stats'][0]
                    ? config.getKODataFromCdn(
                        brawler1.brawlerName,
                        'brawler',
                        'brawler'
                      )
                    : '',
                  brawlerPick1: mapResult['stats'][0] ? brawler1.pickRate : '0',
                  brawlerWin1: mapResult['stats'][0]
                    ? brawler1.victoryRate
                    : '0',
                  brawlerName2: mapResult['stats'][1]
                    ? config.getKODataFromCdn(
                        brawler2.brawlerName,
                        'brawler',
                        'brawler'
                      )
                    : '',
                  brawlerPick2: mapResult['stats'][1] ? brawler2.pickRate : '0',
                  brawlerWin2: mapResult['stats'][1]
                    ? brawler2.victoryRate
                    : '0',
                  brawlerName3: mapResult['stats'][2]
                    ? config.getKODataFromCdn(
                        brawler3.brawlerName,
                        'brawler',
                        'brawler'
                      )
                    : '',
                  brawlerPick3: mapResult['stats'][2] ? brawler3.pickRate : '0',
                  brawlerWin3: mapResult['stats'][2]
                    ? brawler3.victoryRate
                    : '0',
                  brawlerName4: mapResult['stats'][3]
                    ? config.getKODataFromCdn(
                        brawler4.brawlerName,
                        'brawler',
                        'brawler'
                      )
                    : '',
                  brawlerPick4: mapResult['stats'][3] ? brawler4.pickRate : '0',
                  brawlerWin4: mapResult['stats'][3]
                    ? brawler4.victoryRate
                    : '0',
                  brawlerName5: mapResult['stats'][4]
                    ? config.getKODataFromCdn(
                        brawler5.brawlerName,
                        'brawler',
                        'brawler'
                      )
                    : '',
                  brawlerPick5: mapResult['stats'][4] ? brawler5.pickRate : '0',
                  brawlerWin5: mapResult['stats'][4]
                    ? brawler5.victoryRate
                    : '0'
                }
              },
              'custom'
            )
            .awaitResult();
        } catch (err) {
          Log.error(err + JSON.stringify(mapResult) + '\n');
        }
      }
      break;
    case commandList.ranking.name:
      if (args.length === 0) {
        msg.reply(
          '플레이어, 브롤러, 클럽 중 어떠한 랭킹을 확인하실 지 입력해주세요. (예시 : /랭킹 플레이어)'
        );
      } else {
        let rankingString = args[0],
          brawlerString = '';
        let brawlerKOName = '';
        let brawlerID,
          startIndex = 0,
          endIndex = 199;
        let rankingType;

        if (rankingString === '플레이어') {
          rankingType = 'players';
        } else if (rankingString === '브롤러') {
          rankingType = 'brawlers';
        } else if (rankingString === '클럽') {
          rankingType = 'clubs';
        } else {
          msg.reply(
            '찾으시는 랭킹 정보가 없습니다.\n' +
              '- 사용법 : /랭킹 (플레이어|브롤러|클럽) ?[브롤러명] ![시작 등수]:[끝 등수]'
          );
          break;
        }

        for (let i = 1; i < args.length; i++) {
          if (args[i].indexOf('?') > -1 || args[i].indexOf('!') > -1) {
            if (args[i].indexOf('?') > -1) {
              let brawlerName;

              if (rankingType === 'clubs' || rankingType === 'players') {
                msg.reply(
                  '/랭킹 브롤러 명령어로 입력해주세요.\n' +
                    '- 예시 : /랭킹 브롤러 ?쉘리'
                );
                return;
              } else if (rankingType === 'brawlers') {
                brawlerString = args[i].replace('?', '');

                const brawlerList = config.getDataFromCdn('brawlers');
                brawlerName = config.getKeyByValue(
                  brawlerString,
                  'brawler',
                  'brawler'
                );

                if (!brawlerName) {
                  msg.reply(
                    '입력하신 브롤러가 존재하지 않습니다.\n' +
                      '- 예시 : /랭킹 브롤러 ?쉘리'
                  );
                  return;
                }

                brawlerKOName = config.getKODataFromCdn(
                  brawlerName,
                  'brawler',
                  'brawler'
                );
                if (brawlerName) {
                  const brawlerIndex = brawlerList
                    .map((brawler) => brawler.name)
                    .indexOf(brawlerName);
                  brawlerID = brawlerList[brawlerIndex].id;
                }
              }
            } else if (args[i].indexOf('!') > -1) {
              let rankIndexString = args[i].replace('!', '');

              if (rankIndexString.indexOf(':') > -1) {
                [startIndex, endIndex] = rankIndexString
                  .split(':')
                  .map((rank) => Number(rank) - 1);
                if (isNaN(startIndex) || startIndex < 0) {
                  startIndex = 0;
                }
                if (isNaN(endIndex) || endIndex < 0) {
                  endIndex = 199;
                }
              } else {
                startIndex = Number(rankIndexString) - 1;
                endIndex = Number(rankIndexString) - 1;
              }
            }
          }
        }

        if (rankingType === 'brawlers' && brawlerString === '') {
          msg.reply(
            '브롤러 명을 입력해주세요\n' + '- 예시 : /랭킹 브롤러 ?쉘리'
          );
          break;
        }

        const rankResult = getBrawlStarsApi(
          'rankings/' + rankingType + '?',
          'countryCode=' +
            'global' +
            (brawlerID ? '&brawlerID=' + brawlerID : '')
        );

        const rankReplyText = rankResult.items
          .map((player) => {
            return (
              '[' +
              player.rank +
              '] : ' +
              player.name +
              '\n' +
              '- 태그 : ' +
              player['tag'] +
              '\n' +
              '- 트로피 : ' +
              player.trophies +
              '\n' +
              (rankingType === 'clubs'
                ? '- 멤버 수 : ' + player.memberCount + '\n'
                : '') +
              (['players', 'brawlers'].indexOf(rankingType)
                ? '- 프로필 : ' +
                  'https://brawltree.me/brawlian/' +
                  player['tag'].replace('#', '') +
                  '\n'
                : '')
            );
          })
          .slice(startIndex, endIndex + 1)
          .reverse();
        msg.reply(
          '🌸 ' +
            rankingString +
            (brawlerKOName ? ' ' + brawlerKOName : '') +
            ' 랭킹' +
            '(' +
            (startIndex === endIndex
              ? startIndex + 1
              : startIndex + 1 + ' ~ ' + (endIndex + 1)) +
            ')' +
            '\n' +
            '* 기준 : ' +
            rankResult.date +
            '\n' +
            seeAllViewText +
            '\n\n' +
            rankReplyText.join('\n\n')
        );
      }
      break;

    default:
      break;
  }
}

bot.setCommandPrefix('/'); // /로 시작하는 메시지를 command로 판단
bot.addListener(Event.COMMAND, onCommand);

function onCreate(savedInstanceState, activity) {
  const textView = new android.widget.TextView(activity);
  textView.setText('Hello, World!');
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}

function onRestart(activity) {}

function onDestroy(activity) {}

function onBackPressed(activity) {}

bot.addListener(Event.Activity.CREATE, onCreate);
bot.addListener(Event.Activity.START, onStart);
bot.addListener(Event.Activity.RESUME, onResume);
bot.addListener(Event.Activity.PAUSE, onPause);
bot.addListener(Event.Activity.STOP, onStop);
bot.addListener(Event.Activity.RESTART, onRestart);
bot.addListener(Event.Activity.DESTROY, onDestroy);
bot.addListener(Event.Activity.BACK_PRESSED, onBackPressed);
