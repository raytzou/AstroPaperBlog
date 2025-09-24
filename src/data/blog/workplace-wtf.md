---
author: Ray
pubDatetime: 2025-09-15T00:00:00+08:00
modDatetime: 2025-09-15T00:00:00+08:00
title: 工作遇到的鬼故事
slug: workplace-wtf
featured: false
draft: false
tags:
  - blog
description:
  純抒發文，吐槽工作遇到的鳥事。
---

> ⚠️ 此篇文章單純抒發，毫無技術可言

最近換了新工作，部落格因此停更了一個月，加上自己也是想動筆卻不知道寫些什麼\
當初創建這個部落格主要是想分享自己在工作或開發所學\
但沒想到第一篇與工作有關的文章似乎會是個吐槽鬼故事(?)

在新公司沒有 CI/CD 當然也就沒有所謂的自動化測試\
而老鳥也沒有設中斷點 Debug 的習慣，所以每個~~攻城屍~~名副其實都在看 log、放乖乖、通靈 Debug

在最近我剛完成進公司的第一份需求後，向主管說明自己其實還滿耐操的\
希望能有多一點的事情可以做\
![像這種要求我這輩子沒見過](https://memeprod.sgp1.digitaloceanspaces.com/user-wtf/1686207131319.jpg)

後來我的主管給了我一包 source code\
未來需要開發成海外專案，希望我整理並推上 Azure DevOps repo

這包 source code 跟大部分網路上的鬼故事一樣，內容有好幾個 .NET 方案\
這些方案也都是很老舊的 .NET Framework 專案\
看起來都長年失修 code smell 異常的香

更慘的是這些方案並沒有代碼託管\
主管也是透過 OneDrive 給我這包 source code\
因為都在亂版控的關係，我下載到懷疑人生\
每個方案都只有 `git add .` 然後也沒在 commit\
有 git 的方案都是這樣處理\
~~**全部都在版控身體健康的**~~

![git add .](https://preview.redd.it/idpfdaayxie71.jpg?width=640&crop=smart&auto=webp&s=0e2ba5d1617f5eebc4aa181ad3937df674e51391)
<div class="text-center">圖片至少還 commit 了一下</div>

更不用說沒有 .gitignore，這裡文化就是這樣\
建置好的 binaries 跟 DLLs 都 add 納入版控 (雖然這包 code 都是 add 心酸的)

我開始著手整理每個方案\
其中一個方案也有在做版控\
而且分支名稱還是在這間公司不可能會出現的 `feature/AFeature` \
我心想「終於遇到一個正常一點的工程師了，而且分支名稱還帶有 git flow，雖然一樣還是在亂版控」

內心喜憂參半，因為這個人版控跟其他人一樣\
都只有 `git add .`，一樣也是版控心酸沒在 commit 的\
我內心懷著一半的感激在整理這個方案的版控

在不破壞他的開發進度的方式下\
我一樣使用 `git rm --cached .` ，並且整理 .gitignore\
重新 `git add .` 後加上 commit\
當我切回 `master` 並將剛剛整理好的 feature 分支 merge 回 `master` 的時候出現以下錯誤
```bash
fatal: refusing to merge unrelated histories
```
![dafuq](https://s.yimg.com/ny/api/res/1.2/1KIdjxhzNp_zeQAvo8BI5w--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTM2MA--/https://s.yimg.com/os/creatr-uploaded-images/2021-10/3294ec50-37bd-11ec-beeb-a359b2e3a2be)


因為兩個分支沒有共同祖先\
兩個分支來歷完全不同\
他媽的到底要怎麼版控才有辦法版控成這樣啊？~~（氣到我都罵髒話了）~~\
我的臉瞬間變成附圖的成龍 meme\
這間公司整個資訊處有 50 多個工程師，難道沒有 1 個正常的工程師嗎？

---

## 後記

一個專案，兩個不同來歷的分支...\
而且開發、維護的人已經不知道在哪了...\
在沒人知道這包 source code 的情況下，我最後決定將 `master` 完全對齊 `feature/AFeature`\
最後活著的分支是 `feature/AFeature` ，它應該是目前唯一可信的版本吧(?)\
`master` 沒人維護、也沒有可靠歷史，硬要合併只會製造一堆沒意義的 commit 和 conflict
```bash
git checkout master
git reset --hard feature/AFeature
git push origin master
```
做到這樣也只是找個方法收工罷了...

這間公司除了鬼故事之外\
其實最讓我受不了應該是程式碼品質低落不堪\
像是在 constructor 寫 `try-catch`\
又或是
```cs
foreach (var item in Collection) { Collection.IndexOf(item); }
```
這種不知道自己在寫什麼的 code\
想分享出來做成負面教材，不過高機率會變成笑話集反而沒什麼教育意義吧 💀