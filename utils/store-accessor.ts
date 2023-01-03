import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';

import auth from '~/store/auth';
import file from '~/store/file';
import history from '~/store/history';
import score from '~/store/score';

import engine from '~/store/engine';
import log from '~/store/log';
import notification from '~/store/notification';

import PocketBase from 'pocketbase';
import osmd from '~/store/osmd';
import settings from '~/store/settings';


let authStore: auth;
let fileStore: file;
let historyStore: history;
let scoreStore: score;

let engineStore: engine;
let logStore: log;
let notificationStore: notification;
let osmdStore: osmd;
let settingsStore: settings;

let $axios: NuxtAxiosInstance;
let $pb: PocketBase;

function initialiseAxios(axiosInstance: NuxtAxiosInstance) {
    $axios = axiosInstance;
}

function initialisePocketbase(pocketbase: PocketBase) {
    $pb = pocketbase;
}

function initialiseStores(store: Store<any>): void {
    authStore = getModule(auth, store)
    fileStore = getModule(file, store)
    historyStore = getModule(history, store);
    scoreStore = getModule(score, store)

    engineStore = getModule(engine, store)
    logStore = getModule(log, store)
    notificationStore = getModule(notification, store)
    osmdStore = getModule(osmd, store)
    settingsStore = getModule(settings, store)
}

export {
    initialiseStores,
    initialiseAxios,
    initialisePocketbase,
    $axios,
    $pb,
    authStore,
    fileStore,
    historyStore,
    scoreStore,
    engineStore,
    logStore,
    notificationStore,
    osmdStore,
    settingsStore
};
