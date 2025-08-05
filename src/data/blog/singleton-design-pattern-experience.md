---
author: Ray
pubDatetime: 2024-08-06T00:00:00.000Z
modDatetime: 2024-08-06T00:00:00.000Z
title: 不要使用 Singleton 設計樣式
slug: singleton-experience
featured: false
draft: false
tags:
  - blog
  - programming
  - singleton
  - design-pattern
description:
  使用 Singleton 的經驗和一些反思。
---

> 標題下的有點聳動，但本篇只是個紀錄跟反思

在我的 CSSharp 專案中\
當初腦洞大開，餅畫太大，將框架設計成三個模組\
分別是
- Main: 插件本體
- Bot: 控制電腦玩家相關行為的模組
- Command: 玩家指令集模組，像是 `!info` 之類的指令可以使用

不是各自獨立的插件而是同專案的三個區塊模組\
在同一個專案底下，這樣最大的好處就是底層(像是:玩家計數器)就不用各別再實作一次\
而模組未來如果有需要，也可以自己再新增實作

但是 `BasePlugin` 只能由 `Main` 繼承\
因此這些底層資源，又或是一些 properties 也跟著只能在 `Main` 做處理

但問題來了：\
**我的其他模組要怎麼使用到 `Main` 處理好的資源?**

當時情急之下，腦海裡浮現的唯一解法就是在資策會上 Unity 課程學到的 Singleton 設計樣式\
使用了 Singleton 之後，`Bot` 跟 `Command` 兩個模組自然就能透過 `Main.Instance` 取得到需要的資源了，可喜可賀(?)\
然而，現在回過頭來看，這真的是該死的處理方式(?)

首先，使用 Singleton 會造成以下問題
```
1. 緊耦合問題
2. 違反依賴注入原則: 已經使用了 DI 容器，而 Singleton 設計樣式會繞過這層架構
3. 生命週期管理問題: Instance 處理時機問題，除非有確切把握，不然很容易造成 null reference，這個痛在上課的時候已經有深刻體會
4. 難以測試: 這部分倒還好，就我所知，遊戲開發似乎比較少在做單元測試
5. 執行序安全（Thread Safety）風險: 多執行緒環境下，初始化和狀態同步可能出現 race condition，這部分讓我頭痛，也很難追 bug
6. 全域狀態污染: 和全域變數一樣，全域可變狀態會讓行為不可預測，也容易出現「先後呼叫順序依賴」
7. 難以重構: 一旦核心邏輯依賴 Singleton，要換成 Service/DI 容器時成本極高
```

看到了嗎? **難以重構**\
當初的方便卻換來了極大的痛苦\
我因為部分 `Main` 的 methods 也想開出去給其他模組使用\
這才導致我回頭重新審視 Singleton 的部分

當下二話不說，立馬直接將 Singleton 給斬了，接著準備抽介面\
完成重構的當下還以為沒那麼困難\
只需要把其他地方會用到的部分，從 `Main` 取出來放在在新的介面上就好了\
結果馬上撞到循環注入的錯誤
```log
System.InvalidOperationException: A circular dependency was detected for the service of type 'MyProject.Plugins.Interfaces.IBot'.
MyProject.Main -> MyProject.Plugins.Interfaces.IBot(MyProject.Plugins.Bot) -> MyProject.Services.Interfaces.ICommonAndStateService(MyProject.Main) -> MyProject.Plugins.Interfaces.IBot
```
- Main 需要 IBot
- Bot 需要 ICommonAndStateService (新開的介面)
- ICommonAndStateService 是由 Main 實現\
這形成了一個循環：Main → IBot → ICommonAndStateService → Main

幾個小時過去了，不論我使用 Lazy 或是使用獨立 concrete class 來實作介面\
都還是會有處理不完的 null 或是卡在處理時機問題\
例如玩家計數器需要透過 `OnClientPutInServer()` 和 `EventPlayerDisconnect` 等 CSSharp 的 APIs 來處理\
而這些 APIs 只能透過繼承 BasePlugin 才有，所以獨立 concrete class 實作介面幾乎不可行

最後還是妥協繼續使用 Singleton 只能說我太廢了\
如果你看完了這篇廢文\
切記：**為了程式碼維護性跟可讀性，不要使用 Singleton 做程式開發** 💀

~下次設計框架一定 DI 啦，下次~