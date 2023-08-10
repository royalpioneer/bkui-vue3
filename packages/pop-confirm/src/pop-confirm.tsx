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
import { defineComponent, ref } from 'vue';

import BkButton from '@bkui-vue/button';
import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import BkPopover from '@bkui-vue/popover';

import props from './props';

export default defineComponent({
  name: 'PopConfirm',
  components: { BkPopover, BkButton },
  props,
  emits: ['confirm', 'cancel'],
  setup(props, { emit, slots }) {
    const visible = ref(false);
    const t = useLocale('popConfirm');

    function ensure(e: Event) {
      visible.value = false;
      emit('confirm');
      e.stopPropagation();
    }

    function cancel(e: Event) {
      visible.value = false;
      emit('cancel');
      e.stopPropagation();
    }

    function renderIcon() {
      if (typeof slots.icon === 'function') {
        return slots.icon();
      }
      return props.icon;
    }

    const icon = renderIcon();

    const { resolveClassName } = usePrefix();

    return () => (
      <BkPopover
        isShow={visible.value}
        trigger={props.trigger}
        theme={props.theme}
        width={props.width}
        onAfterShow={() => visible.value = true}
        extCls={`${resolveClassName('pop-confirm-box')}`}>
        {{
          default: () => slots.default(),
          content: () => (
            <div class={`${resolveClassName('pop-confirm')}`}>
              {typeof slots.content === 'function' ? slots.content() : (
                <>
                  {props.title ? (
                    <div class={`${resolveClassName('pop-confirm-title')}`}>
                      {icon ? <span class={`${resolveClassName('pop-confirm-icon')}`}>{icon}</span> : ''}
                      <span>{props.title}
                   </span>
                    </div>
                  ) : ''}
                  <div class={`${resolveClassName('pop-confirm-content')}`}>
                    {!props.title ? icon : ''}
                    {props.content}
                  </div>
                </>
              )}
              <div class={`${resolveClassName('pop-confirm-footer')}`}>
                <BkButton onClick={ensure} size="small" theme="primary">{t.value.ok}</BkButton>
                <BkButton onClick={cancel} size="small">{t.value.cancel}</BkButton>
              </div>
            </div>
          ),
        }}
      </BkPopover>
    );
  },
});
