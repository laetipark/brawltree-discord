const scriptName = 'blossom-bot';
const config = require('config');
const secret = require('secret');
var { KakaoApiService, KakaoShareClient } = require('kakaolink');

const service = KakaoApiService.createService();
const client = KakaoShareClient.createClient();

/**
 * 알아서 카카오톡으로 접속해 로그인 세션을 불러옴
 */
const cookies = service
  .login({
    signInWithKakaoTalk: true,
    context: App.getContext()
  })
  .awaitResult();
client.init(secret['apiKey'], secret['url'], cookies);
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
    name: '맵',
    description: '맵 로테이션 또는 상세맵에 대한 정보를 확인할 수 있습니다.\n' +
      ' * 현재: 현재 로테이션 정보\n' +
      ' * 다음: 다음 로테이션 정보',
    args: '(현재|다음)'
  };
}

function getBrawlStarsApi(url){
  Log.info(config.getServerURL());
  try{
    return config.getResponse(config.getServerURL(url));
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
    const mode = config.getMapMode(event.mode);
    const mapName = config.getMapName(event.mapID);
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

  Log.info(commandList.bot.name);
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