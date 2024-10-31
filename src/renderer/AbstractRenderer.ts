import { RendererPlugin } from "@/types/renderer";

export default class AbstractRenderer {
  private plugins: RendererPlugin[] = [];

  registerPlugin(plugin: RendererPlugin) {
    const index = this.plugins.findIndex((p) => p === plugin);
    if (index === -1) {
      this.plugins.push(plugin);
    }
  }

  unregisterPlugin(plugin: RendererPlugin) {
    const index = this.plugins.findIndex((p) => p === plugin);
    if (index > -1) {
      this.plugins.splice(index, 1);
    }
  }

  getPlugins() {
    return this.plugins;
  }

  getPlugin(name: string) {
    return this.plugins.find((plugin) => plugin.name === name);
  }
}
