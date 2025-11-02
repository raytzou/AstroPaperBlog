---
author: Ray
pubDatetime: 2025-11-03T00:00:00+08:00
modDatetime: 2025-11-03T00:00:00+08:00
title: CS2 Sound Event 開發指南：Workshop Tool 編譯與 CSSharp 實作
slug: cs2-sound-event-workshop-tool
featured: false
draft: false
tags:
  - blog
  - cs2
  - memo
  - workshop
  - sound-event
  - cssharp
  - tutorial
  - steam-workshop
description:
  本篇文章記錄如何透過 CS2 Workshop Tool 編譯、發布自定義 Sound Event 到 Steam Workshop 上，並透過 CSSharp 撰寫最小可行範例。
---

最近終於完成 CSSharp 專案 Boss 的開發，也終於進入到播放音效的部分

播放音效不像其他開發，牽扯到外部工具 Workshop Tool 的使用以及 vsndevts 的撰寫

看了許多~~廢話般的~~教學文，覺得還不如自己手寫一篇簡單的說明文\
也防止自己未來又忘了如何操作 Workshop Tool，對於軟體工程人員不是那麼直覺的軟體

> 📝 本篇文章會用最重點的方式完成最小可行的音效播放範例

---

## 前置作業

1. CS2 Workshop Tool
  - 請先安裝 CS2 Workshop Tool
  - 你可以透過遊戲內設定選項 (需重開)，亦或是在 Steam 遊戲庫，對 CS2 點右鍵屬性，進入 DLC 頁籤，將 `Counter-Strike 2 Workshop Tools` 打勾

2. 準備好你想要的音樂素材
  - 音樂檔案格式不要太奇怪基本上應該(?)都可以，如： `*.mp3` `*.wav`
  - 有說法是 Source 2 引擎只吃 44100 Hz 採樣率的音效檔，我沒特別去試，怕的話就自己遵守吧

---

## 基本觀念

> 免責聲明：以下為自己的理解，觀念上有錯就錯吧(?)

### content 和 game 資料夾

從 CS2 開始後，在遊戲根目錄底下會有 `content` 和 `game` 兩個資料夾\
我自己的理解是：
- `content` 為編譯前原生檔案資料夾 (包含：地圖資源、音效檔)
- `game` 為 Workshop Tool 編譯好後的輸出資料夾

因此大目標是： **透過 Workshop Tool 將想要的 Server 資源，從 content 編譯到 game 資料夾**\
其實就這麼簡單...

> NOTE: 如果你有已經編譯好的檔案，也可以直接放入 game 資料夾底下，上傳到 Workshop 變成自己的 Workshop Item

---

## 教學

### 建立 Asset

1. 在 `content/csgo_addons` 和 `game/csgo_addons` 兩個資料夾內建立相同名稱的資料夾，以下以 `my_server_sounds` 為例
2. `content/csgo_addons/my_server_sounds/sounds` 放入準備好的音效檔
3. `content/csgo_addons/my_server_sounds/` 建立 `soundevents` 資料夾
4. 使用喜歡的文字編輯器 (Notepad++ 或 Visual Studio Code 都可以)，輸入以下內容
```xml
<!-- kv3 encoding:text:version{e21c7f3c-8a33-41c5-9977-a76d3a32aa0d} format:generic:version{7412167c-06e9-4698-aff2-e63eb59037e7} -->
{
	"Sound.Event.Example" =
	{
      type = "csgo_music"
      volume = 1
      pitch = 1.000000
      vsnd_files = "sounds/sound.vsnd"
	}
}
```
說明：
- 第一行看起來像 XML 註解的部分不能變更，也不能少
- `Sound.Event.Example` 為 Sound Event 的名稱，可自定義，慣例使用大寫並以 `.` 分隔
- type 有 `csgo_music` `csgo_mega`
  - `csgo_music` 用來放音樂、UI 等... 不需要 3D 空間的音效，使用 `snd_musicvolume` console 指令控制音量，抓檔案必須使用 `vsnd_files`
  - `csgo_mega` 3D 音效，離聲音 source 越近越大聲，使用 `snd_toolvolume` console 指令控制音量 *(需確認)* ，抓檔案必須使用 `vsnd_files_track_01`
  - `pitch` 播放速度的 offset，數值越高 **播放速度越快聲音越高** ，反之聲音越低播放越久

撰寫完成將文件另存新檔至 `content/csgo_addons/my_server_sounds/soundevents` ，檔名 `soundevents_addon.vsndevts`

