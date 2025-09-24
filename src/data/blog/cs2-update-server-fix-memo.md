---
author: Ray
pubDatetime: 2025-08-05T00:00:00+08:00
modDatetime: 2025-08-05T00:00:00+08:00
title: CS2 更新後伺服器整理 Memo
slug: server-fix-memo
featured: false
draft: false
tags:
  - blog
  - cs2
  - memo
description:
  CS2 更新後，伺服器部分 config 會被重置。此篇只是個人整理 Memo 紀錄使用。
---

每次 CS2 更新，有些 config 設定檔會被重置，因此留個 Memo 紀錄，以免日後又忘記了

## 要整理的項目
1. gameinfo.gi
  - Metamod: Source 路徑配置
```
Game csgo/addons/metamod
```
  - botprofile.db override
```
Game csgo/overrides/botprofile.vpk
```
2. cfg 整理與備份
  - gamemode_casual.cfg
  - server.cfg
> ⚠️ SteamCMD 更新伺服器前記得備份。
3. Metamod: Source 和 CounterStrikeSharp 視情況更新

---

## botprofile.db override 方法

感謝 Reddit 有好心人分享 <a href="https://www.reddit.com/r/GlobalOffensive/comments/16u8175/comment/kxolry1/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button">任意門</a>

- Step 1. 使用 `VPKEdit` 從 `pak01_000.vpk` 將 `botprofile.db` 取出\
(或是直接從 CS:GO 遊戲資料夾複製一份 ~反正都長得一樣~)

- Step 2. 將取出的 `botprofile.db` 隨意放置在空資料夾\
必須是空的，因為等等要重新包成 VPK 檔，防止不相干檔案被包進 VPK

- Step 3. 編輯 `botprofile.db`\
在這邊不提供 `botprofile.db` 內的修改教學

- Step 4. 建立 `overrides` 資料夾
  - 路徑：<"CS2根目錄">\game\csgo\overrides
  > 不一定要叫做 'overrides'，認得出來即可。

- Step 5. VPKEdit > File > Create From Folder... > VPK
  1. VPK 參數，如：Version，全部預設即可
  2. 找到並選擇剛剛編輯的 `botprofile.db` 的空資料夾
  3. VPK 檔案名稱取名叫做 `botprofile.vpk` 即可
  4. 將 `botprofile.vpk` 存放至 `overrides` 資料夾

- Step 6. gameinfo.gi 注入 `Game csgo/overrides/botprofile.vpk`

---

## GitHub Project

目前設為公開 ~不知道哪來的勇氣，可能梁靜茹給的~\
有關插件處理狀況可以[到 GitHub Project 看](https://github.com/users/raytzou/projects/1/views/1)

目前採 SCRUM 精神，建立了幾個河道
- Backlog: 處裡主要項目，目前只有 `Debug`，也許未來會有 `Feature: 開發功能`
- Ready: 其實就 `To Do` ~GitHub預設就叫 `Ready`，很不直覺，我也懶得改了~
- In progress: 處理中項目
- In review: 待測試區塊
- Done: 完成項目

~也許未來會開放 issue 或建立個許願池讓好友許願之類的~