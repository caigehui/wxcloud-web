# WxEAP

## 安全可靠

基于BSD协议的parse-server

BSD许可证原先是用在加州大学柏克利分校发表的各个4.4BSD/4.4BSD-Lite版本上面（BSD是Berkly Software Distribution的简写）的，后来也就逐渐沿用下来。1979年加州大学伯克利分校发布了BSD Unix，被称为开放源代码的先驱，BSD许可证就是随着BSD Unix发展起来的。

BSD授权许可证(FreeBSD Copyright Information)具有多种授权许可证。总的来说你可以对软件任意处理，只要你在软件中注明其是来自于那个项目的就可以了。也就是说你具有更大的自 由度来处置软件。如果你对软件进行了修改，你可以限制其他使用者得到你修改的软件的自由。

BSD授权许可证没有实现"通透性"自由，也就是其不保证软件源代码开放的连续性。这样如果你希望采用别人开发的BSD软件，进行一些修改，然后作为产品卖，或者仅仅保密自己的做的一些除了软件开发以外的工作，那么你就可以从中得利。

从赚钱为目的的商务角度看来，如果你使用了BSD授权许可证的软件，那么你就可以任意进行。

只要不是GPL协议的开源代码都可以商业使用

所有依赖，大部分是MIT协议和Apache协议（几乎无任何限制），另外我们使用国内淘宝的NPM镜像，所以完全不用担心被美国限制

## 必须按照的VSCode插件

* Prettier - 格式化排版
* ESlint - eslint提示

## TroubleShooting

* Q: 无法push到harbor仓库

    A: 由反向代理引起的问题，只需要在registry的配置(config.yml)中加上
    ```
    http:
      relativeurls: true
    ```
