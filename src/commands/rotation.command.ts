import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import config from '~/config/config';

const currEmbed = (currMap) => {
  return new EmbedBuilder()
    .setColor(0x2ecc70)
    .setTitle(`**현재 로테이션**`)
    .setURL(`https://blossomstats.site/map/${currMap.MAP_ID}`)
    .setThumbnail(`attachment://${currMap.MAP_ID}.webp`)
    .addFields({
      name: `${config.modeIcon[currMap.MAP_MD]} ${
        config.modeKR[currMap.MAP_MD]
      }`,
      value: currMap.MAP_NM,
    })
    .toJSON();
};

const nextEmbed = (nextMap) => {
  return new EmbedBuilder()
    .setColor(0x2ecc70)
    .setTitle(`**다음 로테이션**`)
    .setURL(`https://blossomstats.site/map/${nextMap.MAP_ID}`)
    .setThumbnail(`attachment://${nextMap.MAP_ID}.webp`)
    .addFields({
      name: `${config.modeIcon[nextMap.MAP_MD]} ${
        config.modeKR[nextMap.MAP_MD]
      }`,
      value: nextMap.MAP_NM,
    })
    .toJSON();
};

export const rotationCommand = {
  data: new SlashCommandBuilder()
    .setName('로테이션')
    .setDescription('플레이어의 프로필 정보를 보여준다.')
    .addNumberOption((option) =>
      option
        .setName('게임모드')
        .setDescription('게임모드를 설정합니다.')
        .setChoices(
          { name: '브롤 볼', value: 1 },
          { name: '젬 그랩', value: 3 },
          { name: '하이스트/핫 존', value: 4 },
          { name: '녹아웃', value: 6 },
          { name: '클린 아웃', value: 10 },
          { name: '주말 이벤트', value: 33 },
          { name: '쇼다운', value: 5 },
        )
        .setRequired(true),
    )
    .toJSON(),
  async execute(interaction) {
    /*const options = interaction.options;
    const mode = options.getNumber('게임모드') !== null ? options.getNumber('게임모드') : '';
    const [currMap, nextMap] = await rotationService.selectRotationMap(mode);

    await interaction.reply({
      embeds: [
        currEmbed(currMap),
        nextEmbed(nextMap),
      ],
      files: [{
        attachment: `${config.cdnURL}/maps/${currMap.id}.webp`,
        name: `${currMap.id}.webp`,
      }, {
        attachment: `${config.cdnURL}/maps/${nextMap.id}.webp`,
        name: `${nextMap.id}.webp`,
      }],
    });*/
  },
};
