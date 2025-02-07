/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
*
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
*
* License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
*
* ---------------------------------------------------
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
* to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of
* the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/
import { defineComponent, inject, reactive, unref } from 'vue';

import { PropTypes } from '@bkui-vue/shared';

import { BK_COLUMN_UPDATE_DEFINE, PROVIDE_KEY_INIT_COL, PROVIDE_KEY_TB_CACHE } from '../const';
import { Column, IColumnType } from '../props';

export type ITableColumn = Column & {
  prop?: string | Function,
  index?: number
};

export default defineComponent({
  name: 'TableColumn',
  props: {
    ...IColumnType,
    prop: PropTypes.oneOfType([PropTypes.func.def(() => ''), PropTypes.string.def('')]),
    index: PropTypes.number.def(undefined),
  },
  setup(props: ITableColumn) {
    const initColumns = inject(PROVIDE_KEY_INIT_COL, (_col: ITableColumn | ITableColumn[], _rm = false) => {}, false);
    const bkTableCache = inject(PROVIDE_KEY_TB_CACHE, { queueStack: (_, fn) => fn?.() });
    const column = reactive({ ...props, field: props.prop || props.field });
    return {
      initColumns,
      bkTableCache,
      column,
    };
  },
  unmounted() {
    this.updateColumnDefine(true);
  },
  mounted() {
    this.updateColumnDefine();
  },
  methods: {
    updateColumnDefine(unmounted = false) {
      if (this.$props.index !== undefined && typeof this.$props.index === 'number') {
        this.updateColumnDefineByIndex(unmounted);
        return;
      }

      this.updateColumnDefineByParent();
    },
    updateColumnDefineByParent() {
      const fn = () => {
        // @ts-ignore
        const selfVnode = (this as any)._;
        const colList = selfVnode.parent.vnode.children.default() || [];
        const sortColumns = [];
        const reduceColumns = (nodes) => {
          if (!Array.isArray(nodes)) {
            return;
          }
          nodes.forEach((node: any) => {
            if (Array.isArray(node)) {
              reduceColumns(node);
              return;
            }

            let skipValidateKey0 = true;
            if (node.type?.name === 'TableColumn') {
              skipValidateKey0 = Object.hasOwnProperty.call(node.props || {}, 'key');
              const resolveProp = {
                ...node.props,
                field: node.props.prop || node.props.field,
                render: node.children?.default,
              };
              sortColumns.push(unref(resolveProp));
            }

            if (node.children?.length && skipValidateKey0) {
              reduceColumns(node.children);
            }
          });
        };
        reduceColumns(colList);
        this.initColumns(sortColumns);
      };

      if (typeof this.bkTableCache.queueStack === 'function') {
        this.bkTableCache.queueStack(BK_COLUMN_UPDATE_DEFINE, fn);
      }
    },
    updateColumnDefineByIndex(unmounted = false) {
      const resolveProp = {
        ...this.$props as Column,
        field: this.$props.prop || this.$props.field,
        render: this.$slots.default,
      };
      this.initColumns(unref(resolveProp), unmounted);
    },
  },
  render() {
    return <>{ this.$slots.default?.({ row: {} }) }</>;
  },
});
