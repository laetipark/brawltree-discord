const scriptName = 'blossom-bot';
const config = require('config');
const secret = require('secret');
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
client.init(secret['apiKey'], secret['url'], cookies);

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
function CommandList(){
  this.bot = {
    name: '봇',
    description: '봇에 대한 소개를 합니다.'
  };
  this.help = {
    name: '도움말',
    description: '봇에 대한 도움말 목록을 확인합니다.'
  };
  this.rotation = {
    name: '이벤트',
    description: '맵 로테이션에 대한 정보를 확인할 수 있습니다.\n' +
      ' * 현재: 현재 로테이션 정보\n' +
      ' * 다음: 다음 로테이션 정보',
    args: '[현재|다음]'
  };
  this.map = {
    name: '맵',
    description: '맵 상세 정보를 확인할 수 있습니다.\n',
    args: '[맵 이름] [일반|경쟁] [모드명]'
  };
}

function getBrawlStarsApi(url, query){
  try{
    return config.getResponse(config.getServerURL(url + query));
  }catch (error){
    Log.error(error);
    throw error;
  }
}

function getMapRotation(type){
  let timeType, timeText, typeName;

  if(type === 'curr'){
    timeType = 'endTime';
    timeText = '종료까지';
    typeName = '현재';
  }else if(type === 'next'){
    timeType = 'startTime';
    timeText = '시작까지';
    typeName = '내일';
  }
  const currRotation = getBrawlStarsApi('events/tl/' + type);
  const replyCR = currRotation.map((event) => {
    const mode = config.getDataFromCdn(event.mode, 'battle', 'mode');
    const mapName = config.getDataFromCdn(event.mapID, 'map', 'map');
    const url = 'https://brawltree.me/maps/' + event.mapID;
    const date = new Date(event[timeType].replace(' ', 'T'));
    const time = config.getCurrTimeDiff(date);
    return (
      '[' + mode + ']' + '\n' +
      mapName + '\n' + url + '\n' +
      timeText + ' ' +
      time.day + '일 ' +
      time.hour + '시간 ' +
      time.minute + '분'
    );
  });

  return '🌸 ' + typeName + '맵 로테이션 목록' +
    seeAllViewText + '\n\n' + replyCR.join('\n\n');
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
function onMessage(msg){
}

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
function onCommand(msg){
  const room = msg.room,
    author = msg.author,
    content = msg.content,
    command = msg.command,
    args = msg.args,
    image = msg.image,
    isMention = msg.isMention,
    isGroupChat = msg.isGroupChat,
    packageName = msg.packageName;

  switch (command){
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
        const args = commandList[propertyName].args ? ' ' + commandList[propertyName].args : '';
        cList += '- /' + commandList[propertyName].name +
          args + ': ' + commandList[propertyName].description + '\n';
      });
      const helpText = '🌸 도움말 목록\n\n' +
        cList;
      msg.reply(helpText);
      break;
    case commandList.rotation.name:
      let type;
      if(args.length === 0){
        type = 'curr';
      }else if(args.length > 0){
        switch (args[0]){
          case '현재':
            type = 'curr';
            break;
          case '내일':
            type = 'next';
            break;
          default:
            return;
        }
      }

      const currReplyText = getMapRotation(type);
      msg.reply(currReplyText);

      break;
    case commandList.map.name:
      if(args.length === 0){
        msg.reply('상세 맵 정보를 입력해주세요. (예시 : /맵 별내림 계곡)');
      }else if(args.length > 0){
        let typeString;
        let modeKey, modeString;
        let type, queryString;
        let mapKey, mapName;

        if(args[0]){
          mapKey = config.getKeyByValue(args[0], 'map', 'map');
          mapName = mapKey ? config.getENDataFromCdn(mapKey, 'map', 'map') : '';
        }

        if(mapName === ''){
          msg.reply('맵 이름과 비슷한 정보가 없습니다.');
          break;
        }

        if(args[1]){
          typeString = args[1];
        }

        if(typeString === '경쟁'){
          type = '2';
          queryString = '&grade[]=5&grade[]=6';
        }else{
          type = '0';
          queryString = '&grade[]=3&grade[]=4&grade[]=5&grade[]=6&grade[]=7';
        }

        if(args[2]){
          if(type === '2' &&
            ['gemGrab', 'brawlBall', 'bounty', 'heist', 'hotZone', 'knockout']
              .indexOf(args[2]) < 0){
            msg.reply('찾으시는 모드는 경쟁전 모드가 아닙니다.\n' +
            '- 사용법 : /맵 [맵 이름 또는 일부] [일반|경쟁] [모드명]\n' +
            ' * [일반|경쟁]에 다른 내용을 입력하거나 띄어쓰기 할 경우 기본값은 [일반]');
            break;
          }

          modeKey = config.getKeyByValue(args[2], 'battle', 'mode');
          modeString = modeKey ? modeKey : '';
        }

        const mapResult = (
          getBrawlStarsApi('maps/name/detail' + '?',
            'name=' + mapName +
            '&type=' + type +
            queryString +
            (modeString ? '&mode=' + modeString : '')
          ));

        client
          .sendLink(
            room,
            {
              templateId: 115655, // your template id
              templateArgs: {
                mapID: mapResult['map']['mapID'],
                mapImg: config.getImageUrl(mapResult['map']['mapID'], 'maps/'),
                mapModeImg: config.getImageUrl(mapResult['map']['mode'], 'modes/icon/'),
                mapName: config.getDataFromCdn(mapResult['map']['mapID'], 'map', 'map'),
                mapMode: config.getDataFromCdn(mapResult['map']['mode'], 'battle', 'mode'),
                mapType: type === '0' ? '트로피' : '경쟁전',
                brawlerName1: config.getDataFromCdn(mapResult['stats'][0]['brawlerName'], 'brawler', 'brawler'),
                brawlerName2: config.getDataFromCdn(mapResult['stats'][1]['brawlerName'], 'brawler', 'brawler'),
                brawlerName3: config.getDataFromCdn(mapResult['stats'][2]['brawlerName'], 'brawler', 'brawler'),
                brawlerName4: config.getDataFromCdn(mapResult['stats'][3]['brawlerName'], 'brawler', 'brawler'),
                brawlerName5: config.getDataFromCdn(mapResult['stats'][4]['brawlerName'], 'brawler', 'brawler'),
                brawlerPick1: mapResult['stats'][0]['pickRate'],
                brawlerPick2: mapResult['stats'][1]['pickRate'],
                brawlerPick3: mapResult['stats'][2]['pickRate'],
                brawlerPick4: mapResult['stats'][3]['pickRate'],
                brawlerPick5: mapResult['stats'][4]['pickRate'],
                brawlerWin1: mapResult['stats'][0]['victoryRate'],
                brawlerWin2: mapResult['stats'][1]['victoryRate'],
                brawlerWin3: mapResult['stats'][2]['victoryRate'],
                brawlerWin4: mapResult['stats'][3]['victoryRate'],
                brawlerWin5: mapResult['stats'][4]['victoryRate']
              }
            },
            'custom'
          )
          .awaitResult();
      }
      break;
    default:
      break;
  }
}

bot.setCommandPrefix('/'); // /로 시작하는 메시지를 command로 판단
bot.addListener(Event.COMMAND, onCommand);

function onCreate(savedInstanceState, activity){
  const textView = new android.widget.TextView(activity);
  textView.setText('Hello, World!');
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity){
}

function onResume(activity){
}

function onPause(activity){
}

function onStop(activity){
}

function onRestart(activity){
}

function onDestroy(activity){
}

function onBackPressed(activity){
}

bot.addListener(Event.Activity.CREATE, onCreate);
bot.addListener(Event.Activity.START, onStart);
bot.addListener(Event.Activity.RESUME, onResume);
bot.addListener(Event.Activity.PAUSE, onPause);
bot.addListener(Event.Activity.STOP, onStop);
bot.addListener(Event.Activity.RESTART, onRestart);
bot.addListener(Event.Activity.DESTROY, onDestroy);
bot.addListener(Event.Activity.BACK_PRESSED, onBackPressed);