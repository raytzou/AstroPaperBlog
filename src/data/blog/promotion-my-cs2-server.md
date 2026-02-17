---
author: Ray
pubDatetime: 2026-01-10T00:00:00+08:00
modDatetime: 2026-02-17T00:00:00+08:00
title: 推廣自己的 CS2 Server
slug: promotion-my-cs2-server
featured: true
draft: false
tags:
  - blog
  - gaming
  - counter-strike
  - cs2
  - cs2-server
  - multiplayer
  - gaming-community
  - game-development
  - server-setup
  - co-op-gaming
  - vsbot
  - game-tutorials
  - online-gaming
description:
  推廣自己的 CS2 Server，包含連線教學、特色，以及伺服器資訊。
---

> 開發許久的 CounterStrike Sharp 插件，總算是到了自己滿意可以公測的階段了

## contents

## 伺服器特色

### 中文介紹
1. 沒有特色(?)，跟直接下 `map de_dust2` 指令建立的 LAN saba 差不多 
2. BOT profile 參數完全預設，該 BOT 如果是 Elite 等級那就是官方的 Elite 等級 
3. 跟 Kurome, Enda 最大不同的是，\
   我覺得 BOT 復活在其他 BOT 旁邊很煩(又無敵)，\
   所以我的設計是 BOT 隨機點出生。\
   在同一個地方蹲太久小心被後面突如其來的 BOT play(?) 
4. 承上，如果隨機出生，然後那個地圖設計太爛，\
   BOT 可能會出生在地圖外 (這也是為什麼 volvo 把隨機出生鎖起來不開放的原因) 
5. 沒有主題，沒有什麼撿硬幣或 VIP 主題，所以玩起來應該很無聊 
6. ~~BOSS 會連續施放能力 (下次再修，下此啦，哪次不是下次)~~
7. SaySound 完全使用 Kurome 大的 (Kurome ari 😭) 
8. 不知道，想到再說，反正就是很爛很陽春的 saba

### 日本語
1. 特に何もない(?)。ほぼ `map de_dust2` を直接立てた LAN saba と同レベル
2. BOT の profile パラメータは完全デフォルト。\
   Elite なら、それは volvo 公式の Elite BOT です
3. Kurome や Enda の saba と一番違うところは、\
   BOT が他の BOT の横に復活するのがウザい（しかも無敵）と思ったので、\
   うちは BOT をランダムスポーンにしてます。\
   同じ場所でずっと芋ってると、後ろから突然 BOT play(?) が来るので注意
4. ↑の続き。\
   ランダムスポーンにすると、マップ設計がクソな場合、\
   BOT がマップ外に湧くことがあります。\
   これが volvo がランダムスポーンを封印してる理由（たぶん）
5. テーマなし。コイン拾いも VIP もなし。\
   なので普通にクソつまらないと思います
6. BOSS が能力を連続で撃ちます。\
   次で直す予定（次回ね、次回。いつも次回）
7. SaySound は全部 Kurome 大のをそのまま使用してます（Kurome ari 😭）
8. まだあるかもだけど、思い出したら書く。\
   まあ、とにかくクソで超シンプルな saba です


## 連線方式

開啟控制台直接輸入
```bash
connect cynicat.myddns.me:27987; password quitjob™
```

## 常見問題

1. 為什麼連線讀取後又回到遊戲主畫面？
   - 原因：MultiAddonManager 推送需要的 Workshop item 失敗，導致缺少需要的資源而無法進入 Server
   - 解法：訂閱 [我的 Workshop Item](https://steamcommunity.com/sharedfiles/filedetails/?id=3633304771) 即可，如果還是不行，可以再試試訂閱 [Kurome 大的 Workshop Item](https://steamcommunity.com/sharedfiles/filedetails/?id=3101610901)
2. 為什麼有時候玩一玩突然遊戲整個沒聲音
   - 造成原因不明，如果突然聽不到任何聲音，重進 Server 即可修復
3. C4 timer 壞了？
   - 有時候。

## 伺服器資訊

### ---
#### **營運狀態**
- 目前非 24/7 營運，我想開就開，我想關就關，Kurome 或 tukimi 開啟後就直接關閉

#### **伺服器設計方向**
*突破傳統 CS 遊戲模式：*

**不再是 PvP 遊戲**
- 以合作 (Co-op) 導向，對決 BOT
- 總回合數為 8 回合，不冗長、不耗時、不耗精神
- 遊戲中間以及結尾挑戰 Boss，Boss 有特殊能力
- 特殊 BOT 的設計

**特殊 BOT**
- mimic：手持 M4A1-S，每回合會企圖扮演成玩家
- Rush：手持 P90，血量較高，常常會率先衝入玩家陣營
- EagleEye：單兵菁英等級狙擊手，武器為 AWP，不太與其他 BOT 合作

**Boss 技能**
- 火焰瓶攻擊：對每位活著玩家召喚火焰瓶
- 手榴彈攻擊：對每位活著玩家召喚手榴彈
- ~~閃光彈攻擊：對每位活著玩家召喚閃光彈~~
  - 目前已知召喚失敗，修復中
- 冰封：讓每位玩家移動減速 2 秒
- 毒氣攻擊：挑任意 1/3 活著玩家召喚有毒煙霧彈，在煙霧彈內每秒扣 5 HP
- 詛咒攻擊：Boss HP 低於 1/3 後有機率使用詛咒攻擊，會導致玩家每秒損傷 2 HP，此外會有被隨機打飛的效果

**常用指令**
- `!help`：顯示其他指令
- `!info`：顯示伺服器資訊
- `!revive` `!res`：復活指令，消耗 50 點復活，復活後會還你生前武器裝備並在死亡地點復活
- `!models`：Skin 選擇 menu
- `!volume`：設定背景音樂音量百分比
- `!ss_volume`：設定 SaySound 音量百分比
- `!buy`：購買指令，輸入不帶參數會開啟購買選單，參數支援模糊搜尋，以下範例
  - `!buy awp` 給 AWP
  - `!buy ak47` 給 AK47
  - `!buy health` 或 `!buy hea` 都會給治療針 Health Shot
  - `!buy WTF` 搜尋不到則 **什麼都沒有**
- `!en`：切換 SaySound 語言為英文
- `!jp`：切換 SaySound 語言為日文
- `!tw`：切換 SaySound 語言為繁體中文

## 意見回饋

如有任何想法或建議，歡迎透過 Steam 加好友或是 Discord (ID: cynic_cat) 與我聯繫。

## 友情連結

- [KuromeKuro Discord](https://discord.gg/PGRGvrQN)
- [まめいろサーバー Discord](https://discord.gg/5YkNf7Ey)
