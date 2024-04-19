<template>
  <div>
    <bk-timeline :list="state.list" @select="timeLineChanged" />
  </div>
</template>
<script>
import { defineComponent, h, reactive } from 'vue';
import { BkButton } from '@bkui-vue/button';
import { Success, Spinner } from '@bkui-vue/icon';

export default defineComponent({
  setup() {
    const state = reactive({
      list: [
        {
          tag: h(BkButton, {
            theme: 'primary',
          }, '一天前'),
          content: '由pony上线到蓝鲸市场',
          size: 'large',
          nodeType: 'vnode'
        },
        {
          tag: '步骤1',
          content: h('span', {
            style: {
              color: 'gold',
              fontWeight: 'bold',
            },
          }, [
            h(Success, {
              style: {
                marginRight: '5px',
              },
              fill: '#2DCB56',
            }),
            h(Spinner, {
              style: {
                marginRight: '5px',
              },
              fill: '#3A84FF',
            }),
          ]),
          nodeType: 'vnode'
        },
        {
          tag: '步骤2',
          content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
          nodeType: 'template',

        },
        {
          tag: '步骤3',
          content: '<span style="font-size: 12px;">2021-12-15 11:00</span>',
        },
        {
          tag: '步骤4',
          content: '<span style="font-size: 12px;">2022-12-15 11:00</span>',
        },
      ],
    });

    // 改变当前选中值
    const timeLineChanged = (data) => {
      alert(`选择了：${data.tag}`);
    };
    return {
      state,
      timeLineChanged,
    };
  },
});

</script>