### 編譯 vsndevts

1. 開啟 CS2 Workshop Tool 並選擇剛剛建立的 `my_server_sounds` asset

> 如果找不到剛剛建立的 asset，請確認 game/csgo_addons 底下是否有剛剛建立的資料夾

2. Asset Browser 可利用過濾只濾出自己的 Asset 內容

![Asset Browser Filter](https://i.meee.com.tw/EhfzaWa.png)

3. 在 Asset Browser 全選所有音效檔並選擇任一檔案右鍵 => Recompile => Full，便可將所有音效檔編譯成 `*.vsnd_c`
   - 輸出位置為 `game/csgo_addons/my_server_sounds`

![Asset Browser Compile](https://i.meee.com.tw/U3atTm6.png)

以上就算是完成基本的 Workshop Asset 建立，以及編譯成 Workshop 需要的格式了

### 上傳至 Workshop

1. Asset Browser 右上角 `Tools` => Counter-Strike 2 Workshop Manager
2. Counter-Strike 2 Workshop Manager 右上角 `New` 開啟佈署視窗
3. 依序輸入 `Title` `Description`，並選擇一張 Workshop item 的圖片
![Workshop Publish window](https://i.meee.com.tw/iihvdY7.png)
> Visibility 記得選擇 Public
> 佈署視窗左下角 `Contents` 可以確認自己即將上傳的檔案有哪些

都完成後直接點 `Submit` 即可\
完成後，瀏覽器會自動開啟並轉向剛剛佈署上 Workshop 的 asset (item) 頁面\
網址後的 `id` 複製起來，在 MultiAddonManager 會用上

> 如果未來有任何的更新，只需要重新編譯所有音效檔\
> 並在 Counter-Strike 2 Workshop Manager 視窗\
> 對已經佈署的 Workshop Item 右鍵點選 Re-Upload\
> 輸入 Change Log 並 Submit 即可

### MultiAddonManager

MultiAddonManager 用來將 Workshop 資源 mount 入 server\
Server 端安裝 MultiAddonManager 後，在 cfg 補上 Workshop ID 即可
```log
mm_extra_addons "1234567890" // 假設 ID 為 "1234567890"
```

---

## CSSharp 最小範例

終於來到最後的部分了\
複製以下程式碼並建立新的 plugin 即可測試

```cs
using CounterStrikeSharp.API.Core;
using CounterStrikeSharp.API.Core.Attributes.Registration;
using CounterStrikeSharp.API.Modules.Commands;
using CounterStrikeSharp.API.Modules.Utils;
using Microsoft.Extensions.Logging;

namespace MyProject
{
    public class FirstSoundEvent : BasePlugin
    {
        public override string ModuleName => "Your Plugin Name";

        public override string ModuleVersion => "Your Plugin Version";

        public override void Load(bool hotreload)
        {
            RegisterListener<Listeners.OnServerPrecacheResources>(OnServerPrecacheResources);
        }

        private void OnServerPrecacheResources(ResourceManifest manifest)
        {
            manifest.AddResource("soundevents\\soundevents_addon.vsndevts"); // precache
        }

        [ConsoleCommand("css_sound", "sound command")]
        public void OnMusicCommand(CCSPlayerController client, CommandInfo command)
        {
            PlaySoundEvent(client);
        }

        private void PlaySoundEvent(CCSPlayerController player)
        {
            const float volume = 1f;
            const float pitch = 1f;
            const string soundEvent = "Sound.Event.Example";
            var recipient = new RecipientFilter();

            recipient.Add(player); // the player who can hear the sound event
            player.EmitSound(soundEvent, recipient, volume, pitch); // event name should be the same as the event you created in soundevents
            Logger.LogInformation("Sound Event {soundEvent} has been played.", soundEvent);
        }
    }
}

```

在自己的 Server，輸入 `!sound` 應該就可以聽到剛剛建立的 `Sound.Event.Example` 的聲音了

---

## 後記

其實我還蠻懷念以前 AMX Mod X 和 SourceMod 的時代\
對於伺服器資源，不論是 models、maps... 只要丟上網路空間， `server.cfg` 補上 `sv_downloadurl` HTTP 檔案伺服器位址即可\
另外從中也可以看出 Valve 對於社群管理方針只會限制越來越多\
之後能不能繼續透過這樣的方式來上傳伺服器資源也是未知數\
目前的作法其實是騙 Workshop 上傳內容是地圖