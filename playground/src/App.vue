<script setup lang="ts">
import { createQrcode, Point, EyeShape } from '../../src/index';
import type { QrcodeProps } from '../../src/index';
import { reactive, ref, watchEffect } from 'vue';

const qrcodeUrl = ref<string>();
const config = reactive<QrcodeProps>({
  codeColor: '#000',
  codeBgColor: '#fff',
  margin: 0,
  error: 'Q',
  version: 28,
  point: Point.Normal,
  eyeShape: EyeShape.Square,
  eyeOuterColor: '#000',
  eyeInnerColor: '#000',
  content: 'https://github.com/chaihuibin926/qrcode-beautify',
});
const errorInfo = ref<string>();

watchEffect(() => {
  if (config.content) {
    try {
      createQrcode(config, (dataUrl) => {
        qrcodeUrl.value = dataUrl;
        errorInfo.value = undefined;
      });
    } catch (error) {
      errorInfo.value = (error as Error).message;
    }
  }
});
</script>

<template>
  <div class="form">
    <textarea v-model="config.content"></textarea>
    <div>
      <label>version: {{ config.version }}</label>
      <div class="flex-items">
        1 <input type="range" min="1" max="40" v-model="config.version" /> 40
      </div>
    </div>
    <div>
      <label>codeColor: {{ config.codeColor }}</label>
      <div class="flex-items">
        <input type="color" v-model="config.codeColor" />
      </div>
    </div>
    <div>
      <label>codeBgColor: {{ config.codeBgColor }}</label>
      <div class="flex-items">
        <input type="color" v-model="config.codeBgColor" />
      </div>
    </div>
    <div>
      <label>eyeOuterColor: {{ config.eyeOuterColor }}</label>
      <div class="flex-items">
        <input type="color" v-model="config.eyeOuterColor" />
      </div>
    </div>
    <div>
      <label>eyeInnerColor: {{ config.eyeInnerColor }}</label>
      <div class="flex-items">
        <input type="color" v-model="config.eyeInnerColor" />
      </div>
    </div>
  </div>
  <br />
  <div>
    <p v-if="errorInfo" style="color: red">{{ errorInfo }}</p>
    <img v-if="qrcodeUrl" :src="qrcodeUrl" alt="" />
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.flex-items {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
