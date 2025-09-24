---
author: Ray
pubDatetime: 2025-09-25T02:16:00+08:00
modDatetime: 2025-09-25T02:16:00+08:00
title: 吊詭的 403.14 - Forbidden
slug: mysterious-403-forbidden-issue
featured: false
draft: false
tags:
  - blog
  - asp-net
  - iis
  - troubleshooting
  - debugging
  - deployment
  - web-config
  - precompile
  - error-handling
description:
  記錄一次詭異的 ASP.NET 部署問題，從 Runtime Error 到 403 Forbidden，最終發現是 Precompile 預編譯設定導致的坑。包含 IIS 錯誤排查、Windows Event Viewer 使用技巧，以及如何解決預編譯相依性問題的完整除錯過程。
---

> TL;DR 如果你什麼設定都正確，不妨檢查一下前人部署是否使用 Precompile 預編譯&nbsp;

我們公司目前沒有 CI/CD，在手動部署程式的時候難免出現一些詭異的陷阱\
今天第一個遇到的坑是完全沒意義的 Runtime Error

![Runtime error](https://help.duo.com/servlet/rtaImage?eid=ka04u000000QjSh&feoid=00N700000039b6e&refid=0EM0g000000ou1F)
<div class="text-center">示意圖</div>

第一次遇到這個錯誤的我，還以為動到 `Web.config` 導致正式環境直接噴小黃頁\
經歷了一番 Google 和詢問 AI 才知道這個錯誤只是在說 **實際的 Exception 被隱藏了**\
所以名副其實是個沒意義的小黃頁

<img src="https://imgflip.com/s/meme/Sad-Pablo-Escobar.jpg" alt="Narcos meme" style="max-width: 75%; height: auto;">
<div class="text-center">我到底該怎麼 Debug？</div>

後來從 Windows Event Viewer 才看到了真正的錯
```log
Exception information: 
      Exception type: FileLoadException 
      Exception message: Could not load file or assembly 'System.Diagnostics.DiagnosticSource, Version=4.0.4.0, Culture=neutral, PublicKeyToken=cc7b13ffcd2ddd51' or one of its dependencies. The located assembly's manifest definition does not match the assembly reference. (Exception from HRESULT: 0x80131040)
   at Microsoft.AspNet.TelemetryCorrelation.TelemetryCorrelationHttpModule.Application_BeginRequest(Object sender, EventArgs e)
   at System.Web.HttpApplication.SyncEventExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute()
   at System.Web.HttpApplication <>c__DisplayClass285_0.<ExecuteStepImpl>b__0()
   at System.Web.HttpApplication.ExecuteStepImpl(IExecutionStep step)
   at System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean& completedSynchronously)
```

> 📝 Note: Windows Event Viewer 可以用來看 IIS 隱藏的錯誤&nbsp;

錯誤來自於 `bin/` 資料夾內的 `DiagnosticSource` 版本與 `Web.config` 對不上\
而原因是因為我拿到這份專案的時候，為了導入 DI 容器和自動化測試\
因此索性更新了專案，並且重新安裝 NuGet 套件確保方案內的所有專案都不會有套件相依問題
```powershell
# NuGet Package Manager Console
Update-Package -reinstall
```

而這次的錯誤大概也是因為如此，為此我只好更新了那個\
~~萬年不變老鳥千交代萬交代但沒有理由反正就是~~正式環境不可以更新的 `Web.config`

花了一番功夫整理了 `Web.config` 之後，重新回收 IIS 的應用程式集區\
當我以為天下太平，程式又可以繼續運作的時候\
大魔王 `403 - Forbidden: Access is denied.` 就這麼出現了
![403](https://learn-attachment.microsoft.com/api/attachments/253509-image.png?platform=QnA)

這問題真的很玄啊，只要有玩過任何一個 Http File Server 的人應該對這個錯誤訊息不陌生\
架設檔案伺服器的時候，有特定路徑不想開給其他人存取，而 client 誤入就會碰到這個錯誤\
當然也不只檔案伺服器，像 IIS 也有基本的路徑保護 (本次莫名遇到的案例)\
這也是防範 source code 或是重要 config 曝光的基本防護

但痛苦的是，這次連 AI 可能都沒有解決辦法，config 正確、程式沒錯\
還有什麼原因可能導致 403 錯誤而應用程式沒啟動？

> 為什麼 UAT 和 SIT 沒有問題，反而正式環境卻遇到鬼？

在不斷地透過「黃色小鴨除錯法」這個問題在我腦海突然浮現\
我開始檢查這次正式環境跟 UAT 兩個環境的 `bin/` 資料夾

其中我發現了 UAT 環境的 `bin/` 資料夾內有 `App_global.asax.compiled` 這個檔案\
當專案是透過 Visual Studio 的 Publish Profile 來發布的時候\
Publish Profile 其中一個選項可以決定是否需要 pre-compile 預編譯\
啟用 pre-compile 時候，`bin/` 資料夾內就會產生 `*.compiled` 的檔案\
然而我都是透過 `Ctrl+Shift+B` 快捷鍵的方式下去建置專案，所以當然沒有這鬼東西\
而根本原因也是因為在正式環境，我想要建置乾淨，因此將正式環境的 `bin/` 內清空

真相大白之後，我隨即將 UAT 環境的 `App_global.asax.compiled` 複製一份到正式環境\
這才解決了 403 這個鬼問題... 了嗎(?)\
到這邊我還是心有不滿...

> 這樣並沒有解決專案相依預編譯的問題，且並不是人人會使用 Publish Profile！

當我去詢問了 AI 之後，這才終於知道使用預編譯會在根目錄 `~/` 產生 `PrecompiledApp.config`\
檢查了根目錄 `~/` 確實都有 `PrecompiledApp.config`\
在我刪除了 UAT 和正式環境的 `PrecompiledApp.config` 和所有的 `*.compiled` 後\
這才真正的結束了這次的部署遇到的爛坑

---

## 後記
何謂「黃色小鴨除錯法」可以參考[維基百科](https://zh.wikipedia.org/zh-tw/%E5%B0%8F%E9%BB%84%E9%B8%AD%E8%B0%83%E8%AF%95%E6%B3%95)

Debug 的時候我有太多地方想吐槽現在的公司了，像是...\
「公司喜歡 LOG 監控記錄所有事情，而真正 Error 卻沒記錄到反而被 IIS 阻擋」\
又或者「如果真的噴錯了，讓 client 端看到小黃頁合理嗎？」等等...

作為一個希望未來能成為資深軟體工程師的人\
其實我真的很不喜歡天賦樹點 Infra 類的相關技能\
不過未來真的想成為 SA 系統分析師的話，這些坑還真的要踩過才能累積自己的經驗值也說不定...

~~狗屁，這間公司就是軟體技術門檻極低，人人都來養老並推崇 Infra 的鴕鳥公司 (凸)~~