// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import LocationEmitter from "./location";

const emitters = {
  open: emitOpen,
  click: emitClick,
  clickAt: emitClick,
  doubleClick: emitDoubleClick,
  doubleClickAt: emitDoubleClick,
  dragAndDropToObject: emitDragAndDrop,
  type: emitType,
  sendKeys: emitType,
  echo: emitEcho
};

export function emit(command) {
  return new Promise(async (res, rej) => {
    if (emitters[command.command]) {
      let result = await emitters[command.command](command.target, command.value);
      res(result);
    } else {
      rej(command.command ? `Unknown command ${command.command}` : "Command can not be empty");
    }
  });
}

export default {
  emit
};

function emitOpen(target) {
  return Promise.resolve(`driver.get(BASE_URL + "${target}");`);
}

async function emitClick(target) {
  return Promise.resolve(`driver.findElement(${await LocationEmitter.emit(target)}).then(element => {driver.actions().click(element).perform();});`);
}

async function emitDoubleClick(target) {
  return Promise.resolve(`driver.findElement(${await LocationEmitter.emit(target)}).then(element => {driver.actions().doubleClick(element).perform();});`);
}

async function emitDragAndDrop(dragged, dropzone) {
  return Promise.resolve(`driver.findElement(${await LocationEmitter.emit(dragged)}).then(dragged => {driver.findElement(${await LocationEmitter.emit(dropzone)}).then(dropzone => {driver.actions().dragAndDrop(dragged, dropzone).perform();});});`);
}

async function emitType(target, value) {
  return Promise.resolve(`driver.findElement(${await LocationEmitter.emit(target)}).then(element => {driver.actions().click(element).sendKeys("${value}").perform();});`);
}

async function emitEcho(message) {
  return Promise.resolve(`console.log("${message}");`);
}
