---
date: 2021-07-08 10:25
title: vue基于codemirror的sql编辑器组件
categories:
  - javascript
  - vue
tags:
  - 前端
  - JavaScript
  - vue
  - sql编辑器
---

```javascript

<template>
  <div class="sql-editor">
    <codemirror class="cm-editor" v-model="subValue" :options="cmOption" ref="cmEditor" />
    <div class="editor-footer">
      <div class="fr">
        <el-button @click="format">格式化sql</el-button>
        <el-button>测试SQL语句合法性</el-button>
        <el-button>取消</el-button>
        <el-button>保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/addon/hint/show-hint.css'
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/sql-hint'

import { format } from 'sql-formatter'

import modelMixins from '@/mixins/modelMixins'


export default {
  name: 'codemirror-example-mysql',
  components: {
    codemirror
  },
  mixins:[modelMixins],
  data() {
    return {
      cmOption: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        matchBrackets: true,
        mode: 'text/x-mysql',
        theme: 'solarized light',
        hintOptions: {
          completeSingle: false
        }
      },
      code: 'select * from users where id = "12"'
    }
  },
  computed: {
    codemirror() {
      return this.$refs.cmEditor.codemirror
    }
  },
  mounted() {
    console.log('the current CodeMirror instance object:', this.codemirror)
    this.codemirror.setSize('auto','640px');
    this.codemirror.on('inputRead', () => {
      this.codemirror.showHint()
    })
  },
  methods:{
    format() {
      let sqlContent = this.codemirror.getValue()
      this.codemirror.setValue(format(sqlContent))
    },
  }
}
</script>
<style scoped lang="scss">
.CodeMirror {
  border: 1px solid #eee;
  height: auto;
}

.CodeMirror-scroll {
  height: auto;
  overflow-y: hidden;
  overflow-x: auto;
}
.sql-editor{
  width: 100%;
  height: 100%;
  .cm-editor{
    width: 100%;
    min-height: 400px;
  }
  .editor-footer{
    margin-top: 10px;
  }
}
</style>
```
