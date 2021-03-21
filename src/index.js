import GuitarTuner from "./guitar-tuner.vue";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("guitar-tuner", GuitarTuner);
}

const plugin = {
  install,
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

GuitarTuner.install = install;

export default GuitarTuner;
