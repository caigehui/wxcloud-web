# wxcloud-web

English | [中文](/README-CN.md)

wxcloud is a opensource DevOps platform, currently support single node.

wxcloud-web is the front-end part of wxcloud platform.

<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.3-blue.svg?cacheSeconds=2592000" />  
  <a href="#" target="_blank">
    <img alt="License: BSD" src="https://img.shields.io/badge/License-BSD-yellow.svg" />
  </a>
</p>


## Demo

click [here](http://245.wxsoft.cn) to preview online demo

![demo](/public/demo.gif)


## Features

**Server management**
  * **Server Registration**: append your servers to wxcloud, then you can connect them remotely.
  * **Trusted communication**: provides self-signed certificate, preventing third-party from token impersonation attack
  * **Server monitoring**: helps you monitor docker performance, including CPU and memory usage for individual docker container
  * **Local images**: helps you manage local images on the server
  * **container management**: similar to `docker run [args]` command, you can use this module to manage containerized application effiectively through GUI
  * **API gateway**: `Kong` opensource gateway, currently support service registration for docker containers.
  * **API docs**: helps developer generate API documentation and test API immediately
  * **API logs**: check logs with user, duration, request params and response 
  * **Job logs**: check scheduled jobs' logs 

**Releases**
  * **auto**: when someone push a new version tag, eg 1.0.1, then wxcloud will extract git commit messages and generate as a release object

**Images**
  * **Harbor**: check image repositry status by Harbor API.

**Build**
  * **CI/CD**: when someone push a git commit, gitlab will trigger a webhook provided by wxcloud, then wxcloud pulls the repo and starts building docker image.
  * **Logs**: same as gitlab pineline, you can check build logs if a build is failed.

**Develop**: 
  * **Project**: list gitlab projects. You can create project, and it will add wxcloud CI/CD webhooks automatically 
  * **Online IDE(I'm working on it)**: 