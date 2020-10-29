import React from 'react';
import { Localization } from 'material-table';

const defaultLocalization: Localization = {
  grouping: { placeholder: '拖动表头到这里进行分组', groupedBy: '分组' },
  toolbar: {
    nRowsSelected: number => `已选择 ${number} 行`,
    searchPlaceholder: '搜索',
  },
  pagination: {
    labelRowsSelect: '条',
    firstTooltip: '第一页',
    lastTooltip: '最后一页',
    nextTooltip: '下一页',
    previousTooltip: '上一页',
  },
  body: {
    emptyDataSourceMessage: '没有更多内容',
    editRow: {
      cancelTooltip: '取消编辑',
      saveTooltip: '保存',
    },
    editTooltip: '编辑',
  },
  header: {
    actions: <div style={{ width: 60 }}>操作</div>,
  },
};

export default defaultLocalization;
