DEVEL
====

記載の内容は、基本的にUbuntu上の都合

# 開発TIPS
未分類の雑多な知見をここに記載

## npm install等アクセスできない
https://github.com/nodejs/node/issues/41145
IPv6優先となっていることが原因
IPv4指定する
export NODE_OPTIONS=--dns-result-order=ipv4first

https://qiita.com/htshozawa/items/77dd0be079cdf817a5a6
IPv6を無効にする
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.lo.disable_ipv6=1
sudo をかけてncuをインストールする場合などはこちらである必要がある様子


## web-extのfirefoxが起動しない
Firefox が Ubuntu Snap パッケージであることが原因で、web-extから起動しない
https://github.com/mozilla/web-ext/issues/1696

`TMPDIR=tmp/ `として、アクセスできるtmpディレクトリを用意して指定してやることで対処


## 他ディスク上の拡張を読み込めない(firefox,chromium)
firefox,chromium共に、拡張(manifest.json)を正常に読み込めない
(web-ext等で拡張を読み込んで起動することができない)
作業ディレクトリを別ディスクにした際に発生する
どうやら原因として、ブラウザはマウントした他ディスクから拡張を読み込めない模様
(Snapパッケージであることが原因か？)
プロジェクトをHOME等に移動して対応

なお、GUI操作から試すとそれぞれ、
- FireFoxは読み込めるが、アイコンが壊れており機能しない
- chromiumではそもそも選択ダイアログで他ディスクにアクセスできない
